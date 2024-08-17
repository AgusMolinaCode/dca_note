import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions, getMultipleCryptos } from "@/app/api";
import { useUser } from "@clerk/clerk-react";

type CryptoPrices = {
  [key: string]: {
    USD: number;
  };
};

const useCryptoData = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({});
  const [cryptoAmounts, setCryptoAmounts] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
    refetchInterval: 900000,
  });

  const dataUserId = data?.filter((item) => item.userId === user?.id);
  const allCryptos = dataUserId?.map((item) => item) || [];

  useEffect(() => {
    if (data) {
      const tempMap = new Map();

      data.forEach((item) => {
        if (!tempMap.has(item.crypto)) {
          tempMap.set(item.crypto, item.amount);
        }
      });

      const uniqueCryptos = Array.from(tempMap.keys());
      const uniqueAmounts = Array.from(tempMap.values());
      setCryptoAmounts(uniqueAmounts);

      getMultipleCryptos(uniqueCryptos.join(","))
        .then((result) => {
          const prices: CryptoPrices = {};
          Object.entries(result).forEach(([key, crypto]) => {
            prices[key] = { USD: crypto.USD };
          });
          setCryptoPrices(prices);
        })
        .catch((error) => console.error("Error", error));
    }
  }, [data]);

  useEffect(() => {
    let sum = 0;
    dataUserId?.forEach((item) => {
      if (cryptoPrices[item.crypto]) {
        const value = item.amount * cryptoPrices[item.crypto]?.USD || 0;
        sum += value;
      }
    });
    setTotalValue(sum);
  }, [cryptoPrices, dataUserId]);

  useEffect(() => {
    let sum = 0;
    dataUserId?.forEach((item) => {
      sum += item?.total;
    });
    setTotalSum(sum);
  }, [dataUserId]);

  return {
    cryptoPrices,
    cryptoAmounts,
    totalValue,
    totalSum,
    isLoading,
    dataUserId,
    allCryptos,
  };
};

export default useCryptoData;