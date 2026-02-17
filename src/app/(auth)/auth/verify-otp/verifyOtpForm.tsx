"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { VerifyOtpFormValues } from "@/types/auth/verifyOtp.types";
import { verifyOtpSchema } from "@/validations/auth/verifyOtp.validation";
import { useRouter } from "next/navigation";

const RESEND_SECONDS = 60;

const VerifyOtpForm = () => {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const router = useRouter();
  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const onSubmit = (data: VerifyOtpFormValues) => {
    console.log("Verify OTP payload:", data);
    toast.success("OTP verified successfully.");

    setTimeout(() => {
      router.push("/auth/set-new-password");
    }, 200);
  };

  const handleResend = () => {
    toast.success("OTP sent again.");
    setSecondsLeft(RESEND_SECONDS);
  };

  const formattedSeconds = String(secondsLeft).padStart(2, "0");

  return (
    <div className="w-[550px] rounded-2xl border border-[#b7bdc82c] bg-[#171c248f] p-8 shadow-2xl backdrop-blur-md md:p-9">
      <h2 className="text-center text-[32px] leading-[100%] font-bold tracking-normal text-white">
        Verify OTP
      </h2>
      <p className="mt-3 mb-16 text-center text-[18px] leading-[130%] font-medium tracking-normal text-[#b5bbc6]">
        Enter the 6-digit code sent to your email address.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className="h-12 w-12 rounded-[8px] border border-[#7f8795] bg-transparent text-lg text-white first:rounded-[8px] first:border last:rounded-[8px]"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-12 w-12 rounded-[8px] border border-[#7f8795] bg-transparent text-lg text-white first:rounded-[8px] first:border last:rounded-[8px]"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-12 w-12 rounded-[8px] border border-[#7f8795] bg-transparent text-lg text-white first:rounded-[8px] first:border last:rounded-[8px]"
                      />
                      <InputOTPSlot
                        index={3}
                        className="h-12 w-12 rounded-[8px] border border-[#7f8795] bg-transparent text-lg text-white first:rounded-[8px] first:border last:rounded-[8px]"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-12 w-12 rounded-[8px] border border-[#7f8795] bg-transparent text-lg text-white first:rounded-[8px] first:border last:rounded-[8px]"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-12 w-12 rounded-[8px] border border-[#7f8795] bg-transparent text-lg text-white first:rounded-[8px] first:border last:rounded-[8px]"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center text-sm text-[#c7ccd5]">
            {secondsLeft > 0 ? (
              <p className="text-[#b5bbc6]">
                Resend OTP in 00:{formattedSeconds}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-white underline hover:text-[#d6dbe4]"
              >
                Resend OTP
              </button>
            )}
          </div>

          <Button type="submit" variant="white" className="mt-2 w-full">
            Verify OTP
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VerifyOtpForm;
