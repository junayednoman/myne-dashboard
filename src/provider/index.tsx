"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Toaster richColors position="top-center" duration={3000} />
    </>
  );
};

export default Providers;
