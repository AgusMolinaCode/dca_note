"use client";

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
import { Edit } from "lucide-react";
import Image from "next/image";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { transactionSchema } from "@/lib/validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOAD_TRANSACTIONS } from "@/app/api";

interface DeleteAssetModalProps {
  transaction: Transaction;
}

const EditAssetModal: React.FC<DeleteAssetModalProps> = ({ transaction }) => {
  const queryClient = useQueryClient();

  const deleteTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch(`${LOAD_TRANSACTIONS}/${transaction.id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to edit transaction", error);
    }
  };

  const mutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const form = useForm<z.infer<typeof transactionSchema>>({});
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="px-1">
            <Edit size={24} className="hover:text-blue-400 duration-300" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white text-black flex items-center gap-2">
              Edit{"  "}
              <Image
                src={`https://cryptocompare.com/${transaction.imageUrl}`}
                alt={transaction.crypto}
                width={24}
                height={24}
                className="rounded-full bg-zinc-900 p-[3px]"
              />
              {"  "}
              {transaction.crypto}
              {"  "}transaction
            </DialogTitle>
            <DialogDescription className="dark:text-white text-black">
              <Form {...form}>
                <form>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="pt-4 flex flex-col gap-2">
                            <Label
                              htmlFor="amount"
                              className="text-white text-[1rem]"
                            >
                              Amount
                            </Label>
                            <Input
                              {...field}
                              id="amount"
                              type="number"
                              defaultValue={transaction.amount.toString()}
                              className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-white" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="price"
                    render={({ field }) => (
                      <FormItem className="space-y-0 relative">
                        <FormControl>
                          <div className="pt-4 flex flex-col gap-2">
                            <Label
                              htmlFor="price"
                              className="text-white text-[1rem]"
                            >
                              Price
                            </Label>
                            <Input
                              {...field}
                              id="price"
                              type="number"
                              className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
                              defaultValue={transaction.price.toString()}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-white" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="total"
                    render={({ field }) => (
                      <FormItem className="space-y-0 relative">
                        <FormControl>
                          <div className="pt-4 flex flex-col gap-2">
                            <Label
                              htmlFor="total"
                              className="text-white text-[1rem]"
                            >
                              Total
                            </Label>
                            <Input
                              {...field}
                              id="total"
                              type="text"
                              readOnly
                              className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
                              defaultValue={transaction.total.toString()}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white"
                    >
                      Add Transaction
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {/* <AlertDialogCancel className=" dark:border-white border-black">Cancel</AlertDialogCancel> */}
            {/* <button
            type="submit"
            className="border dark:border-white border-black py-1 px-3 rounded-xl hover:bg-red-400 duration-300"
            onClick={() => mutation.mutate(transaction)}
          >
            Delete
          </button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditAssetModal;
