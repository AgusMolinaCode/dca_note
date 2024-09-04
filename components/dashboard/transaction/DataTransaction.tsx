/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import DataTransactionTable from "./DataTransactionTable";
import useCryptoCalculations from "@/hooks/useCryptoCalculations";

type DataTransactionProps = {
  data: Transaction[] | undefined;
};

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

  const [value, setValue] = useState<{ [key: string]: number }>({});
  const [profitValue, setProfitValue] = useState<{
    [key: string]: number;
  }>({});
  const [percentageValue, setPercentageValue] = useState<{
    [key: string]: number;
  }>({}); // Provide an empty object as the default value
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const { averagePrices } = useCryptoCalculations();

  const dataUserId = data?.filter((item) => item.userId === user?.id);

  const groupedTotals = dataUserId?.reduce((acc, transaction) => {
    if (!acc[transaction.crypto]) {
      acc[transaction.crypto] = 0;
    }
    acc[transaction.crypto] += transaction.total;
    return acc;
  }, {} as { [key: string]: number });

  const groupedAmounts = dataUserId?.reduce((acc, transaction) => {
    if (transaction.amount > 0) {
      if (!acc[transaction.crypto]) {
        acc[transaction.crypto] = 0;
      }
      acc[transaction.crypto] += transaction.amount;
    }
    return acc;
  }, {} as { [key: string]: number });

  const sortedGroupedTotals = Object.keys(groupedTotals ?? {})
    .sort((a, b) => (groupedTotals?.[b] ?? 0) - (groupedTotals?.[a] ?? 0))
    .reduce((acc, key) => {
      acc[key] = groupedTotals?.[key] ?? 0;
      return acc;
    }, {} as { [key: string]: number });

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

      selectedSymbol === "" &&
        setSelectedSymbol(`BINANCE:${Object.keys(data.RAW)[0]}USDT`);
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
  };

  return (
    <div>
      <div className="h-[368px] w-full">
        <TradingViewWidgetNoSSR
          symbol={selectedSymbol || "BINANCE:BTCUSDT"}
          theme={useTheme().resolvedTheme === "dark" ? "dark" : "light"}
          locale="en"
          interval="60"
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
        <DataTransactionTable
          groupedAmounts={groupedAmounts || {}}
          groupedTransactionsArray={groupedTransactionsArray}
          value={value}
          averagePricesResult={averagePrices}
          profitValue={profitValue}
          percentageValue={percentageValue}
          sortedGroupedTotals={sortedGroupedTotals}
          handleRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default DataTransaction;
