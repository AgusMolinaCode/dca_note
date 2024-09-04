import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LOAD_TRANSACTIONS, LOAD_VALUES, searchCryptos } from "@/app/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  result: number;
}

interface CryptoCurrency {
  PRICE: number;
  OPEN24HOUR: number;
  HIGH24HOUR: number;
}

const SellAssetModal: React.FC<SellAssetModalProps> = ({
  transaction,
  amount,
  result,
}) => {
  const queryClient = useQueryClient();

  const [totalPrice, setTotalPrice] = useState<number>(result);
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(transaction.crypto);
  const [price, setPrice] = useState<number | string>("");
  const [profit, setProfit] = useState<number>(0);

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
    },
  });

  const sellTransaction = async (values: z.infer<typeof sellSchema>) => {
    const sellData = {
      userId: transaction.userId,
      crypto: transaction.crypto,
      amount: values.amount,
      price: values.price,
      total: values.total,
      sellTotal: profit,
      imageUrl: "/images/usdt.png",
    };
   

    const valueData = {
      userId: transaction.userId,
      total: profit,
    };

    try {
      const response = await fetch(LOAD_VALUES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(valueData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to add transaction", error);
    }

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

    // Actualizar el amount restante
    const remainingAmount = transaction.amount - Math.abs(values.amount);
    const updateData = {
      ...transaction,
      amount: remainingAmount,
    };

    try {
      const response = await fetch(`${LOAD_TRANSACTIONS}/${transaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update remaining amount");
      }
    } catch (error) {
      console.error("Failed to update remaining amount", error);
    }

    
  };

  const mutation = useMutation({
    mutationFn: sellTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["values"] });
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
      calculateProfit(amount, newValue);
    } else {
      setPrice("");
      form.setValue("price", 0);
      setTotalPrice(0);
      form.setValue("total", 0);
      setProfit(0);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(event.target.value);
    form.setValue("amount", newAmount);
    const newTotal = newAmount * (parseFloat(price as string) || 0);
    setTotalPrice(newTotal || 0);
    form.setValue("total", newTotal || 0);
    calculateProfit(newAmount, parseFloat(price as string));
  };

  const calculateProfit = (amount: number, currentPrice: number) => {
    const profit = (currentPrice - transaction.price) * amount;
    setProfit(profit);
  };

  const onSubmitMutation = (data: z.infer<typeof editSchema>) => {
    if (data.price === 0) {
      data.price = criptoPrice;
    }

    data.amount = -Math.abs(data.amount);

    mutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["items"] });
        queryClient.invalidateQueries({ queryKey: ["values"] });
      },
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {amount <= 0 || transaction.crypto === "USDT" ? null : (
            <Button type="submit" className="px-1">
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
          )}
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
                    name="profit"
                    render={({ field }) => (
                      <FormItem className="space-y-0 relative">
                        <FormControl>
                          <div className="pt-4 flex flex-col gap-2">
                            <Label
                              htmlFor="profit"
                              className="text-white text-[1rem]"
                            >
                              Profit
                            </Label>
                            <Input
                              {...field}
                              id="profit"
                              type="text"
                              value={
                                !isNaN(profit) ? profit.toFixed(2) : "0.00"
                              }
                              readOnly
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
