"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

const TickerTape = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.TickerTape),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center">
        <Skeleton className="w-full h-[20px]" />
      </div>
    ),
  }
);

const TickerTapeComponent = () => {
  return (
    <div className="">
      <TickerTape
        displayMode="regular"
        colorTheme={useTheme().resolvedTheme === "dark" ? "dark" : "light"}
        symbols={[
          { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
          { proName: "BITSTAMP:ETHUSD", title: "ETH/USD" },
          { proName: "BINANCE:BNBUSDT", title: "BNB/USDT" },
          { proName: "BINANCE:ADAUSDT", title: "ADA/USDT" },
          { proName: "BINANCE:SOLUSDT", title: "SOL/USDT" },
          { proName: "BINANCE:XRPUSDT", title: "XRP/USDT" },
          { proName: "BINANCE:DOTUSDT", title: "DOT/USDT" },
          { proName: "BINANCE:DOGEUSDT", title: "DOGE/USDT" },
          { proName: "BINANCE:SHIBUSDT", title: "SHIB/USDT" },
          { proName: "BINANCE:LTCUSDT", title: "LTC/USDT" },
        ]}
      ></TickerTape>
    </div>
  );
};

export default TickerTapeComponent;
