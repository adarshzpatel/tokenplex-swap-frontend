import { getMarketConstants } from "@/hooks/getMarketConstants";
import { PROGRAM_ID, markets } from "@/solana/config";
import { IDL } from "@/solana/tokenplex_exchange";
import { fetchTokenBalance } from "@/solana/utils";
import {
  Button,
  Select,
  SelectItem,
  Selection,
  button,
} from "@nextui-org/react";
import { AnchorProvider, BN, Program, web3 } from "@project-serum/anchor";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ChangeEvent, useEffect, useState } from "react";

type Balances = { pcBalance: string; coinBalance: string };

const Swap = () => {
  const connectedWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [values, setValues] = useState({
    pcQty: "0.0",
    coinQty: "0.0",
    conversionRate: 2,
  });

  const [marketName, setMarketName] = useState<Selection>(
    new Set([markets[0].market])
  );
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [balances, setBalances] = useState<Balances>({
    pcBalance: "0.00",
    coinBalance: "0.00",
  });

  const handlePcInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newPcQty = Number(e.target.value);
    setValues((values) => ({
      ...values,
      pcQty: newPcQty.toString(),
      coinQty: ((values.conversionRate * newPcQty)).toString(),
    }));
  };

  const getPcBalance = async () => {
    try {
      if (!connectedWallet?.publicKey) {
        alert("No wallet found");
        return;
      }

      const pcBalance = await fetchTokenBalance(
        connectedWallet?.publicKey,
        new PublicKey(selectedMarket.pcMint),
        connection
      );

      setBalances(prev => ({
        ...prev,
        pcBalance: (Number(pcBalance) / selectedMarket.pcLotSize).toFixed(2),
      }));
    } catch (err) {
      console.log("Error in getPcBalance", err);
    }
  };
  const getCoinBalance = async () => {
    try {
      if (!connectedWallet?.publicKey) {
        alert("No wallet found");
        return;
      }

      const coinBalance = await fetchTokenBalance(
        connectedWallet.publicKey,
        new PublicKey(selectedMarket.coinMint),
        connection
      );
      setBalances(prev => ({
        ...prev,
        coinBalance: (Number(coinBalance) / selectedMarket.coinLotSize).toFixed(2)
      }));
    } catch (err) {
      console.log("Error in getPcBalance", err);
    }
  };
  
  const handleSwap = async () => {
    try {
      if (!connectedWallet) throw new Error("Wallet Not Found!");
      
      const provider = new AnchorProvider(
        connection,
        connectedWallet,
        AnchorProvider.defaultOptions()
      );

      const program = new Program(IDL, PROGRAM_ID, provider);
      const marketPda = new PublicKey(selectedMarket?.market);
      const marketConstants = await getMarketConstants(marketPda, program);
      if (!marketConstants) return;

      console.log("MARKET CONSTANTS", JSON.stringify(marketConstants, null, 2));
      const [openOrdersPda] = await web3.PublicKey.findProgramAddress(
        [
          Buffer.from("open-orders", "utf-8"),
          marketPda.toBuffer(),
          connectedWallet.publicKey.toBuffer(),
        ],
        program.programId
      );
      console.log({ openOrdersPda });
      if (!openOrdersPda || !selectedMarket?.pcMint)
        throw new Error("No open orders found");

      const authorityPCTokenAccount = await getAssociatedTokenAddress(
        new web3.PublicKey(selectedMarket?.pcMint),
        connectedWallet.publicKey,
        true
      );

      const tx = await program.methods
        .newOrder(
          { bid: {} },
          new BN(values.conversionRate),
          new BN(values.coinQty),
          new BN(values.pcQty)
            .mul(new BN(values.conversionRate)),
          { limit: {} }
        )
        .accounts({
          openOrders: openOrdersPda,
          market: marketPda,
          coinVault: marketConstants?.coinVault,
          pcVault: marketConstants?.pcVault,
          coinMint: marketConstants?.coinMint,
          pcMint: marketConstants?.pcMint,
          payer: authorityPCTokenAccount,
          bids: marketConstants?.bids,
          asks: marketConstants?.asks,
          reqQ: marketConstants?.reqQ,
          eventQ: marketConstants?.eventQ,
          authority: connectedWallet.publicKey,
        })
        .rpc();
      console.log("Swapped", tx);
      getPcBalance();
      getCoinBalance();
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (connectedWallet && selectedMarket){
      getPcBalance();
      getCoinBalance();
    };
  }, [selectedMarket, connectedWallet]);

  return (
    <div className="overflow-hidden border border-default-200 rounded-2xl bg-gradient-to-br max-w-md w-full from-default-50 to-black">
      <div className="p-6  space-y-4">
        {/* PAY SECTION */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-medium whitespace-nowrap">Swap Tokens</p>
          <Select

            selectedKeys={marketName}
            onSelectionChange={(keys) => {
              console.log(keys);
              const marketPubKey = Array.from(keys)[0];
              const selectedMarket = markets.find(
                (it) => it.market === marketPubKey
              );
              if (!selectedMarket) return;
              setSelectedMarket(selectedMarket);
              setMarketName(keys);
            }}
            className="w-40"
            size="md"
            selectionMode="single"
            labelPlacement="outside"
            aria-label="select-market"
            variant="faded"
          >
            {markets.map((m) => (
              <SelectItem
                aria-label={`${m.coinToken} / ${m.pcToken}`}
                key={m.market}
                value={m.market}
                textValue={`${m.coinToken} / ${m.pcToken}`}
              >
                {m.coinToken} / {m.pcToken}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="p-4 bg-default-100/75 rounded-xl space-y-1 ">
          <p className="text-sm text-default-600">You pay</p>
          <div className="flex justify-between">
            <input
              value={values.pcQty}
              type="number"
              step={0.01}
              min={0.0}
              onChange={handlePcInput}
              className="bg-transparent w-52 outline-none text-3xl font-bold block placeholder:text-gray-500"
              placeholder="0.0000"
            />
            <div className={`${button({ variant: "flat", size: "sm" })}`}>
              {selectedMarket.pcToken}
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Balance : {balances.pcBalance} {selectedMarket.pcToken}
          </p>
        </div>
        {/* RECEIVE SECTION */}
        <div className="p-4 rounded-xl bg-default-100/75 space-y-1 ">
          <p className="text-sm text-default-600">You receive</p>
          <div className="flex justify-between">
            <input
              type="text"
              disabled
              value={values.coinQty}
              className="bg-transparent w-52 outline-none text-3xl font-bold block placeholder:text-gray-500"
              placeholder="0.0000"
            />

            <div className={`${button({ variant: "flat", size: "sm" })}`}>
              {selectedMarket.coinToken}
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Balance : {balances.coinBalance} {selectedMarket.coinToken}
          </p>
        </div>
        {/* SWAP BUTTON */}
        <Button
          onClick={handleSwap}
          variant="solid"
          color="primary"
          fullWidth
          size="lg"
        >
          SWAP
        </Button>
      </div>

      <div className="px-6 py-4 text-default-500 items-center bg-gradient-to-b border-tr from-default-50 border-t to-black border-default-200 flex justify-between">
        {/* CONVERSION RATE */}
        <p>Conversion Rate </p>
        <p className="text-sm">
          1 {selectedMarket.pcToken} = {values.conversionRate}{" "}
          {selectedMarket.coinToken}
        </p>
      </div>
    </div>
  );
};

export default Swap;
