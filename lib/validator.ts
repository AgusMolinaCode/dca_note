import { use } from "react";
import * as z from "zod";

export const transactionSchema = z.object({
  amount: z
    .number({ message: "The 'amount' must be a number greater than 0." })
    .min(0, { message: "The 'amount' must be greater than 0." }),
  price: z
    .number({ message: "The 'price' must be a number greater than 0." })
    .min(0, { message: "The 'price' must be greater than 0." }),
  total: z
    .number()
    .min(0),
  userId: z.string(),
});

export const nicknameSchema = z.object({
  nickname: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  clerkId: z.string(),
});