import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { Button } from "@/components/ui/button";
import { ForgetPasswordFormValues } from "@/types/auth/forgetPassword.types";
import { forgetPasswordSchema } from "@/validations/auth/forgetPassword.validation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ForgetPasswordForm = () => {
  const router = useRouter();

  const onSubmit = (data: ForgetPasswordFormValues) => {
    console.log("Forget password payload:", data);
    toast.success("OTP sent successfully.");

    setTimeout(() => {
      router.push("/auth/verify-otp");
    }, 200);
  };

  return (
    <div className="w-[550px] rounded-2xl border border-[#b7bdc82c] bg-[#171c248f] p-8 shadow-2xl backdrop-blur-md md:p-9">
      <h2 className="text-center text-[32px] leading-[100%] font-bold tracking-normal text-white">
        Forgot Password
      </h2>
      <p className="mt-3 text-center text-[18px] leading-[130%] font-medium tracking-normal text-[#b5bbc6]">
        Please enter your email address to reset your password.
      </p>

      <AForm<ForgetPasswordFormValues>
        schema={forgetPasswordSchema}
        onSubmit={onSubmit}
        defaultValues={{
          email: "",
        }}
        className="mt-8 space-y-5"
      >
        <AInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          className="border-[#7f8795] bg-transparent px-5 text-[24px] text-white placeholder:text-[#7f8795] focus-visible:border-[#a9b2c1]"
        />

        <Button type="submit" variant="white" className="mt-2 w-full">
          Send OTP
        </Button>
      </AForm>
    </div>
  );
};

export default ForgetPasswordForm;
