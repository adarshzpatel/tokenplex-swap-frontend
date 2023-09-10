import { NextUIProvider, Spinner } from "@nextui-org/react";
import SolanaWalletProvider from "./SolanaWalletProvider";
import { useEffect, useState } from "react";


type ProvidersProps = {
  children: React.ReactNode;
};
const Providers = ({ children }: ProvidersProps) => {
  const [mounted,setMounted] = useState(false);

  useEffect(()=>{
    setMounted(true)
  },[]);
  if(!mounted) return <div className="min-h-screen w-screen grid place-items-center bg-default-50"><Spinner color="white" size="lg" label="Loading..."/></div>;
  return (
    <SolanaWalletProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SolanaWalletProvider>
  );
};

export default Providers;
