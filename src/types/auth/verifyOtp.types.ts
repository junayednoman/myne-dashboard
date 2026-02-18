import { z } from "zod";
import { verifyOtpSchema } from "@/validations/auth/verifyOtp.validation";

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
