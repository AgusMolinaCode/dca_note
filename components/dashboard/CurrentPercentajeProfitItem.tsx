/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CurrentBalanceItem from "./CurrentBalanceItem";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { InfoIcon } from "lucide-react";
import { HoverCardContent } from "../ui/hover-card";

interface CryptoCurrency {
  PRICE: number;
  OPEN24HOUR: number;
  HIGH24HOUR: number;
  LOW24HOUR: number;
  CHANGE24HOUR: number;
  CHANGEPCT24HOUR: number;
  CHANGEDAY: number;
  CHANGEPCTDAY: number;
  CHANGEHOUR: number;
  CHANGEPCTHOUR: number;
}

interface CryptoListResult {
  RAW: {
    [key: number]: {
      USD: CryptoCurrency;
    };
  };
}

const CurrentPercentajeProfitItem = ({
  allCryptos,
}: {
  allCryptos: Transaction[];
  formattedTotalValue: string;
}) => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoListResult | null>(
    null
  );
  const [cryptoAmountsFetch, setCryptoAmountsFetch] = useState<number | null>(
    null
  );
  const [open24HourValue, setOpen24HourValue] = useState<number | null>(null);

  const cryptoJoin = allCryptos.map((item) => item.crypto).join(",");

  const cryptoAmountsAndCrypto = allCryptos.map((item) => {
    return {
      amount: item.amount as number,
      crypto: item.crypto as string,
    };
  });

  const fetchFullCryptosData = async () => {
    if (cryptoJoin) {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoJoin}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
      );
      const data: CryptoListResult = await response.json();

      let totalSum = 0;

      cryptoAmountsAndCrypto.forEach((item) => {
        const open24HourValue =
          data?.RAW[item.crypto as any].USD.CHANGEPCT24HOUR;
        const amountOfCrypto = item.amount;
        const product = open24HourValue * amountOfCrypto;
        totalSum += product;
      });

      setCryptoAmountsFetch(totalSum);
      let totalOpen24HourValue = 0;

      cryptoAmountsAndCrypto.forEach((item) => {
        const open24HourValue =
          data?.RAW[item.crypto as unknown as number].USD.CHANGE24HOUR;
        const amount = item.amount;
        const product = open24HourValue * amount;
        totalOpen24HourValue += product;
      });

      setOpen24HourValue(totalOpen24HourValue);
      setCryptoPrices(data);
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  return (
    <div className="flex justify-start gap-2 items-center">
      <p>
        <span
          className={`${
            (cryptoAmountsFetch ?? 0) < 0
              ? `text-red-500 bg-red-500/20`
              : `text-green-500 bg-green-500/20`
          } text-sm font-medium  px-3 py-1 rounded-[0.45rem]`}
        >
          {(cryptoAmountsFetch ?? 0).toFixed(2)}%
        </span>
      </p>
      <HoverCard>
        <HoverCardTrigger>
          <InfoIcon className="text-gray-500" size={12} />
        </HoverCardTrigger>
        <HoverCardContent className="text-gray-400">
          the 24hs change percentage of your assets
        </HoverCardContent>
      </HoverCard>
      <p>
        <span
          className={` ${
            (open24HourValue ?? 0) < 0 ? `text-red-500` : `text-green-500`
          }
           text-lg font-medium py-1`}
        >
          {open24HourValue?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }) || "$0.00"}
        </span>
      </p>
      <HoverCard>
        <HoverCardTrigger>
          <InfoIcon className="text-gray-500" size={12} />
        </HoverCardTrigger>
        <HoverCardContent className="text-gray-400">
          the 24hs change value of your assets
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default CurrentPercentajeProfitItem;
