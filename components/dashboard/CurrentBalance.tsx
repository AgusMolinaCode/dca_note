/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions, getMultipleCryptos } from "@/app/api";
import CurrentBalanceItem from "./CurrentBalanceItem";
import { useUser } from "@clerk/clerk-react";
import CurrentTodayProfitItem from "./CurrentTodayProfitItem";
import CurrentPercentajeProfitItem from "./CurrentPercentajeProfitItem";

type CryptoPrices = {
  [key: string]: {
    USD: number;
  };
};

const CurrentBalance = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({});
  const [cryptoAmounts, setCryptoAmounts] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
    refetchInterval: 900000,
  });

  const dataUserId = data?.filter((item) => item.userId === user?.id);
  const allCryptos = dataUserId?.map((item) => item) || [];

  useEffect(() => {
    if (data) {
      const tempMap = new Map();

      data.forEach((item) => {
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
        .catch((error) =>
          console.error("Error al obtener precios de criptomonedas:", error)
        );
    }
  }, [data]);

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
    let sum = 0;
    dataUserId?.forEach((item) => {
      sum += item?.total;
    });
    setTotalSum(sum);
  }, [dataUserId]);

  const formattedTotalSum = totalSum.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedTotalValue = totalValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedProfitUnrealizedValue = totalValue - totalSum;
  const formattedProfitUnrealized =
    formattedProfitUnrealizedValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-500">Current Balance</h1>
        <p className="text-gray-500 text-md font-semibold">24h</p>
      </div>
      <div>
        <p className="text-4xl font-semibold pt-4">{formattedTotalValue}</p>
        {isLoading ? (
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
      {isLoading ? (
        <p>
          <span className="text-gray-500 text-md font-semibold flex justify-center items-center mx-auto h-44">
            Loading...
          </span>
        </p>
      ) : (
        <div className="pt-4">
          <CurrentTodayProfitItem
            totalValue={totalValue}
            allCryptos={allCryptos}
          />

          <CurrentBalanceItem
            title="Total Profit"
            description="The profit you have made from selling assets."
            value={"$0.00"}
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
            value={formattedTotalSum.toString()}
          />
        </div>
      )}
    </div>
  );
};

export default CurrentBalance;
