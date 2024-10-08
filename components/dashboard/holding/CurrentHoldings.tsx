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

export function CurrentHoldings() {
  const { user } = useUser();

  const { data = [] } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
    refetchInterval: 60000,
  });

  const dataUserId = data?.filter((item) => item.userId === user?.id);

  const groupedAmounts = dataUserId?.reduce((acc, item) => {
    if (item.amount > 0) {
      const amountWithPrice = item.amount * item.price;
      if (acc[item.crypto]) {
        acc[item.crypto].amountWithPrice += amountWithPrice;
      } else {
        acc[item.crypto] = {
          amountWithPrice,
          imageUrl: item.imageUrl,
        };
      }
    }
    return acc;
  }, {} as { [key: string]: { amountWithPrice: number; imageUrl: string } });

  // Calcular el total de groupedAmounts
  const totalAmount = Object.values(groupedAmounts).reduce((acc, value) => acc + value.amountWithPrice, 0);

  // Calcular el porcentaje de cada criptomoneda
  const percentages = Object.keys(groupedAmounts).reduce((acc, key) => {
    acc[key] = (groupedAmounts[key].amountWithPrice / totalAmount) * 100;
    return acc;
  }, {} as { [key: string]: number });

  // Ordenar las criptomonedas por porcentaje de mayor a menor
  const sortedCryptos = Object.keys(groupedAmounts).sort((a, b) => percentages[b] - percentages[a]);

  return (
    <Card className="flex flex-col">
      <CardHeaderHoldings />
      <CardContent>
        <ScrollArea className="h-[12rem]">
          {dataUserId && dataUserId.length > 0 ? (
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-4">
              {sortedCryptos.map((crypto, index) => (
                <div
                  key={index}
                  className="flex gap-2 justify-between items-center p-2 md:p-3 border border-gray-200 dark:border-none bg-white dark:bg-gray-700/90 rounded-xl"
                >
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Image
                        src={`https://cryptocompare.com/${groupedAmounts[crypto].imageUrl}`}
                        width={30}
                        height={30}
                        alt={crypto}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                      <p className="text-xs dark:text-gray-500 text-gray-700">{crypto}</p>
                    <p className="text-gray-700 dark:text-white font-semibold text-sm">
                      {percentages[crypto].toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto h-[10rem] w-full max-w-[300px] flex items-center justify-center">
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