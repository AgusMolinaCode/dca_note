import React, { use, useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions, getMultipleCryptos } from "@/app/api";

type CryptoPrices = {
  [key: string]: {
    USD: number;
  };
};

const CurrentBalance = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({});
  const [cryptoAmounts, setCryptoAmounts] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
    refetchInterval(query) {
      return 36000000;
    },
  });

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
        .catch((error) =>
          console.error("Error al obtener precios de criptomonedas:", error)
        );
    }
  }, [data]);

  useEffect(() => {
    let sum = 0;
    data?.forEach((item) => {
      if (cryptoPrices[item.crypto]) {
        const value = item.amount * cryptoPrices[item.crypto]?.USD || 0;
        sum += value;
      }
    });
    setTotalValue(sum);
  }, [cryptoPrices, data]);

  useEffect(() => {
      let sum = 0;
      data?.forEach((item) => {
        sum += item?.total;
      });
      setTotalSum(sum);
    }, [data]);

  const formattedTotalSum = totalSum.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedTotalValue = totalValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-500">Current Balance</h1>
      </div>
      <div>
        <p className="text-4xl font-semibold pt-4">{formattedTotalValue}</p>
        <div className="pt-2 flex justify-start gap-2">
          <p>
            <span className="text-green-500 text-lg font-medium bg-green-500/20 px-3 py-1 rounded-[0.45rem]">
              0.11%
            </span>
          </p>
          <p className="text-green-500 text-lg font-medium">$ 100.00</p>
        </div>
      </div>
      <div className="pt-4">
        <div
          className={` dark:border-gray-700 border-gray-400 flex justify-between items-center gap-2`}
        >
          <div className="flex gap-2 items-center">
            <p className="font-semibold text-gray-500 text-[18px] py-2">
              Total Invested
            </p>
            <HoverCard openDelay={200}>
              <HoverCardTrigger>
                <InfoIcon className="text-gray-500" size={12} />
              </HoverCardTrigger>
              <HoverCardContent className="text-gray-400">
                The total amount of money you have invested in your account.
              </HoverCardContent>
            </HoverCard>
          </div>
          <div>
            <p className={`font-semibold text-[18px] py-2`}>
              {formattedTotalSum}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentBalance;
