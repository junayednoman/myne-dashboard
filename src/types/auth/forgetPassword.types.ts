import { z } from "zod";
import { forgetPasswordSchema } from "@/validations/auth/forgetPassword.validation";

export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;
