import { PROGRAM_ID, markets } from "@/solana/config";
import { IDL } from "@/solana/tokenplex_exchange";
import { fetchTokenBalance, mintTo } from "@/solana/utils";
import {
  Button,
  Divider,
  Select,
  SelectItem,
  Selection,
  Spinner,
  button,
} from "@nextui-org/react";
import {
  AnchorProvider,
  BN,
  Program,
  web3,
  Wallet,
} from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Balances = { pcBalance: string; coinBalance: string };

const Airdrop = () => {
  const [isLoading, setIsLoading] = useState(false);
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

      setBalances((prev) => ({
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
      setBalances((prev) => ({
        ...prev,
        coinBalance: (Number(coinBalance) / selectedMarket.coinLotSize).toFixed(
          2
        ),
      }));

    } catch (err) {
      console.log("Error in getPcBalance", err);
    }
  };

  const airdropToken = async (mint: string, amount: number) => {
    try {
      setIsLoading(true);
      const data = {
        destinationAddress: connectedWallet?.publicKey,
        mint,
        amount,
      };
      console.log(data);
      const res = await axios.post("/api/airdrop", data);
      console.log(res.data);
      await getPcBalance();
      await getCoinBalance();
      toast("Airdrop Successful ✅")
    } catch (err) {
      toast.error("Failed to send airdrop!!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connectedWallet && selectedMarket) {
      getPcBalance();
      getCoinBalance();
    }
  }, [selectedMarket, connectedWallet]);

  return (
    <div className="overflow-hidden relative flex flex-col gap-4 p-6 border border-default-200 rounded-2xl bg-gradient-to-br max-w-md w-full from-default-100/75 via-black to-default-100/75">
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
            airdropToken(selectedMarket.pcMint, 1000 * selectedMarket.pcLotSize)
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
      {isLoading && (
        <div className="w-full h-full backdrop-blur-xl z-10 absolute bg-black/50 top-0 left-0 scale-[0.995] rounded-xl flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Airdrop;
