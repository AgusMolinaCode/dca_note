"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/marquee";
import { getCryptos } from "@/app/api";
import { useQuery } from "@tanstack/react-query";

export default function InfiniteMovingCardsDemo() {
  const { data, isFetching } = useQuery({
    queryKey: ["crypto"],
    queryFn: getCryptos,
  });

  if (isFetching) {
    return (
      <div className="text-center dark:text-white text-black font-normal h-[4rem] mt-12">
        Loading...
      </div>
    );
  }

  const cryptos = [
    "BTC",
    "ETH",
    "SOL",
    "FET",
    "RUNE",
    "BCH",
    "BNB",
    "APT",
    "NEXO",
    "TON",
    "NEAR",
    "XRP",
  ];

  const cryptoData = cryptos.map((crypto) => ({
    price: data?.RAW[crypto].USD.PRICE as number,
    name: crypto,
    image: `https://cryptocompare.com/${
      data?.RAW[crypto].USD.IMAGEURL as string
    }`,
  }));

  return (
    <div className="rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden h-[4rem] mt-10 sm:mt-0">
      <InfiniteMovingCards items={cryptoData} direction="right" speed="slow" />
    </div>
  );
}
