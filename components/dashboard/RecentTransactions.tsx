/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Edit } from "lucide-react";
import DeleteAssetModal from "./DeleteAssetModal";

type DataTransactionProps = {
  data: Transaction[] | undefined;
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

  console.log();
  return (
    <div>
      <div className="overflow-x-auto px-2 pb-2">
        <div className="flex justify-between items-center px-2 pt-4">
          <h2 className="text-lg font-semibold text-gray-500">
            Recent Transactions
          </h2>
        </div>
        <table className="table-auto w-full">
          <thead className="dark:bg-gray-800 bg-gray-600 pb-2 border-b border-gray-600">
            <tr className="text-left">
              <th className="">ID</th>
              <th className="">Name</th>
              <th className="">Amount</th>
              <th className="">Buy Price</th>
              <th className="">Current Price</th>
              <th className="">Profit</th>
              <th className="">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataUserId?.map((transaction) => (
              <tr key={transaction.id}>
                <td className="text-center">{transaction.id}</td>
                <td className="text-center">{transaction.crypto}</td>
                <td className="text-center">{transaction.amount.toFixed(2)}</td>
                <td className="text-center">{transaction.price.toFixed(2)}</td>
                <td className="text-center">
                  {value[transaction.crypto]} USD
                </td>
                <td className="text-center">
                  {(
                    value[transaction.crypto] * transaction.amount -
                    transaction.price * transaction.amount
                  ).toFixed(2)}{" "}
                  USD
                </td>
                <td className="flex gap-2 py-2 items-center text-center justify-center">
                  <DeleteAssetModal transaction={transaction} />
                  <Edit size={24} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
