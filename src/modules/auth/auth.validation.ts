import { z } from "zod";
import { generalFields } from "../../middleware/validation.middleware";

export const login = {
  body: z
    .strictObject({
      password: generalFields.password,
      confirmPassword: generalFields.confirmPassword,
      email: generalFields.email,
    })
    .superRefine((data, ctx) => {
      if (data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Password mismatch Confirm password",
        });
      }
    }),
};

export const confirmEmail = {
  body: z
    .strictObject({
      otp:generalFields.otp,
      email: generalFields.email,
    })

};

export const signup = {
  body: login.body.extend({
    username: generalFields.username,
  }),
};