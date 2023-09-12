import { getMarketConstants } from "@/hooks/getMarketConstants";
import { OWNER_KEYPAIR, PROGRAM_ID, markets } from "@/solana/config";
import { IDL, TokenplexExchange } from "@/solana/tokenplex_exchange";
import {
  fetchTokenBalance,
  createAssociatedTokenAccount,
  mintTo,
} from "@/solana/utils";
import {
  Button,
  Divider,
  Select,
  SelectItem,
  Selection,
  button,
} from "@nextui-org/react";
import {
  AnchorProvider,
  BN,
  Program,
  web3,
  Wallet,
} from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ChangeEvent, useEffect, useState } from "react";
import * as spl from "@solana/spl-token";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { AnchorWallet } from "@switchboard-xyz/solana.js";

type Balances = { pcBalance: string; coinBalance: string };

const Airdrop = () => {
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

  const airdropToken = async (mint: string,amount:number) => {
    const data = {
      destinationAddress: connectedWallet?.publicKey,
      mint,
      amount
    };
    console.log(data);
    const res = await fetch("/api/airdrop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(res.json());
    await getPcBalance();
    await getCoinBalance();
  };

  const doSomething = async () => {
    if(!connectedWallet) return 
    const provider = new AnchorProvider(connection,connectedWallet,AnchorProvider.defaultOptions());
    const program = new Program(IDL,PROGRAM_ID,provider);
    const market = await program.account.market.fetch(selectedMarket.market);
    console.log(market.pcLotSize.toString())
    console.log(market.coinLotSize.toString())
  };

  useEffect(() => {
    if(connectedWallet && selectedMarket) {
      getPcBalance();
      getCoinBalance();
    }
  }, [selectedMarket, connectedWallet]);

  return (
    <div className="overflow-hidden flex flex-col gap-4 p-6 border border-default-200 rounded-2xl bg-gradient-to-br max-w-md w-full from-default-100/75 via-black to-default-100/75">
      {/* PAY SECTION */}
      <div className="flex items-center justify-between">
        <p className="text-2xl font-medium whitespace-nowrap">Airdrop Tokens</p>
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
          radius="sm"
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
      <div className="bg-default-100/80 p-4 rounded-md  border border-default-300">
        <p>Market</p>
        <p className="text-xs text-default-600">{selectedMarket.market}</p>
      </div>
      <div className="bg-default-100/80 p-4 rounded-md  border border-default-300">
        <p>{selectedMarket.pcToken}</p>
        <p className="text-xs text-default-600">{selectedMarket.pcMint}</p>
        <Button
          onClick={() =>
            airdropToken(
              selectedMarket.pcMint,
              1000 * selectedMarket.pcLotSize
            )
          }
          size="sm"
          className="my-2"
          color="primary"
        >
          Airdrop 1000 {selectedMarket.pcToken} tokens
        </Button>
        <p>Balance : {balances.pcBalance}</p>
      </div>
      <div className="bg-default-100/80 p-4 rounded-md  border border-default-300">
        <p>{selectedMarket.coinToken}</p>
        <p className="text-xs text-default-600">{selectedMarket.coinMint}</p>
        <Button
          onClick={() =>
            airdropToken(
              selectedMarket.coinMint,
              1000 * selectedMarket.coinLotSize
            )
          }
          size="sm"
          className="my-2"
          color="primary"
        >
          Airdrop 1000 {selectedMarket.coinToken} tokens
        </Button>
        <p>Balance : {balances.coinBalance}</p>
      </div>
      <Button onClick={doSomething}>Do thing</Button>
    </div>
  );
};

export default Airdrop;
