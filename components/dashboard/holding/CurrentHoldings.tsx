/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions } from "@/app/api";
import CardHeaderHoldings from "./CardHeaderHoldings";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type ExtendedTransaction = Transaction & { fullAmounts: number };

export function CurrentHoldings() {
  const { user } = useUser();

  const { data = [] } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
    refetchInterval: 60000,
  });

  const dataUserId = data?.filter((item) => item.userId === user?.id);
  const totals = dataUserId?.map((item) => item.total) ?? [];
  const totalSum = (totals ?? []).reduce((acc, curr) => acc + curr, 0);

  const [activeMonth, setActiveMonth] = React.useState("");

  const groupedTotals = dataUserId?.reduce((acc, transaction) => {
    if (!acc[transaction.crypto]) {
      acc[transaction.crypto] = 0;
    }
    acc[transaction.crypto] += transaction.total;
    return acc;
  }, {} as { [key: string]: number });

  const averagePrices = dataUserId?.reduce((acc, transaction) => {
    if (!acc[transaction.crypto]) {
      acc[transaction.crypto] = { total: 0, count: 0 };
    }
    acc[transaction.crypto].total += transaction.price;
    acc[transaction.crypto].count += 1;
    return acc;
  }, {} as { [key: string]: { total: number; count: number } });

  const averagePricesResult = averagePrices
    ? Object.keys(averagePrices).reduce((acc, crypto) => {
        acc[crypto] = averagePrices[crypto].total / averagePrices[crypto].count;
        return acc;
      }, {} as { [key: string]: number })
    : ({} as { [key: string]: number });

  const groupedAmounts = dataUserId?.reduce((acc, transaction) => {
    if (!acc[transaction.crypto]) {
      acc[transaction.crypto] = 0;
    }
    acc[transaction.crypto] += transaction.amount;
    return acc;
  }, {} as { [key: string]: number });

  const groupedTransactions = dataUserId?.reduce((acc, transaction) => {
    if (!acc[transaction.crypto]) {
      acc[transaction.crypto] = { ...transaction, total: 0 };
    }
    acc[transaction.crypto].total += transaction.price;
    return acc;
  }, {} as { [key: string]: Transaction & { total: number } });

  const groupedTransactionsArray: ExtendedTransaction[] = groupedTransactions
    ? Object.values(groupedTransactions).map((transaction) => {
        const fullAmounts =
          groupedAmounts[transaction.crypto] *
          averagePricesResult?.[transaction.crypto];
        return { ...transaction, fullAmounts } as ExtendedTransaction;
      })
    : [];

  React.useEffect(() => {
    if (data) {
      const highestAmountItem = data.reduce((prev, current) => {
        return prev.total > current.total ? prev : current;
      }, data[0]);
      setActiveMonth(highestAmountItem?.crypto);
    }
  }, [data]);

  const totalsByCrypto: { [key: string]: number } = {};

  dataUserId?.forEach((item) => {
    if (totalsByCrypto[item.crypto]) {
      totalsByCrypto[item.crypto] += item.total;
    } else {
      totalsByCrypto[item.crypto] = item.total;
    }
  });

  // Calcular los porcentajes y ordenar de mayor a menor
  const sortedTransactionsArray = groupedTransactionsArray
    .map((transaction) => {
      const percentage =
        ((groupedAmounts[transaction.crypto] *
          averagePricesResult?.[transaction.crypto]) /
          totalSum) *
        100;
      return { ...transaction, percentage };
    })
    .filter((transaction) => transaction.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <Card className="flex flex-col">
      <CardHeaderHoldings />
      <CardContent className="">
        <ScrollArea className="h-[12rem]">
          {dataUserId && dataUserId.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {sortedTransactionsArray.map((transaction, index) => (
                <div
                  key={index}
                  className="flex gap-2 justify-between items-center p-3 bg-gray-700/90 rounded-xl"
                >
                  <div className="flex items-center ">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <Image
                          src={`https://cryptocompare.com/${transaction.imageUrl}`}
                          width={30}
                          height={30}
                          alt={transaction.crypto}
                        />
                        <p className="text-sm text-gray-400">
                          {transaction.crypto}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-white font-semibold text-md">
                      {transaction.percentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto aspect-square w-full max-w-[300px] flex items-center justify-center">
              <p className="text-center text-gray-500">
                No current holdings loaded yet.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
