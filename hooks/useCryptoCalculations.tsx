import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions } from "@/app/api";
import { useUser } from "@clerk/clerk-react";

type CryptoPrices = {
  [key: string]: {
    USD: number;
  };
};

const useCryptoCalculations = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({});
  const [userCryptoAmounts, setUserCryptoAmounts] = useState<{ [key: string]: number }>({});
  const [averagePrices, setAveragePrices] = useState<{ [key: string]: { total: number; count: number; average: number } }>({});

  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
    refetchInterval: 900000,
  });

  const dataUserId = useMemo(() => data?.filter((item) => item.userId === user?.id), [data, user?.id]);

  useEffect(() => {
    if (dataUserId) {
      const amounts = dataUserId.reduce((acc, transaction) => {
        if (!acc[transaction.crypto]) {
          acc[transaction.crypto] = 0;
        }
        acc[transaction.crypto] += transaction.amount;
        return acc;
      }, {} as { [key: string]: number });

      const prices = dataUserId.reduce((acc, transaction) => {
        if (!acc[transaction.crypto]) {
          acc[transaction.crypto] = { total: 0, count: 0, average: 0 };
        }
        acc[transaction.crypto].total += transaction.price * transaction.amount;
        acc[transaction.crypto].count += transaction.amount;
        acc[transaction.crypto].average = acc[transaction.crypto].total / acc[transaction.crypto].count;
        return acc;
      }, {} as { [key: string]: { total: number; count: number; average: number } });

      setUserCryptoAmounts(amounts);
      setAveragePrices(prices);
    }
  }, [dataUserId]);

  // Función para sumar todos los count
  const sumCounts = () => {
    return Object.values(averagePrices).reduce((sum, { total }) => sum + total, 0);
  };

  // Hook para obtener el amount
  const getAmount = (crypto: string) => {
    return userCryptoAmounts[crypto] || 0;
  };

  // Hook para obtener el currentValue
  const getCurrentValue = (crypto: string) => {
    return cryptoPrices[crypto]?.USD || 0;
  };

  // Hook para obtener el currentProfit
  const getCurrentProfit = (crypto: string) => {
    const amount = getAmount(crypto);
    const currentValue = getCurrentValue(crypto);
    return amount * currentValue;
  };

  // Hook para obtener el currentTotal
  const getCurrentTotal = (crypto: string) => {
    const amount = getAmount(crypto);
    const averagePrice = averagePrices[crypto]?.average || 0;
    return amount * averagePrice;
  };

  // Hook para obtener el finalProfit
  const getFinalProfit = (crypto: string) => {
    const currentProfit = getCurrentProfit(crypto);
    const currentTotal = getCurrentTotal(crypto);
    return currentProfit - currentTotal;
  };

  // Hook para obtener el totalInvested
  const getTotalInvested = (crypto: string) => {
    const amount = getAmount(crypto);
    const averagePrice = averagePrices[crypto]?.average || 0;
    return amount * averagePrice;
  };

  return {
    userCryptoAmounts,
    averagePrices,
    sumCounts,
    isLoading,
    getAmount,
    getCurrentValue,
    getCurrentProfit,
    getCurrentTotal,
    getFinalProfit,
    getTotalInvested,
  };
};

export default useCryptoCalculations;