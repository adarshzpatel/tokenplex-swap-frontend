import { NextUIProvider, Spinner } from "@nextui-org/react";
import SolanaWalletProvider from "./SolanaWalletProvider";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";


type ProvidersProps = {
  children: React.ReactNode;
};
const Providers = ({ children }: ProvidersProps) => {
  const [mounted,setMounted] = useState(false);

  useEffect(()=>{
    setMounted(true)
  },[]);
  
  if(!mounted) return <div className="min-h-screen w-screen grid place-items-center  bg-default-50"><Spinner color="white" size="lg" label="Loading..."/></div>;
  
  return (
    <SolanaWalletProvider>
    <Toaster position="bottom-right" toastOptions={{className:"!border !border-default-300 !bg-default-50 !shadow-xl !text-gray-200"}}/>
      <NextUIProvider>{children}</NextUIProvider>
    </SolanaWalletProvider>
  );
};

export default Providers;
