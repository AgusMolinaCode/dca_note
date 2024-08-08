import * as z from "zod";

export const transactionSchema = z.object({
  amount: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "The 'amount' must be a number greater than 0.",
    })
    .transform((value) => parseFloat(value)),
  price: z
    .number({ message: "The 'price' must be a number greater than 0." })
    .min(0, { message: "The 'price' must be greater than 0." }),
  total: z.number().min(0),
  userId: z.string(),
});

export const nicknameSchema = z.object({
  nickname: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  clerkId: z.string(),
});

export const editSchema = z.object({
  amount: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "The 'amount' must be a number greater than 0.",
    })
    .transform((value) => parseFloat(value)),
  price: z
    .number({ message: "The 'price' must be a number greater than 0." })
    .min(0, { message: "The 'price' must be greater than 0." }),
  total: z.number().min(0),
});

export const sellSchema = z.object({
  amount: z
    .number({ message: "The 'amount' must be a number greater than 0." })
    .min(0, { message: "The 'amount' must be greater than 0." }),
  price: z
    .number({ message: "The 'price' must be a number greater than 0." })
    .min(0, { message: "The 'price' must be greater than 0." }),
  total: z.number().min(0),
});
