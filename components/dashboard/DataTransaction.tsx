/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import DeleteAssetModal from "./DeleteAssetModal";
import { getMultipleFullCryptos } from "@/app/api";
import { useQuery } from "@tanstack/react-query";

type DataTransactionProps = {
  data: Transaction[] | undefined;
};

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

const DataTransaction: React.FC<DataTransactionProps> = ({ data }) => {
  const { user } = useUser();

  const [value, setValue] = useState<number | null>(null);

  const dataUserId = data?.filter((item) => item.userId === user?.id);
  const currentCrypto = dataUserId?.map((item) => item.crypto);
  const cryptoJoin = currentCrypto?.join(",");

  const fetchFullCryptosData = async () => {
    if (cryptoJoin) {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoJoin}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
      );
      const data: CryptoListResult = await response.json();

      let getCurrentPricePerCrypto = 0;

      data?.RAW &&
        Object.values(data.RAW).forEach((item) => {
          getCurrentPricePerCrypto += item.USD.PRICE;
        });

      setValue(getCurrentPricePerCrypto);
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [currentCrypto]);

  return (
    <div>
      {dataUserId && dataUserId.length > 0 ? (
        <div className="w-full overflow-x-auto mt-4">
          <table className="w-full table-auto">
            <thead className="dark:bg-gray-800 bg-gray-600 rounded-2xl pb-2 border-b border-gray-600">
              <tr className="text-left">
                <th className="px-4 py-2 text-sm text-gray-400">Asset</th>
                <th className="px-4 py-2 text-sm text-gray-400">Price</th>
                <th className="px-4 py-2 text-sm text-gray-400">24Hs Profit</th>
                <th className="px-4 py-2 text-sm text-gray-400">Invested</th>
                <th className="px-4 py-2 text-sm text-gray-400">Avg. Price</th>
                <th className="px-4 py-2 text-sm text-gray-400">
                  Current Profit
                </th>
                <th className="px-4 py-2 text-sm text-gray-400">
                  Current Price
                </th>
                <th className="px-4 py-2 text-sm text-gray-400 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-800 bg-gray-600 rounded-2xl">
              {dataUserId?.map((transaction) => (
                <>
                  <tr
                    key={transaction?.id}
                    className="border-t border-gray-600"
                  >
                    <td className="flex gap-1 items-center my-2">
                      <Image
                        src={`https://cryptocompare.com/${transaction?.imageUrl}`}
                        alt={transaction.crypto}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <p className="px-4 py-2 text-md font-semibold">
                        {transaction?.crypto}
                      </p>
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      $ {transaction?.price}
                    </td>
                    <td className="px-4 py-2">{transaction?.amount}</td>
                    <td className="px-4 py-2 font-semibold">
                      $ {transaction?.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      $ {transaction?.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      $ {value?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 font-semibold">$</td>
                    <td className="flex gap-2 py-2 items-center justify-center">
                      <DeleteAssetModal transaction={transaction} />
                      <Edit size={24} />
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <div>
            <p className="text-3xl text-white">Total: $ {value?.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto aspect-square w-full max-w-[300px] flex items-center justify-center mt-4">
          <p className="text-center text-gray-500">
            No current transactions loaded yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataTransaction;
