"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { searchCryptos } from "@/app/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import Image from "next/image";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { editSchema, sellSchema } from "@/lib/validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TokenUSDT } from "@token-icons/react";

interface SellAssetModalProps {
  transaction: Transaction;
  criptoPrice: number | null;
}

interface CryptoCurrency {
  PRICE: number;
  OPEN24HOUR: number;
  HIGH24HOUR: number;
}

interface CryptoListResult {
  RAW: {
    [key: number]: {
      USD: CryptoCurrency;
    };
  };
}

const SellAssetModal: React.FC<SellAssetModalProps> = ({ transaction }) => {
  const queryClient = useQueryClient();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(transaction.crypto);
  const [price, setPrice] = useState<number | string>("");

  const { data } = useQuery({
    queryKey: ["cryptoPrice", debouncedQuery],
    queryFn: () => searchCryptos(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  const criptoPrice = data?.RAW[transaction.crypto]?.USD.PRICE || 0;

  useEffect(() => {
    if (criptoPrice !== undefined) {
      setPrice(criptoPrice.toFixed(2));
    }
  }, [criptoPrice]);

  const form = useForm<z.infer<typeof sellSchema>>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      price: criptoPrice > 0 ? criptoPrice : 0,
      total: transaction.total,
    },
  });

  const sellTransaction = async (values: z.infer<typeof sellSchema>) => {
    const editData = {
      amount: values.amount,
      price: values.price,
      total: values.total,
    };

    console.log(editData);
  };

  const mutation = useMutation({
    mutationFn: sellTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    const newValue = parseFloat(inputText);

    if (!isNaN(newValue) && newValue > 0) {
      setPrice(newValue);
      form.setValue("price", newValue);
      const amount = form.getValues("amount");
      const newTotal = newValue * (amount || 0) || 0;
      setTotalPrice(parseFloat(newTotal.toFixed(2)));
      form.setValue("total", parseFloat(newTotal.toFixed(2)));
    } else {
      setPrice("");
      form.setValue("price", 0);
      setTotalPrice(0);
      form.setValue("total", 0);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(event.target.value);
    form.setValue("amount", newAmount);
    const newTotal = newAmount * (parseFloat(price as string) || 0);
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
    console.log(data);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="px-1">
            <DollarSign
              size={24}
              className="hover:text-yellow-400 duration-300"
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white text-black flex items-center gap-2">
              Sell{"  "}
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
              {"  "}Asset
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
                          <div className="pt-4 flex flex-col gap-2 relative">
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
                              max={transaction.amount}
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
                              value={price}
                              onChange={handlePriceChange}
                              className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
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
                      Sell Asset
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

export default SellAssetModal;
