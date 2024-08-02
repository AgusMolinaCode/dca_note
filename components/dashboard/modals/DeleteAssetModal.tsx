import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOAD_TRANSACTIONS } from "@/app/api";
import Image from "next/image";

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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-1">
          <Trash2 size={24} className="hover:text-red-400 duration-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white text-black flex items-center gap-2">
            Delete{"  "}
            <Image
              src={`https://cryptocompare.com/${transaction.imageUrl}`}
              alt={transaction.crypto}
              width={24}
              height={24}
              className="rounded-full bg-zinc-900 p-[3px]"
            />
            {"  "}
            {transaction.crypto}{"  "}transaction
          </DialogTitle>
          <DialogDescription className="dark:text-white text-black">
            Are you sure you want to delete this transaction?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {/* <AlertDialogCancel className=" dark:border-white border-black">Cancel</AlertDialogCancel> */}
          <button
            type="submit"
            className="border dark:border-white border-black py-1 px-3 rounded-xl hover:bg-red-400 duration-300"
            onClick={() => mutation.mutate(transaction)}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAssetModal;
