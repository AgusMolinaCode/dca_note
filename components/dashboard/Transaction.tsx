import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DELETE_TRANSACTION_URL = `http://localhost:3000/api/transactions`;

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
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
    <div className="w-full">
      <tbody>
        <tr key={transaction.id} className="border-b">
          <td className="px-4 py-2">{transaction.id}</td>
          <td className="px-4 py-2">{transaction.amount}</td>
          <td className="px-4 py-2">{transaction.crypto}</td>
          <td className="px-4 py-2">{transaction.price}</td>
        </tr>
      </tbody>
      
    </div>
  );
};

export default Transaction;
