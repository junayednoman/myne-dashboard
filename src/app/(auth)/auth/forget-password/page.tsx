"use client";

import Image from "next/image";
import loginImg from "@/assets/ss.png";
import ForgetPasswordForm from "./forgetPasswordForm";

export default function ForgetPasswordPage() {
  return (
    <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 px-6 pb-10 pt-16 lg:grid-cols-2 lg:px-10 lg:pt-28 gap-16 items-center">
      <div>
        <Image src={loginImg} className="w-full" alt="ss" />
      </div>

      <div className="flex items-center justify-center">
        <ForgetPasswordForm />
      </div>
    </section>
  );
}
