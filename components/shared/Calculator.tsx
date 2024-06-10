"use client";

import React, { useState } from "react";
import BlurIn from "../ui/blur-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema } from "@/lib/validator";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const Calculator = () => {
  const [isSwitched, setIsSwitched] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div>
      <div className="mt-20">
        <BlurIn
          word="Crypto Calculator"
          className="font-bold text-gray-800 dark:text-gray-300 pb-4"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-4xl flex flex-col justify-center gap-2 items-center mx-auto w-full "
          >
            <div className="flex justify-center gap-2 items-center mx-auto w-full">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex gap-2">
                      <p
                        className={isSwitched ? "text-white" : "text-gray-400"}
                      >
                        USD
                      </p>
                      <Switch
                        onCheckedChange={() => setIsSwitched(!isSwitched)}
                      />
                      <p
                        className={isSwitched ? "text-gray-400" : "text-white"}
                      >
                        ARS
                      </p>
                    </div>

                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <button
              type="submit"
              className="group relative inline-flex h-12 my-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 font-medium text-neutral-200 transition hover:scale-110"
            >
              <span>Calculate</span>
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20"></div>
              </div>
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Calculator;
