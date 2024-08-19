/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { InfoIcon } from "lucide-react";
import { HoverCardContent } from "../../ui/hover-card";

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
  const [low24HourValue, setLow24HourValue] = useState<number | null>(null);
  const [high24HourValue, setHigh24HourValue] = useState<number | null>(null);
  const [percentage24HourValue, setPercentage24HourValue] = useState<
    number | null
  >(null);

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

      let totalLow24HourValue = 0;

      cryptoAmountsAndCrypto.forEach((item) => {
        const low24HourValue = data?.RAW[item.crypto as any].USD.LOW24HOUR;
        const amountOfCrypto = item.amount;
        const product = low24HourValue * amountOfCrypto;
        totalLow24HourValue += product;
      });
      setLow24HourValue(totalLow24HourValue);
      let totalHigh24HourValue = 0;

      cryptoAmountsAndCrypto.forEach((item) => {
        const high24HourValue =
          data?.RAW[item.crypto as unknown as number].USD.HIGH24HOUR;
        const amount = item.amount;
        const product = high24HourValue * amount;
        totalHigh24HourValue += product;
      });
      setHigh24HourValue(totalHigh24HourValue);
      setCryptoPrices(data);

      let totalPercentage24HourValue = 0;

      cryptoAmountsAndCrypto.forEach((item) => {
        const high24HourValue =
          data?.RAW[item.crypto as unknown as number].USD.CHANGEPCT24HOUR;
        const amount = item.amount;
        const product = high24HourValue * amount;
        totalHigh24HourValue += product;
      });

      setPercentage24HourValue(totalPercentage24HourValue);
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  return (
    <div className="flex justify-start gap-2 items-center">
      {/* <p>
        <span
          className={`${
            (low24HourValue ?? 0) <= 0
              ? `text-red-500 bg-red-500/20`
              : `text-green-500 bg-green-500/20`
          } text-sm font-medium  px-2 py-[0.1rem] rounded-[0.45rem]`}
        >
          {percentage24HourValue}%
        </span>
      </p> */}

      <p className="flex flex-col justify-center mx-auto">
        <span className="text-xs text-gray-500 font-semibold">Low 24h: </span>
        <span
          className={` ${
            (low24HourValue ?? 0) <= 0 ? `text-red-500` : `text-green-500`
          }
           text-md font-medium py-1`}
        >
          {low24HourValue?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }) || "$0.00"}
        </span>
      </p>

      <p className="flex flex-col justify-center mx-auto">
        <span className="text-xs text-gray-500 font-semibold">High 24h: </span>
        <span
          className={` ${
            (high24HourValue ?? 0) <= 0 ? `text-red-500` : `text-green-500`
          }
           text-md font-medium py-1`}
        >
          {high24HourValue?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }) || "$0.00"}
        </span>
      </p>
    </div>
  );
};

export default CurrentPercentajeProfitItem;
