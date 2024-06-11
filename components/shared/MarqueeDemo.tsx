"use client";

import React, { useEffect, useState } from "react";
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
      <div className="text-center text-white font-normal h-[7rem] mt-20">
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
    <div className="h-[12rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={cryptoData} direction="right" speed="slow" />
    </div>
  );
}
