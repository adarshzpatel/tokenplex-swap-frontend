import Image from "next/image";

import Header from "@/components/Header";
import { useState } from "react";
import Swap from "@/components/swap/Swap";
import Liquidity from "@/components/liquidity/Liquidity";


export type Modes = "swap" | "supply";

export default function Home() {
  const [mode, setMode] = useState<Modes>("swap");
  return (
    <main
      className={`flex min-h-screen flex-col`}
    >
      <Header setMode={setMode} />
      <div className="w-full flex-1 grid place-items-center">
        {mode === 'swap' && <Swap/>}
        {mode === 'supply' && <Liquidity/>}
      </div>
    </main>
  );
}
