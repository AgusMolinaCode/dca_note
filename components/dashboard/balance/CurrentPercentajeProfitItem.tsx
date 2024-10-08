/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

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
        if (item.amount > 0) {
          const low24HourValue = data?.RAW[item.crypto as any].USD.LOW24HOUR;
          const amountOfCrypto = item.amount;
          const product = low24HourValue * amountOfCrypto;
          totalLow24HourValue += product;
        }
      });
      setLow24HourValue(totalLow24HourValue);

      let totalHigh24HourValue = 0;

      cryptoAmountsAndCrypto.forEach((item) => {
        if (item.amount > 0) {
          const high24HourValue =
            data?.RAW[item.crypto as unknown as number].USD.HIGH24HOUR;
          const amount = item.amount;
          const product = high24HourValue * amount;
          totalHigh24HourValue += product;
        }
      });
      setHigh24HourValue(totalHigh24HourValue);
      setCryptoPrices(data);

      let totalPercentage24HourValue = 0;

      cryptoAmountsAndCrypto.forEach((item) => {
        if (item.amount > 0) {
          const high24HourValue =
            data?.RAW[item.crypto as unknown as number].USD.CHANGEPCT24HOUR;
          const amount = item.amount;
          const product = high24HourValue * amount;
          totalPercentage24HourValue += product;
        }
      });

      setPercentage24HourValue(totalPercentage24HourValue);
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  return (
    <div className="flex justify-start gap-2 items-center">
      <p className="flex flex-col justify-center mx-auto">
        <span className="text-xs text-gray-700 dark:text-gray-500 font-semibold">Low 24h: </span>
        <span
          className={`dark:text-red-400 text-red-500 text-md font-semibold py-1`}
        >
          {low24HourValue?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }) || "$0.00"}
        </span>
      </p>

      <p className="flex flex-col justify-center mx-auto">
        <span className="text-xs text-gray-700 dark:text-gray-500 font-semibold">High 24h: </span>
        <span
          className={`dark:text-green-500 text-green-600 text-md font-semibold py-1`}
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
