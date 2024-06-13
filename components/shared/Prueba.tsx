"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const TradingViewWidgetNoSSR = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  { ssr: false }
);

const AdvancedChart = () => {
  return (
    <div className="h-[600px]">
      <TradingViewWidgetNoSSR
        symbol="BINANCE:BTCUSDT"
        theme={useTheme().resolvedTheme === "dark" ? "dark" : "light"}
        interval="60"
        timezone="Etc/UTC"
        style="3"
        locale="es"
        autosize
        hide_side_toolbar
        disabled_features={["create_volume_indicator_by_default"]}
      />
    </div>
  );
};

export default AdvancedChart;
