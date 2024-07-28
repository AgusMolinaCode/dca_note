/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import DeleteAssetModal from "./DeleteAssetModal";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

type DataTransactionProps = {
  data: Transaction[] | undefined;
};

interface CryptoCurrency {
  PRICE: number;
  OPEN24HOUR: number;
  HIGH24HOUR: number;
  LOW24HOUR: number;
  CHANGE24HOUR: number;
  CHANGEPCT24HOUR: number;
  CHANGEDAY: number;
  CHANGEPCTDAY: number;
  CHANGEHOUR: number;
  CHANGEPCTHOUR: number;
}

interface CryptoListResult {
  RAW: {
    [key: number]: {
      USD: CryptoCurrency;
    };
  };
}

const TradingViewWidgetNoSSR = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
    suspense: true,
    loading: () => (
      <div className="h-[400px] flex justify-center items-center">
        <p className="h-[400px] text-2xl lg:text-3xl text-white font-bold text-center flex justify-center items-center">
          Loading...
        </p>
      </div>
    ),
  }
);

const DataTransaction: React.FC<DataTransactionProps> = ({ data }) => {
  const { user } = useUser();

  const [value, setValue] = useState<{ [key: string]: number } | null>(null);
  const [profitValue, setProfitValue] = useState<{
    [key: string]: number;
  } | null>(null);
  const [percentageValue, setPercentageValue] = useState<{
    [key: string]: number;
  } | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  const dataUserId = data?.filter((item) => item.userId === user?.id);

  const groupedTotals = dataUserId?.reduce((acc, transaction) => {
    if (!acc[transaction.crypto]) {
      acc[transaction.crypto] = 0;
    }
    acc[transaction.crypto] += transaction.total;
    return acc;
  }, {} as { [key: string]: number });

  const sortedGroupedTotals = Object.keys(groupedTotals ?? {})
    .sort((a, b) => (groupedTotals?.[b] ?? 0) - (groupedTotals?.[a] ?? 0))
    .reduce((acc, key) => {
      acc[key] = groupedTotals?.[key] ?? 0;
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
    : null;

  const cryptoJoin = dataUserId?.map((item) => item.crypto).join(",");

  const fetchFullCryptosData = async () => {
    if (cryptoJoin) {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoJoin}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
      );
      const data: CryptoListResult = await response.json();

      // Extraer los precios de cada criptomoneda
      const prices: { [key: string]: number } = Object.keys(data.RAW).reduce(
        (acc, crypto) => {
          acc[crypto] = data.RAW[crypto as any].USD.PRICE;
          return acc;
        },
        {} as { [key: string]: number }
      );

      // Extraer 24hs profit de cada criptomoneda
      const profit: { [key: string]: number } = Object.keys(data.RAW).reduce(
        (acc, crypto) => {
          acc[crypto] = data.RAW[crypto as any].USD.CHANGE24HOUR;
          return acc;
        },
        {} as { [key: string]: number }
      );

      const percentage: { [key: string]: number } = Object.keys(
        data.RAW
      ).reduce((acc, crypto) => {
        acc[crypto] = data.RAW[crypto as any].USD.CHANGEPCT24HOUR;
        return acc;
      }, {} as { [key: string]: number });


      selectedSymbol === "" && setSelectedSymbol(`BINANCE:${Object.keys(data.RAW)[0]}USDT`);
     
      setPercentageValue(percentage);
      setProfitValue(profit);
      setValue(prices);
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  // Agrupar transacciones por criptomoneda y sumar los totales
  const groupedTransactions = dataUserId?.reduce((acc, transaction) => {
    if (!acc[transaction.crypto]) {
      acc[transaction.crypto] = { ...transaction, total: 0 };
    }
    acc[transaction.crypto].total += transaction.price;
    return acc;
  }, {} as { [key: string]: Transaction & { total: number } });

  const groupedTransactionsArray = groupedTransactions
    ? Object.values(groupedTransactions).sort(
        (a, b) =>
          (groupedTotals?.[b.crypto] ?? 0) - (groupedTotals?.[a.crypto] ?? 0)
      )
    : [];

  const handleRowClick = (crypto: string) => {
    setSelectedSymbol(`BINANCE:${crypto}USDT`);
  }

  return (
    <div>
      <div className="h-[368px] w-full">
        <TradingViewWidgetNoSSR
          symbol={selectedSymbol}
          theme={useTheme().resolvedTheme === "dark" ? "dark" : "light"}
          locale="en"
          interval="5"
          range="5D"
          style="3"
          timezone="Etc/UTC"
          height="400"
          width="100%"
          hide_legend={false}
          hide_side_toolbar={true}
          hide_top_toolbar={true}
        />
      </div>
      <div>
        {groupedTransactionsArray.length > 0 ? (
          <div className="w-full overflow-x-auto px-2 pb-2">
            <div className="flex justify-between items-center px-2 pt-4">
              <h2 className="text-lg font-semibold text-gray-500">Assets</h2>
            </div>
            <table className="w-full table-auto">
              <thead className="dark:bg-gray-800 bg-gray-600 pb-2 border-b border-gray-600">
                <tr className="text-left">
                  <th className="px-4 py-2 text-sm text-gray-400">Asset</th>
                  <th className="px-4 py-2 text-sm text-gray-400">
                    Current Price
                  </th>
                  <th className="px-4 py-2 text-sm text-gray-400">
                    Avg. Buy Price
                  </th>
                  <th className="px-4 py-2 text-sm text-gray-400">
                    24Hs Price Change
                  </th>
                  <th className="px-4 py-2 text-sm text-gray-400">
                    24Hs % Change
                  </th>
                  <th className="px-4 py-2 text-sm text-gray-400">
                    Total Invested
                  </th>
                  <th className="px-4 py-2 text-sm text-gray-400">
                    Current Profit
                  </th>
                  {/* <th className="px-4 py-2 text-sm text-gray-400 text-center">
                  Actions
                </th> */}
                </tr>
              </thead>
              <tbody className="dark:bg-gray-800 bg-gray-400">
                {groupedTransactionsArray.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-gray-600 hover:bg-gray-700 cursor-pointer duration-300"
                    onClick={() => handleRowClick(transaction.crypto)}
                  >
                    <td className="flex gap-1 items-center my-2">
                      <Image
                        src={`https://cryptocompare.com/${transaction.imageUrl}`}
                        alt={transaction.crypto}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <p className="px-4 py-2 text-md font-semibold">
                        {transaction.crypto}
                      </p>
                    </td>
                    <td className={`px-4 py-2 font-semibold`}>
                      {value?.[transaction.crypto] !== undefined
                        ? `$ ${value[transaction.crypto].toFixed(2)}`
                        : "$ 0.00"}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold  ${
                        (value?.[transaction.crypto] ?? 0) <
                        (averagePricesResult?.[transaction.crypto] ?? 0)
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      ${" "}
                      {averagePricesResult?.[transaction.crypto]?.toFixed(2) ??
                        "0.00"}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        profitValue?.[transaction.crypto] !== undefined &&
                        profitValue?.[transaction.crypto] < 0
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      ${" "}
                      {profitValue?.[transaction.crypto] !== undefined
                        ? profitValue[transaction.crypto].toFixed(2)
                        : "0.00"}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        percentageValue?.[transaction.crypto] !== undefined &&
                        percentageValue?.[transaction.crypto] < 0
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {percentageValue?.[transaction.crypto] !== undefined
                        ? percentageValue[transaction.crypto].toFixed(2)
                        : "0.00"}{" "}
                      %
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      ${" "}
                      {sortedGroupedTotals?.[transaction.crypto]?.toFixed(2) ??
                        "0.00"}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        (value?.[transaction.crypto] ?? 0) -
                          (averagePricesResult?.[transaction.crypto] ?? 0) <
                        0
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      ${" "}
                      {(
                        (value?.[transaction.crypto] ?? 0) -
                        (averagePricesResult?.[transaction.crypto] ?? 0)
                      ).toFixed(2)}
                    </td>
                    <td className="flex gap-2 py-2 items-center justify-center">
                      <DeleteAssetModal transaction={transaction} />
                      <Edit size={24} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mx-auto aspect-square w-full max-w-[300px] flex items-center justify-center mt-4">
            <p className="text-center text-gray-500">
              No current transactions loaded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTransaction;
