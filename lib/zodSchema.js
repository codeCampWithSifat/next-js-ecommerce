import {z} from "zod";

export const zSchema = z.object({
    email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" }),

    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(100, { message: "Name is too long." })
      // allow letters (unicode), spaces, dots, hyphens and apostrophes
      .regex(/^[\p{L}\s.'-]+$/u, {
        message: "Name may only contain letters, spaces, dots, hyphens and apostrophes.",
      }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must not exceed 128 characters" }),

  confirmPassword: z.string(),  
})