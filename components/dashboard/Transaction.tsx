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
      console.log("Transaction deleted");
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
    <div className="flex flex-col p-2 m-2 border gap-4">
      <p>{transaction.crypto}</p>
      <p>amount: {transaction.amount}</p>
      <p>precio: {transaction.price}</p>
      <p>precio: {transaction.id}</p>

      <div>
        <button
          type="submit"
          className="bg-red-500 text-white rounded p-1"
          onClick={() => mutation.mutate(transaction)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Transaction;
