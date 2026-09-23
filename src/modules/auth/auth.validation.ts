import { z } from "zod";

export const signup = {
  body: z
    .object({
      username: z
        .string()
        .min(2, {
          error: "username must be at least 2 char",
        })
        .max(20),
      email: z.email(),
      password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Password missmatch Confirm password",
        });
      }
    }),
};
