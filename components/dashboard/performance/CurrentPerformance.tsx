/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { loadTransactions } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const CurrentPerformance = () => {
  const { user } = useUser();

  const [profitValue, setProfitValue] = useState<{ [key: string]: number }>({});
  const [bestPerformance, setBestPerformance] = useState<{
    name: string;
    value: number;
    imageUrl: string;
  } | null>(null);
  const [worstPerformance, setWorstPerformance] = useState<{
    name: string;
    value: number;
    imageUrl: string;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });

  const dataUserId = data?.filter((item) => item.userId === user?.id);
  const cryptoJoin = dataUserId?.map((item) => item.crypto).join(",");

  const fetchFullCryptosData = async () => {
    if (cryptoJoin) {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoJoin}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
      );
      const data: CryptoListResult = await response.json();

      const prices: { [key: string]: number } = Object.keys(data.RAW).reduce(
        (acc, crypto) => {
          acc[crypto] = data.RAW[crypto as any].USD.CHANGEPCT24HOUR;
          return acc;
        },
        {} as { [key: string]: number }
      );

      setProfitValue(prices);

      let best = { name: "", value: -Infinity, imageUrl: "" };
      let worst = { name: "", value: Infinity, imageUrl: "" };

      const uniqueCryptos = new Set(dataUserId?.map((item) => item.crypto));

      if (uniqueCryptos.size > 1) {
        for (const item of dataUserId ?? []) {
          const change = prices[item.crypto];
          if (change > best.value) {
            best = { name: item.crypto, value: change, imageUrl: item.imageUrl };
          }
          if (change < worst.value) {
            worst = { name: item.crypto, value: change, imageUrl: item.imageUrl };
          }
        }

        setBestPerformance(best);
        setWorstPerformance(worst);
      } else {
        setBestPerformance(null);
        setWorstPerformance(null);
      }
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  const uniqueCryptos = new Set(dataUserId?.map((item) => item.crypto));

  return (
    <div className="bg-card text-card-foreground shadow-sm flex flex-col w-full">
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-lg font-semibold text-gray-500">Performance</h1>
        <p className="text-gray-500 text-md font-semibold">24h</p>
      </div>
      {uniqueCryptos.size > 1 ? (
        <div className="grid gap-2">
          {bestPerformance && (
            <div className="bg-gray-700/90 w-full px-4 h-16 items-center rounded-xl flex gap-2 justify-between">
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Image
                    src={`https://cryptocompare.com/${bestPerformance.imageUrl}`}
                    width={58}
                    height={58}
                    alt={bestPerformance.name}
                    className="rounded-full"
                  />
                  <ArrowUpCircle className="absolute bottom-1 left-9 w-6 h-6 text-green-500 p-[0.06rem] bg-black/90 rounded-full" />
                </div>
                <div>
                  <p className="text-gray-500 text-md">Top Gainer</p>
                  <p className="text-white font-semibold text-lg">
                    {bestPerformance.name}
                  </p>
                </div>
              </div>
              <div>
                <p
                  className={`${
                    (bestPerformance.value ?? 0) < 0
                      ? `text-red-500`
                      : `text-green-500`
                  } text-md font-semibold`}
                >
                  {bestPerformance.value.toFixed(2)}%
                </p>
              </div>
            </div>
          )}
          {worstPerformance && (
            <div className="bg-gray-700/90 w-full px-4 h-16 items-center rounded-xl flex gap-2 justify-between">
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Image
                    src={`https://cryptocompare.com/${worstPerformance.imageUrl}`}
                    width={58}
                    height={58}
                    alt={worstPerformance.name}
                    className="rounded-full"
                  />
                  <ArrowDownCircle className="absolute bottom-1 left-9 w-6 h-6 text-red-500 p-[0.06rem] bg-black/90 rounded-full" />
                </div>
                <div>
                  <p className="text-gray-500 text-md">Top Loser</p>
                  <p className="text-white font-semibold text-lg">
                    {worstPerformance.name}
                  </p>
                </div>
              </div>
              <div>
                <p
                  className={`${
                    (worstPerformance.value ?? 0) < 0
                      ? `text-red-500`
                      : `text-green-500`
                  } text-md font-semibold`}
                >
                  {worstPerformance.value.toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto aspect-square w-full max-w-[300px] h-[150px] flex items-center justify-center">
          <p className="text-center text-gray-500">
            {uniqueCryptos.size === 1
              ? "Add more transactions to see performance."
              : "No current performance loaded yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrentPerformance;