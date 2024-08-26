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
  // creamos una constante para separar los amounts de las transacciones no repetir item.crypto

    const groupedAmounts = dataUserId?.reduce((acc, item) => {
    if (item.amount > 0) { // Solo sumar si el amount es positivo
      const amountWithPrice = item.amount * item.price; // Multiplicar amount por item.price
      if (acc[item.crypto]) {
        acc[item.crypto] += amountWithPrice;
      } else {
        acc[item.crypto] = amountWithPrice;
      }
    }
    return acc;
  }, {} as { [key: string]: number });
  
  console.log("groupedAmounts", groupedAmounts);
  

  

  return (
    <Card className="flex flex-col">
      <CardHeaderHoldings />
      <CardContent className="">
        <ScrollArea className="max-h-[12rem]">
          {/* {dataUserId && dataUserId.length > 0 ? (
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
          )} */}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
