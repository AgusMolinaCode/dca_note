"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

const TradingViewWidgetNoSSR = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex justify-center items-center">
        <Skeleton className="w-[600px] h-[600px] " />
      </div>
    ),
  }
);

const TechnicalAnalysisWidgetNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.TechnicalAnalysis),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex justify-center items-center">
        <p className="text-2xl text-gray-400 dark:text-gray-500">Loading...</p>
      </div>
    ),
  }
);

const AdvancedChart = () => {
  return (
    <div className="flex flex-col lg:flex-row px-2 xl:px-10 gap-4">
      <div className="flex flex-col h-[600px] md:h-[740px] w-full lg:w-3/4">
        <div className="flex justify-center items-center bg-white dark:bg-gray-500 h-1/2 w-full">
          {/* Contenido del primer div */}
        </div>
        <div className="flex-1 flex w-full">
          <div className="flex-1 flex justify-center items-center bg-blue-800 w-full">
            {/* Contenido del segundo div */}
          </div>
          {/* <div className="hidden sm:flex md:w-[280px]  justify-end lg:justify-center items-center bg-white dark:bg-gray-500">
            <TechnicalAnalysisWidgetNoSSR
              symbol="BINANCE:BTCUSDT"
              colorTheme={
                useTheme().resolvedTheme === "dark" ? "dark" : "light"
              }
              height={400}
              width={280}
              locale="en"
              interval="1D"
            />
          </div> */}
        </div>
      </div>

      <div className="w-full lg:w-3/4 h-[550px] md:h-[740px]">
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
      </div>
    </div>
  );
};

export default AdvancedChart;
