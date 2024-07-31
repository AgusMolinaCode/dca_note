/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Edit } from "lucide-react";
import DeleteAssetModal from "./DeleteAssetModal";
import Image from "next/image";
import { CircleDollarSignIcon, DollarSign } from "lucide-react";

type DataTransactionProps = {
  data: Transaction[] | undefined;
};

const groupByDate = (transactions: any) => {
  return transactions.reduce(
    (
      acc: { [x: string]: any[] },
      transaction: { createdAt: string | number | Date }
    ) => {
      const date = new Date(transaction.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    },
    {}
  );
};

const RecentTransactions: React.FC<DataTransactionProps> = ({ data }) => {
  const { user } = useUser();

  const dataUserId = data?.filter((item) => item.userId === user?.id);

  const cryptoJoin = dataUserId?.map((item) => item.crypto).join(",");

  const [value, setValue] = useState<{ [key: string]: number }>({});

  const fetchFullCryptosData = async () => {
    if (cryptoJoin) {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoJoin}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
      );
      const data: CryptoListResult = await response.json();

      // Extraer los precios de cada criptomoneda
      const prices: { [key: string]: number } = Object.keys(data.RAW).reduce(
        (acc, crypto) => {
          acc[crypto] = data.RAW[crypto as any].USD.PRICE;
          return acc;
        },
        {} as { [key: string]: number }
      );

      setValue(prices);
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  const groupedTransactions = groupByDate(dataUserId);

  return (
    <div>
      <div className="overflow-x-auto px-2 pb-2">
        <div className="flex justify-between items-center px-2 pt-4">
          <h2 className="text-lg font-semibold text-gray-500">
            Recent Transactions
          </h2>
        </div>
        {Object.keys(groupedTransactions).map((date) => (
          <div key={date}>
            <table className="table-auto w-full">
              <thead className="dark:bg-gray-800 bg-gray-600 pb-2 border-b border-gray-600">
                <tr className="text-left">
                  <th className="px-4 py-2 text-sm text-gray-400">Name</th>
                  <th className="px-4 py-2 text-sm text-gray-400">Amount</th>
                  <th className="px-4 py-2 text-sm text-gray-400">Buy Price</th>
                  <th className="px-4 py-2 text-sm text-gray-400">
                    Current Price
                  </th>
                  <th className="px-4 py-2 text-sm text-gray-400">Gain/Loss</th>
                  <th className="px-4 py-2 text-sm text-gray-400 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <h3 className="text-lg font-semibold pt-2 text-gray-100">
                {date}
              </h3>
              <tbody>
                {groupedTransactions[date].map((transaction: Transaction) => (
                  <tr key={transaction.id}>
                    <td className="flex gap-1 items-center my-2">
                      <div className="relative">
                        <Image
                          src={`https://cryptocompare.com/${transaction.imageUrl}`}
                          alt={transaction.crypto}
                          width={32}
                          height={32}
                          className="rounded-full bg-zinc-900 p-[3px]"
                        />
                        <CircleDollarSignIcon
                          size={24}
                          className="text-green-400 bg-zinc-900 rounded-full  absolute bottom-[-11px] left-3 p-[3px]"
                        />
                      </div>
                      <p className="px-4 py-2 text-md font-semibold text-gray-200">
                        {transaction.crypto}
                      </p>
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold
                    ${
                      value[transaction.crypto]
                        ? value[transaction.crypto] >= transaction.price
                          ? "text-green-400"
                          : "text-red-400"
                        : ""
                    }
                      `}
                    >
                      $ {transaction.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      $
                      {value[transaction.crypto]
                        ? value[transaction.crypto].toFixed(2)
                        : "0.00"}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold
                    ${
                      value[transaction.crypto]
                        ? value[transaction.crypto] * transaction.amount -
                            transaction.price * transaction.amount >=
                          0
                          ? "text-green-400"
                          : "text-red-400"
                        : ""
                    }
                      `}
                    >
                      $
                      {value[transaction.crypto]
                        ? (
                            value[transaction.crypto] * transaction.amount -
                            transaction.price * transaction.amount
                          ).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="flex gap-2 items-center py-2 justify-center">
                      <DollarSign size={24} />
                      <DeleteAssetModal transaction={transaction} />
                      <Edit size={24} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
