
import { Toaster as ToastProvider } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export const Toaster = () => {
  return (
    <>
      <ToastProvider />
      <SonnerToaster position="top-right" />
    </>
  );
};
