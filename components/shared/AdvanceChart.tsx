/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { loadTransactions } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import DataTransaction from "../dashboard/DataTransaction";
import CurrentBalance from "../dashboard/CurrentBalance";
import { CurrentHoldings } from "../dashboard/CurrentHoldings";
import { MainChart } from "./MainChart";


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

const AdvancedChart = () => {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });

  return (
    <div className="flex px-2 xl:px-10 gap-4">
      <div className="flex w-full px-2 xl:px-10 gap-4">
        <div className="flex flex-col justify-center  w-1/4 gap-4">
          <div className="dark:bg-gray-800 bg-gray-600 w-[320px] px-2 rounded-3xl p-4">
            {/* <DataTransaction data={data} /> */}
            <CurrentBalance />
          </div>

          <div className=" dark:bg-gray-800 bg-gray-600 w-[320px] px-2 rounded-3xl p-4 mt-4">
            <CurrentHoldings />
          </div>
        </div>

        <div className="w-full">
          <MainChart />
        </div>
      </div>
    </div>
  );
};

export default AdvancedChart;
