"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import { editSchema } from "@/lib/validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOAD_TRANSACTIONS } from "@/app/api";
import { TokenUSDT } from "@token-icons/react";

interface EditAssetModalProps {
  transaction: Transaction;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({ transaction }) => {
  const queryClient = useQueryClient();

  const [criptoPrice, setCriptoPrice] = useState<number | null>(
    transaction ? parseFloat(transaction.price.toFixed(2)) : null
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      price: criptoPrice !== null ? criptoPrice : undefined,
      total: transaction.total,
    },
  });
  const editTransaction = async (values: z.infer<typeof editSchema>) => {
    const editData = {
      amount: values.amount,
      price: values.price,
      total: values.total,
    };

    try {
      // Realizar la solicitud PUT para actualizar la transacción existente
      const response = await fetch(`${LOAD_TRANSACTIONS}/${transaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      // Si la transacción es una venta parcial, realizar una solicitud POST para crear una nueva transacción en USDT
      if (transaction.crypto !== "USDT" && values.amount < transaction.amount) {
        const usdtAmount = values.amount * values.price; // Calcular el valor en USDT

        const usdtData = {
          userId: transaction.userId,
          amount: usdtAmount,
          price: 1, // El precio de USDT es 1
          total: usdtAmount,
          crypto: "USDT",
          imageUrl: transaction.imageUrl,
        };

        const usdtResponse = await fetch(`${LOAD_TRANSACTIONS}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usdtData),
        });

        if (!usdtResponse.ok) {
          throw new Error("Failed to create USDT transaction");
        }
      }
    } catch (error) {
      console.error("Failed to edit transaction", error);
    }
  };

  const mutation = useMutation({
    mutationFn: editTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const inputText = event.target.value;
    let newValue = parseFloat(inputText);
    newValue = parseFloat(newValue.toFixed(2));
    setCriptoPrice(newValue);
    form.setValue("price", newValue);
    const amount = form.getValues("amount");
    const newTotal = newValue * (amount || 0) || 0;
    setTotalPrice(parseFloat(newTotal.toFixed(2)));
    form.setValue("total", parseFloat(newTotal.toFixed(2)));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value as unknown as number;
    form.setValue("amount", newAmount);
    const newTotal = newAmount * (criptoPrice || 0);
    setTotalPrice(newTotal || 0);
    form.setValue("total", newTotal || 0);
  };

  const onSubmitMutation = (data: z.infer<typeof editSchema>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["items"] });
      },
    });
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="px-1">
            <Edit size={24} className="hover:text-blue-400 duration-300" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white text-black flex items-center gap-2">
              Edit{"  "}
              {transaction.imageUrl ? (
                <Image
                  src={`https://cryptocompare.com/${transaction.imageUrl}`}
                  alt={transaction.crypto}
                  width={24}
                  height={24}
                  className="rounded-full bg-zinc-900 p-[3px]"
                />
              ) : (
                <TokenUSDT size={24} variant="branded" />
              )}
              {"  "}
              {transaction.crypto}
              {"  "}transaction
            </DialogTitle>
            <DialogDescription className="dark:text-white text-black">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitMutation)}>
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
                              onChange={handleAmountChange}
                              placeholder={transaction.amount.toString()}
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
                              value={criptoPrice !== null ? criptoPrice : ""}
                              onChange={handlePriceChange}
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
                              value={
                                totalPrice !== null
                                  ? totalPrice.toFixed(2)
                                  : "0.00"
                              }
                              className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
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
                      Edit Transaction
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditAssetModal;
