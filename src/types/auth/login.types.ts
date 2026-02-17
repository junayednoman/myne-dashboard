import { z } from "zod";
import { loginSchema } from "@/validations/auth/login.validation";

export type LoginFormValues = z.infer<typeof loginSchema>;

