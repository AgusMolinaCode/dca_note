"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { nicknameSchema } from "@/lib/validator";
import { useUser } from "@clerk/clerk-react";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const ADD_USERS_URL = `http://localhost:3000/api/users`;

export default function NicknameDialogContent() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const form = useForm<z.infer<typeof nicknameSchema>>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: {
      clerkId: user?.id || "",
      nickname: "",
    },
  });

  const addNickname = async (values: z.infer<typeof nicknameSchema>) => {
    const nicknameData = {
      clerkId: values.clerkId,
      nickname: values.nickname,
    };

    try {
        const response = await fetch(ADD_USERS_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nicknameData),
          });
    
          if (!response.ok) {
            throw new Error("Something went wrong");
          }
    } catch (error) {
        console.error("Failed to add transaction", error);
    }
  };

  const mutation = useMutation({
    mutationFn: addNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="pt-4 flex flex-col gap-2">
                  <Label htmlFor="price" className="text-white text-[1rem]">
                    Add nickname to your profile and add your assets.
                  </Label>
                  <Input
                    {...field}
                    id="nickname"
                    placeholder="Your Nickname"
                    type="text"
                    className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-4 flex flex-col gap-2">
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white"
          >
            Add Nickname
          </Button>
        </div>
      </form>
    </Form>
  );
}
