"use client";

import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const CurrentNotes = () => {
  const [open, setOpen] = useState(false);

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setOpen(false);
  }
  return (
    <div className="bg-card text-card-foreground shadow-sm flex flex-col w-full">
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-lg font-semibold text-gray-500">Notes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <PlusCircle className="w-6 h-6 text-blue-400" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white text-black flex items-center gap-2">
                New note
              </DialogTitle>
              <DialogDescription className="dark:text-white text-black">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="pt-4 flex flex-col gap-2 relative">
                              <Label
                                htmlFor="title"
                                className="text-white text-[1rem]"
                              >
                                Title
                              </Label>
                              <Input
                                {...field}
                                id="title"
                                type="text"
                                className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-white" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-0 relative">
                          <FormControl>
                            <div className="pt-4 flex flex-col gap-2">
                              <Label
                                htmlFor="description"
                                className="text-white text-[1rem]"
                              >
                                Description
                              </Label>
                              <Textarea
                                {...field}
                                id="description"
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
                        Add Note
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="max-h-[24rem]">
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>

        <Separator className="my-[0.05rem]" />
      </ScrollArea>
    </div>
  );
};

export default CurrentNotes;
