"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster richColors position="top-center" duration={3000} />
      </PersistGate>
    </Provider>
  );
};

export default Providers;
