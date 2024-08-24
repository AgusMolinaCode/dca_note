/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions, getMultipleCryptos, loadValues } from "@/app/api";
import CurrentBalanceItem from "./CurrentBalanceItem";
import { useUser } from "@clerk/clerk-react";
import CurrentTodayProfitItem from "./CurrentTodayProfitItem";
import CurrentPercentajeProfitItem from "./CurrentPercentajeProfitItem";
import useCryptoCalculations from "@/hooks/useCryptoCalculations";

type CryptoPrices = {
  [key: string]: {
    USD: number;
  };
};

const CurrentBalance = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({});
  const [cryptoAmounts, setCryptoAmounts] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const { sumCounts } = useCryptoCalculations();

  const { user } = useUser();

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery(
    {
      queryKey: ["items"],
      queryFn: loadTransactions,
      refetchInterval: 900000,
    }
  );

  const { data: valuesData, isLoading: isLoadingValues } = useQuery({
    queryKey: ["values"],
    queryFn: loadValues,
  });

  const dataUserId = transactionsData?.filter(
    (item) => item.userId === user?.id
  );
  const allCryptos = dataUserId?.map((item) => item) || [];

  useEffect(() => {
    if (transactionsData) {
      const tempMap = new Map();

      transactionsData.forEach((item) => {
        if (!tempMap.has(item.crypto)) {
          tempMap.set(item.crypto, item.amount);
        }
      });

      const uniqueCryptos = Array.from(tempMap.keys());
      const uniqueAmounts = Array.from(tempMap.values());
      setCryptoAmounts(uniqueAmounts);

      getMultipleCryptos(uniqueCryptos.join(","))
        .then((result) => {
          const prices: CryptoPrices = {};
          Object.entries(result).forEach(([key, crypto]) => {
            prices[key] = { USD: crypto.USD };
          });
          setCryptoPrices(prices);
        })
        .catch((error) => console.error("Error", error));
    }
  }, [transactionsData]);

  useEffect(() => {
    let sum = 0;
    dataUserId?.forEach((item) => {
      if (cryptoPrices[item.crypto]) {
        const value = item.amount * cryptoPrices[item.crypto]?.USD || 0;
        sum += value;
      }
    });
    setTotalValue(sum);
  }, [cryptoPrices, dataUserId]);

  useEffect(() => {
    let investedSum = 0;
    valuesData?.forEach((item) => {
      if (item.userId === user?.id) {
        investedSum += item.total || 0;
      }
    });
    setTotalInvested(investedSum);
  }, [valuesData, user]);

  const formattedTotalValue = totalValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedProfitUnrealizedValue = totalValue - sumCounts();
  const formattedProfitUnrealized =
    formattedProfitUnrealizedValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  return (
    <div className="w-full">
      {dataUserId && dataUserId.length > 0 ? (
        <div className="rounded-lg bg-card text-card-foreground shadow-sm flex flex-col w-full">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-500">Balance</h1>
              <p className="text-gray-500 text-md font-semibold">24h</p>
            </div>
            <div>
              <p className="text-4xl font-semibold pt-2">
                {formattedTotalValue}
              </p>
              {isLoadingTransactions ? (
                <p>
                  <span className="text-gray-500 text-md font-semibold flex justify-center items-center mx-auto">
                    Loading...
                  </span>
                </p>
              ) : (
                <div className="pt-2 flex justify-start gap-2">
                  <CurrentPercentajeProfitItem
                    formattedTotalValue={formattedTotalValue}
                    allCryptos={allCryptos}
                  />
                </div>
              )}
            </div>
            <div>
              {isLoadingTransactions ? (
                <p>
                  <span className="text-gray-500 text-md font-semibold flex justify-center items-center mx-auto h-44">
                    Loading...
                  </span>
                </p>
              ) : (
                <div className="pt-2">
                  <CurrentBalanceItem
                    title="Total Profit"
                    description="The profit you have made from selling assets."
                    value={totalInvested.toFixed(2)}
                  />
                  <CurrentTodayProfitItem
                    totalValue={totalValue}
                    allCryptos={allCryptos}
                  />

                  <CurrentBalanceItem
                    title="Unrealized Profit"
                    description="The profit you would make if you sold all your assets at the current market price."
                    value={formattedProfitUnrealized.toString()}
                    classNameValue={
                      formattedProfitUnrealizedValue > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  />
                  <CurrentBalanceItem
                    title="Total Invested"
                    description="The total amount of money you have invested in your account."
                    value={(sumCounts() - totalInvested).toFixed(2).toString()}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto aspect-square w-full max-w-[300px] flex items-center justify-center">
          <p className="text-center text-gray-500">
            No current balance loaded yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrentBalance;
