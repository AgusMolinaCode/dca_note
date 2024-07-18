/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

interface CryptoCurrency {
  PRICE: string;
  OPEN24HOUR: string;
  HIGH24HOUR: string;
  LOW24HOUR: string;
  CHANGE24HOUR: string;
  CHANGEPCT24HOUR: string;
  CHANGEDAY: string;
  CHANGEPCTDAY: string;
  CHANGEHOUR: string;
  CHANGEPCTHOUR: string;
}

interface CryptoListResult {
  DISPLAY: {
    [key: string]: {
      USD: CryptoCurrency;
    };
  };
}

const CurrentTodayProfitItem = ({
  allCryptos,
}: {
  allCryptos: Transaction[];
}) => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoListResult | null>(
    null
  );
  const [averageOpen24Hour, setAverageOpen24Hour] = useState<number | null>(
    null
  );
  const [cryptoAmountsFetch, setCryptoAmountsFetch] = useState<number | null>(null);

  const cryptoJoin = allCryptos.map((item) => item.crypto).join(",");
  const cryptoAmount = allCryptos.map((item) => item.amount);

  const cryptoAmountsAndCrypto = allCryptos.map((item) => {
    return {
      amount: item.amount,
      crypto: item.crypto,
    };
  }); 

  const fetchFullCryptosData = async () => {
    if (cryptoJoin) {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoJoin}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
      );
      const data: CryptoListResult = await response.json();

      
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  return (
    <div>
      {cryptoPrices ? (
        <>
          <p>
            Promedio de Apertura en 24 Horas: {averageOpen24Hour}
          </p>
          {Object.entries(cryptoPrices.DISPLAY).map(([crypto, info]) => (
            <div key={crypto}>
              <h3>{crypto}</h3>
              <p>Precio: {info.USD.OPEN24HOUR}</p>
            </div>
          ))}
        </>
      ) : (
        <p>Cargando precios...</p>
      )}
    </div>
  );
};

export default CurrentTodayProfitItem;
