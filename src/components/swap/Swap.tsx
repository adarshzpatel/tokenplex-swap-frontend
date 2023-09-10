import { marketConstants } from "@/solana/config";
import { createNewAskOrder } from "@/solana/instructions";
import { IDL } from "@/solana/tokenplex_exchange";
import { Button, Select, SelectItem, button } from "@nextui-org/react";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { ChangeEvent, useState } from "react";

const pcTokens = [
  { label: "USDC", value: "usdc" },
  { label: "SOL", value: "sol" },
];
const coinTokens = [
  { label: "BONK", value: "bonk" },
  { label: "DOGE", value: "doge" },
];

const Swap = () => {
  const connectedWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [values, setValues] = useState({
    pcName: "USDC",
    coinName: "DOGE",
    pcQty: "0.0",
    coinQty: "0.0",
    conversionRate: 1.45,
  });

  const handlePcInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newPcQty = Number(e.target.value);
    setValues((values) => ({
      ...values,
      pcQty: newPcQty.toString(),
      coinQty: (values.conversionRate * newPcQty).toString(),
    }));
  };

  const getPcBalance = async () => {};

  const getCoinBalance = async () => {};

  const handleSwap = async () => {
    // const conversionRate = new BN(Number(values.conversionRate)) // Limit Price
    // const coinQty = new BN(Number(values.coinQty));
    // const pcQty = new BN(Number(values.pcQty));
    try {
      if (!connectedWallet) throw new Error("Wallet Not Found!");
      const provider = new AnchorProvider(
        connection,
        connectedWallet,
        AnchorProvider.defaultOptions()
      );
      const program = new Program(IDL, marketConstants.programId, provider);
      console.log(connection.getBalance(connectedWallet.publicKey));
    } catch (err: any) {
      console.error(err);
      alert("Check console for error");
    }
  };

  return (
    <div className="overflow-hidden border border-default-200 rounded-2xl bg-gradient-to-br max-w-md w-full from-default-50 to-black">
      <div className="p-6  space-y-4">
        {/* PAY SECTION */}
        <p className="text-xl font-medium">Swap Tokens</p>
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
            {/* <div className={`${button({ variant: "flat", size: "lg" })}`}>
              <img
                src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026"
                alt=""
                className="h-6 w-6 "
              />
              {values.pcName}
            </div> */}
            {/* <Select
              variant="flat"
              labelPlacement="outside"
              items={pcTokens}
              size="lg"
              selectedKeys={}
              multiple={false}
            >
              {(token) => (
                <SelectItem key={token.value}>{token.label}</SelectItem>
              )}
            </Select> */}
          </div>
          <p className="text-sm text-gray-400">
            Balance : 0.00 {values.pcName}
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
            {/* DROPDOWN */}
            {/* <Select
              variant="bordered"
              labelPlacement="outside"
              items={coinTokens}
            >
              {(token) => (
                <SelectItem key={token.value}>{token.label}</SelectItem>
              )}
            </Select> */}
            <div className={`${button({ variant: "flat", size: "lg" })}`}>
              <img
                src="https://cryptologos.cc/logos/versions/dogecoin-doge-logo-alternative.svg?v=026"
                alt=""
                className="h-6 w-6 "
              />
              {values.coinName}
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Balance : 0.00 {values.coinName}
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
          Calculate Price
        </Button>
      </div>

      <div className="px-6 py-4 text-default-500 items-center bg-gradient-to-b border-tr from-default-50 border-t to-black border-default-200 flex justify-between">
        {/* CONVERSION RATE */}
        <p>Conversion Rate </p>
        <p className="text-sm">
          1 {values.pcName} = {values.conversionRate.toFixed(4)}{" "}
          {values.coinName}
        </p>
      </div>
    </div>
  );
};

export default Swap;
