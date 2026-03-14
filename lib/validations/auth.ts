import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = signInSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, "Confirm your password with at least 8 characters."),
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;

export type SignUpInput = z.infer<typeof signUpSchema>;
