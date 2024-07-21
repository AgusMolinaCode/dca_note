"use client";

import React from "react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { loadTransactions } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import DataTransaction from "../dashboard/DataTransaction";

const TradingViewWidgetNoSSR = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex justify-center items-center">
        <Skeleton className="w-[600px] h-[600px]" />
      </div>
    ),
  }
);

const CurrentTransactions = () => {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });
  return (
    <div>
      <TradingViewWidgetNoSSR
        symbol="BINANCE:BTCUSDT"
        theme="dark"
        locale="en"
        interval="5"
        range="5D"
        style="3"
        timezone="Etc/UTC"
        height="400"
        width="100%"
        hotlist={true}
        hide_legend={true}
        hide_side_toolbar={true}
        hide_top_toolbar={true}
      />
      <div className="dark:bg-gray-800 bg-gray-600 px-2 rounded-xl">
        <DataTransaction data={data} />
      </div>
    </div>
  );
};

export default CurrentTransactions;
