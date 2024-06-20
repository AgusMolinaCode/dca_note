"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchCryptos } from "@/app/api";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface CryptoResult {
  USD: {
    PRICE: number;
    IMAGEURL: string;
  };
}

interface CryptoListResult {
  RAW: Record<string, CryptoResult>;
}

function useDebouncedQuery(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return useQuery({
    queryKey: ["searchCryptos", debouncedQuery],
    queryFn: () => searchCryptos(debouncedQuery),
    enabled: !!debouncedQuery,
  });
}

export function ButtonAsset() {
  const [query, setQuery] = useState("");
  const {
    data: searchResults,
    error,
    isLoading,
    isSuccess,
  } = useDebouncedQuery(query);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group rounded-xl relative inline-flex h-9 items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 md:px-6 font-medium text-neutral-200 transition hover:scale-110">
          <span>Add Asset</span>
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
            <div className="relative h-full w-8 bg-white/20"></div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Add Asset</DialogTitle>
        </DialogHeader>
        <div className="grid">
          <div className="">
            <Label htmlFor="searchCrypto" className="text-right text-white">
              Search for a crypto
            </Label>
          </div>
          <div className="pt-2">
            <Input
              id="searchCrypto"
              placeholder="Example: BTC, ETH, SOL, etc."
              className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div>
            <div>
              <ul>
                {isLoading && <li>Loading...</li>}
                {isSuccess &&
                  searchResults?.DISPLAY &&
                  Object.entries(searchResults.DISPLAY).map(
                    ([crypto, cryptoData]) => {
                      const { MKTCAP, IMAGEURL, PRICE } = cryptoData.USD;
                      if (MKTCAP === "$ NaN" || PRICE === "0") {
                        return (
                          <li key={crypto}>
                            Error: {crypto} no tiene información de precio
                            válida.
                          </li>
                        );
                      }
                      return (
                        <li key={crypto}>
                          <span>{crypto}</span>
                          <span>{PRICE}</span>
                          <Image
                            src={`https://cryptocompare.com/${IMAGEURL}`}
                            alt={crypto}
                            width={20}
                            height={20}
                          />
                        </li>
                      );
                    }
                  )}
              </ul>
              {error && <li>Error: {error.message}</li>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
