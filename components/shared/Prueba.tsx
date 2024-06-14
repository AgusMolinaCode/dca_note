"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const TradingViewWidgetNoSSR = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex justify-center items-center">
        <p
          className="
          text-2xl
          text-gray-400
          dark:text-gray-500
        "
        >
          Loading...
        </p>
      </div>
    ),
  }
);

const AdvancedChart = () => {
  return (
    <div
      className="
      flex
      w-full
      h-[600px]
    "
    >
      <div
        className="
        flex
        justify-center
        items-center
        bg-white
        dark:bg-gray-800
        h-[600px]
        w-1/4
      "
      ></div>
      <div
        className="
        flex
        justify-center
        items-center
        bg-white
        dark:bg-gray-500
        h-[600px]
        w-1/4
      "
      ></div>
      <div className="w-3/4">
        <TradingViewWidgetNoSSR
          symbol="BINANCE:BTCUSDT"
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
