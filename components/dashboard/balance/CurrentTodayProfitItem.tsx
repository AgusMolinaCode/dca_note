/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CurrentBalanceItem from "./CurrentBalanceItem";


const CurrentTodayProfitItem = ({
  allCryptos,
  totalValue,
}: {
  allCryptos: Transaction[];
  totalValue: number;
}) => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoListResult | null>(
    null
  );
  const [cryptoAmountsFetch, setCryptoAmountsFetch] = useState<number | null>(
    null
  );

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
        if (item.amount > 0) {
          const open24HourValue =
            data?.RAW[item.crypto as unknown as number].USD.CHANGEHOUR;
          const amount = item.amount;
          const product = open24HourValue * amount;
          totalSum += product;
        }
      });

      setCryptoAmountsFetch(totalSum);
      setCryptoPrices(data);
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  return (
    <div>
      <>
        <CurrentBalanceItem
          title="1H Unrealized High Profit"
          description="the maximum unrealized profit in the last hour"
          value={
            cryptoAmountsFetch?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }) || "$0.00"
          }
          classNameValue={
            cryptoAmountsFetch! <= 0 ? "text-red-500" : "text-green-500"
          }
        />
      </>
    </div>
  );
};

export default CurrentTodayProfitItem;
