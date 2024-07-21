import React from "react";
import Transaction from "./Transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Edit2, Trash, Trash2 } from "lucide-react";
import Image from "next/image";

type DataTransactionProps = {
  data: Transaction[] | undefined;
};

const DELETE_TRANSACTION_URL = `http://localhost:3000/api/transactions`;

const DataTransaction: React.FC<DataTransactionProps> = ({ data }) => {
  const queryClient = useQueryClient();

  const deleteTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch(
        `${DELETE_TRANSACTION_URL}/${transaction.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const mutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  return (
    <div className="w-full overflow-x-auto mt-4">
      <table className="w-full table-auto">
        <thead className="dark:bg-gray-800 bg-gray-600 rounded-2xl pb-2 border-b border-gray-600">
          <tr className="text-left">
            <th className="px-4 py-2 text-sm text-gray-400">Asset</th>
            <th className="px-4 py-2 text-sm text-gray-400">Price</th>
            <th className="px-4 py-2 text-sm text-gray-400">24Hs Profit</th>
            <th className="px-4 py-2 text-sm text-gray-400">Invested</th>
            <th className="px-4 py-2 text-sm text-gray-400">Avg. Price</th>
            <th className="px-4 py-2 text-sm text-gray-400">Current Profit</th>
            <th className="px-4 py-2 text-sm text-gray-400 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="dark:bg-gray-800 bg-gray-600 rounded-2xl">
          {data?.map((transaction) => (
            <>
              <tr key={transaction?.id} className="border-b border-gray-600">
                <div className="flex gap-1 items-center my-2">
                  <Image
                    src={`https://cryptocompare.com/${transaction?.imageUrl}`}
                    alt={transaction.crypto}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <td className="px-4 py-2 text-md font-semibold">
                    {transaction?.crypto}
                  </td>
                </div>
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
                  $ {transaction?.price}
                </td>
                <td className="flex gap-2 py-2 items-center justify-center">
                  <button
                    type="submit"
                    className="1"
                    onClick={() => mutation.mutate(transaction)}
                  >
                    <Trash2 size={24} />
                  </button>
                  <Edit size={24} />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTransaction;
