import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOAD_TRANSACTIONS } from "@/app/api";

interface DeleteAssetModalProps {
  transaction: Transaction;
}

const DeleteAssetModal: React.FC<DeleteAssetModalProps> = ({ transaction }) => {
  const queryClient = useQueryClient();

  const deleteTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch(`${LOAD_TRANSACTIONS}/${transaction.id}`, {
        method: "DELETE",
      });

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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Trash2 size={24} className="hover:text-red-400 duration-300" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-white text-black">
            Delete {transaction.crypto} transaction
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-white text-black">
            Are you sure you want to delete this transaction?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className=" dark:border-white border-black">Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="border dark:border-white border-black hover:bg-red-400 duration-300"
            onClick={() => mutation.mutate(transaction)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAssetModal;
