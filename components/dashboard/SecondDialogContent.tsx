"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
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
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

interface SecondDialogContentProps {
  selectedCrypto: { crypto: string; price: number; imageUrl: string } | null;
  onAddTransaction: () => void;
}

const ADD_TRANSACTION_URL = `http://localhost:3000/api/transactions`;

const SecondDialogContent: React.FC<SecondDialogContentProps> = ({
  selectedCrypto,
  onAddTransaction,
}) => {
  const [criptoPrice, setCriptoPrice] = useState<number | null>(
    selectedCrypto ? parseFloat(selectedCrypto.price.toFixed(2)) : null
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      price: criptoPrice !== null ? criptoPrice : undefined,
      total: 0,
    },
  });

  const router = useRouter();

  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: any) => {
      const response = await fetch(ADD_TRANSACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await addTransactionMutation.mutateAsync(data);
      onAddTransaction();
      router.push("/dashboard");
    } catch (error) {
      console.error("An error occurred while adding transaction", error);
    }
  };

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
    const newAmount = parseFloat(event.target.value);
    form.setValue("amount", newAmount);
    const newTotal = newAmount * (criptoPrice || 0);
    setTotalPrice(newTotal || 0);
    form.setValue("total", newTotal || 0);
  };

  return (
    <div>
      <div>
        <div className="flex gap-2 justify-start items-center">
          <Image
            src={`https://cryptocompare.com/${selectedCrypto?.imageUrl}`}
            alt={selectedCrypto?.crypto || ""}
            width={50}
            height={50}
          />
          <p className="font-bold text-xl text-white">
            {selectedCrypto?.crypto}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        placeholder={selectedCrypto?.crypto}
                        className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className=" space-y-0 relative">
                  <FormControl>
                    <div className="pt-4 flex flex-col gap-2">
                      <Label htmlFor="price" className="text-white text-[1rem]">
                        Crypto Price
                      </Label>
                      <Input
                        {...field}
                        id="price"
                        type="number"
                        value={criptoPrice === null ? "" : criptoPrice}
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
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem className=" space-y-0 relative">
                  <FormControl>
                    <div className="pt-4 flex flex-col gap-2">
                      <Label htmlFor="total" className="text-white text-[1rem]">
                        Total
                      </Label>
                      <Input
                        {...field}
                        id="total"
                        type="text"
                        value={totalPrice.toFixed(2)}
                        readOnly
                        className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-white" />
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
      </div>
    </div>
  );
};

export default SecondDialogContent;
