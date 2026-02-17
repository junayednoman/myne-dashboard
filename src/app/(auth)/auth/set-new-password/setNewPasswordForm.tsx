"use client";

import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { Button } from "@/components/ui/button";
import { SetNewPasswordFormValues } from "@/types/auth/setNewPassword.types";
import { setNewPasswordSchema } from "@/validations/auth/setNewPassword.validation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SetNewPasswordForm = () => {
  const router = useRouter();
  const onSubmit = (data: SetNewPasswordFormValues) => {
    console.log("Set new password payload:", data);
    toast.success("Password updated successfully.");

    setTimeout(() => {
      router.push("/auth/login");
    }, 200);
  };

  return (
    <div className="w-[550px] rounded-2xl border border-[#b7bdc82c] bg-[#171c248f] p-8 shadow-2xl backdrop-blur-md md:p-9">
      <h2 className="text-center text-[32px] leading-[100%] font-bold tracking-normal text-white">
        Set New Password
      </h2>
      <p className="mt-3 text-center text-[18px] leading-[130%] font-medium tracking-normal text-[#b5bbc6]">
        Your password must be 8-10 character long.
      </p>

      <AForm<SetNewPasswordFormValues>
        schema={setNewPasswordSchema}
        onSubmit={onSubmit}
        defaultValues={{
          newPassword: "",
          confirmPassword: "",
        }}
        className="mt-8 space-y-5"
      >
        <AInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="Enter new password"
          required
          className="border-[#7f8795] bg-transparent px-5 text-[24px] text-white placeholder:text-[#7f8795] focus-visible:border-[#a9b2c1]"
        />

        <AInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          required
          className="border-[#7f8795] bg-transparent px-5 text-[24px] text-white placeholder:text-[#7f8795] focus-visible:border-[#a9b2c1]"
        />

        <Button type="submit" variant="white" className="mt-2 w-full">
          Update Password
        </Button>
      </AForm>
    </div>
  );
};

export default SetNewPasswordForm;
