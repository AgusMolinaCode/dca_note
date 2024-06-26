/* eslint-disable react-hooks/rules-of-hooks */
"use client";

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

const AdvancedChart = () => {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });

  return (
    <div className="flex flex-col lg:flex-row px-2 xl:px-10 gap-4">
      <div className="flex flex-col lg:flex-row px-2 xl:px-10 gap-4">
        <div className="flex flex-col h-[600px] md:h-[740px] w-full lg:w-3/4">
          <div className="flex justify-center items-center bg-white dark:bg-gray-500 h-1/2 w-full">
            <DataTransaction data={data} />
          </div>
          <div className="flex-1 flex w-full">
            <div className="flex-1 flex justify-center items-center bg-blue-800 w-full">
              {/* Contenido del segundo div */}
            </div>
          </div>
        </div>

        {/* <div className="w-full lg:w-3/4 h-[550px] md:h-[740px]">
          <TradingViewWidgetNoSSR
            symbol="BINANCE:BCHUSDT"
            theme={useTheme().resolvedTheme === "dark" ? "dark" : "light"}
            interval="D"
            timezone="America/Argentina/Buenos_Aires"
            style="3"
            locale="es"
            autosize
            hide_side_toolbar
            disabled_features={["create_volume_indicator_by_default"]}
          />
        </div> */}
      </div>
    </div>
  );
};

export default AdvancedChart;
