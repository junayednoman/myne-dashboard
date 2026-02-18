import { z } from "zod";
import { setNewPasswordSchema } from "@/validations/auth/setNewPassword.validation";

export type SetNewPasswordFormValues = z.infer<typeof setNewPasswordSchema>;
