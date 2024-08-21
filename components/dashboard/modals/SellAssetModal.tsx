"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LOAD_TRANSACTIONS, searchCryptos } from "@/app/api";
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
  amount: number;
  finalProfit: number;
  result: number;
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

const SellAssetModal: React.FC<SellAssetModalProps> = ({
  transaction,
  amount,
  finalProfit,
  result,
}) => {
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
      price: criptoPrice,
      total: transaction.total,
    },
  });

  const sellTransaction = async (values: z.infer<typeof sellSchema>) => {
    const sellData = {
      userId: transaction.userId,
      crypto: transaction.crypto,
      amount: values.amount,
      price: values.price,
      total: values.total,
      imageUrl: "/images/usdt.png",
    };

    const usdtData = {
      userId: transaction.userId,
      crypto: "USDT",
      amount: values.total,
      price: 1,
      total: values.total,
      imageUrl: "/media/37746338/usdt.png",
    };

    try {
      const response = await fetch(LOAD_TRANSACTIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sellData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to add transaction", error);
    }

    if (transaction.imageUrl === "/media/37746338/usdt.png") {
      console.error(
        "No se puede vender y comprar la misma criptomoneda (USDT)."
      );
      return;
    }

    try {
      const response = await fetch(LOAD_TRANSACTIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usdtData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong with USDT data");
      }
    } catch (error) {
      console.error("Failed to add USDT transaction", error);
    }
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
    const newAmount = event.target.value as unknown as number;
    form.setValue("amount", newAmount);
    const newTotal = newAmount * (criptoPrice || 0);
    setTotalPrice(newTotal || 0);
    form.setValue("total", newTotal || 0);
  };

  const onSubmitMutation = (data: z.infer<typeof editSchema>) => {
    if (data.price === 0) {
      data.price = criptoPrice;
    }

    data.amount = -Math.abs(data.amount);
    // data.total = -Math.abs(data.total);

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
          <Button
            type="submit"
            className="px-1"
          >
            {result > 0 ? (
              <p className="text-green-400 font-semibold bg-black/60 py-1 px-2 rounded-md">
                TP
              </p>
            ) : (
              <p className="text-red-400 font-semibold bg-black/60 py-1 px-2 rounded-md">
                SL
              </p>
            )}
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
                              Amount to sell
                            </Label>
                            <Input
                              {...field}
                              id="amount"
                              type="number"
                              onChange={handleAmountChange}
                              max={amount.toFixed(2)}
                              placeholder={amount.toFixed(2)}
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
                              Current Price
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
                              Total USDT to receive
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
                              Profit
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
