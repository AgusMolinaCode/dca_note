"use client";

import { getCryptos } from "@/app/api";
import { getQueryClient } from "@/app/QueryProvider";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function CriptoList() {
  const { data, isFetching } = useQuery({
    queryKey: ["crypto"],
    queryFn: getCryptos,
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  const cryptos = ['BTC', 'ETH', 'SOL', 'FET', 'RUNE'];

  return (
    <>
      {/* <button onClick={onRefresh} className="my-4 py-2 px-4 border rounded">
        Refresh
      </button> */}
      <div className="grid grid-cols-1 gap-4">
        {cryptos.map(crypto => (
          <>
            <p>{data?.RAW[crypto].USD.PRICE}</p>
            <Image 
                src={`https://cryptocompare.com/${data?.RAW[crypto].USD.IMAGEURL as string}`}
                alt={crypto}
                width={50}
                height={50}
            />
          </>
        ))}
      </div>
    </>
  );
}
