import AForm from "@/components/form/AForm";
import { ACheckbox } from "@/components/form/ACheckbox";
import { AInput } from "@/components/form/AInput";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/validations/auth/login.validation";
import { LoginFormValues } from "@/types/auth/login.types";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import handleMutation from "@/utils/handleMutation";
import { useAdminLoginMutation } from "@/redux/api/authApi";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [adminLogin] = useAdminLoginMutation();

  useEffect(() => {
    const from = searchParams.get("from");
    if (from) {
      sessionStorage.setItem("redirectAfterLogin", from);
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormValues) => {
    await handleMutation(data, adminLogin, "Logging in...", () => {
      const from =
        searchParams.get("from") ??
        sessionStorage.getItem("redirectAfterLogin");
      const safeRedirect =
        from && from.startsWith("/") && !from.startsWith("/auth")
          ? from
          : "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      router.replace(safeRedirect);
    });
  };
  return (
    <div className="w-[550px] rounded-2xl border border-[#b7bdc82c] bg-[#171c248f] p-8 shadow-2xl backdrop-blur-md md:p-9">
      <h2 className="text-center text-[32px] leading-[100%] font-bold tracking-normal text-white">
        Welcome Back!
      </h2>
      <p className="mt-3 text-center text-[18px] leading-[130%] font-medium tracking-normal text-[#b5bbc6]">
        Please login to continue to your account.
      </p>

      <AForm<LoginFormValues>
        schema={loginSchema}
        onSubmit={onSubmit}
        defaultValues={{
          email: "junayednoman05@gmail.com",
          password: "@Strongpass123",
          rememberMe: false,
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

        <AInput
          name="password"
          label="Password"
          type="password"
          placeholder="**************"
          required
          className="border-[#7f8795] bg-transparent px-5 text-[24px] text-white placeholder:text-[#7f8795] focus-visible:border-[#a9b2c1]"
        />

        <div className="flex items-start justify-between pt-1">
          <ACheckbox name="rememberMe" label="Remember me" />
          <Link
            href="/auth/forget-password"
            className="mt-1 text-[14px] leading-[130%] font-normal tracking-normal text-[#d0d5dd] underline hover:text-white"
          >
            Forget password?
          </Link>
        </div>

        <Button type="submit" variant="white" className="mt-2 w-full">
          Log In
        </Button>
      </AForm>
    </div>
  );
};

export default LoginForm;
