import {z} from "zod";


export const zSchema = z.object({
    email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must not exceed 128 characters" }),
})