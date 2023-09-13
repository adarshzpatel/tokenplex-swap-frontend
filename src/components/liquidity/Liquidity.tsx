import { getMarketConstants } from "@/hooks/getMarketConstants";
import { OWNER_KEYPAIR, PROGRAM_ID, markets } from "@/solana/config";
import { IDL } from "@/solana/tokenplex_exchange";
import { fetchTokenBalance } from "@/solana/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Selection,
  button,
  useDisclosure,
} from "@nextui-org/react";
import { AnchorProvider, BN, Program, web3 } from "@project-serum/anchor";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Balances = { pcBalance: string; coinBalance: string };

const Liquidity = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const connectedWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [values, setValues] = useState({
    coinQty: "0.0",
    conversionRate:"0.0"
  });

  const [marketName, setMarketName] = useState<Selection>(
    new Set([markets[0].market])
  );
  const [tx, setTx] = useState("");
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [balances, setBalances] = useState<Balances>({
    pcBalance: "0.00",
    coinBalance: "0.00",
  });

  const handleCoinInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newPcQty = Number(e.target.value);
    setValues((values) => ({
      ...values,
      coinQty: newPcQty.toString(),
    }));
  };

  const closeModal = () => {
    setTx("");
    onClose();
    setValues({
      coinQty: "0.0",
      conversionRate:"0.0"
    })
  };
  // const getPcBalance = async () => {
  //   try {
  //     if (!connectedWallet?.publicKey) {
  //       alert("No wallet found");
  //       return;
  //     }

  //     const pcBalance = await fetchTokenBalance(
  //       connectedWallet?.publicKey,
  //       new PublicKey(selectedMarket.pcMint),
  //       connection
  //     );

  //     setBalances(prev => ({
  //       ...prev,
  //       pcBalance: (Number(pcBalance) / selectedMarket.pcLotSize).toFixed(2),
  //     }));
  //   } catch (err) {
  //     console.log("Error in getPcBalance", err);
  //   }
  // };
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

  const handleSupply = async () => {
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

      const [openOrdersPda] = await web3.PublicKey.findProgramAddress(
        [
          Buffer.from("open-orders", "utf-8"),
          marketPda.toBuffer(),
          connectedWallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      if (!openOrdersPda || !selectedMarket?.pcMint)
        throw new Error("No open orders found");

      const authorityCoinTokenAccount = await getAssociatedTokenAddress(
        new web3.PublicKey(selectedMarket?.coinMint),
        connectedWallet.publicKey,
        true
      );

  
      
      const priceRes = await axios.get(`api/price?dataFeedPubKey=${selectedMarket.dataFeedPubKey}`);
      const price = Number(priceRes.data.price) * 1.025 
      const pcQty = Number(price) * Number(values.coinQty)
      console.log(pcQty)
      
      const tx = await program.methods
        .newOrder({ ask: {} }, new BN(price), new BN(values.coinQty), new BN(pcQty), {
          limit: {},
        })
        .accounts({
          openOrders: openOrdersPda,
          market: marketPda,
          coinVault: marketConstants?.coinVault,
          pcVault: marketConstants?.pcVault,
          coinMint: marketConstants?.coinMint,
          pcMint: marketConstants?.pcMint,
          payer: authorityCoinTokenAccount,
          bids: marketConstants?.bids,
          asks: marketConstants?.asks,
          reqQ: marketConstants?.reqQ,
          eventQ: marketConstants?.eventQ,
          switchboard:selectedMarket.oraclePubKey,
          aggregator:selectedMarket.priceFeedPubKey,
          authority: connectedWallet.publicKey,
        })
        .rpc();
      setTx(tx);
      onOpen();
      toast("Supply Successful ✅");
      console.log("Supplied", tx);
      // getPcBalance();
      getCoinBalance();
    } catch (err: any) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  // const getEventQ = async () => {
  //   if(!connectedWallet) return;
  //   const provider = new AnchorProvider(
  //     connection,
  //     connectedWallet,
  //     AnchorProvider.defaultOptions()
  //   );

  //   const program = new Program(IDL, PROGRAM_ID, provider);
  //   const marketPda = new PublicKey(selectedMarket?.market);
  //   const marketConstants = await getMarketConstants(marketPda, program);
  //   if (!marketConstants) return;

  //   const [openOrdersPda] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from('open-orders', 'utf-8'),
  //       marketPda.toBuffer(),
  //       OWNER_KEYPAIR.publicKey.toBuffer(),
  //     ],
  //     program.programId,
  //   );

  //   const eventQ = await program.account.eventQueue.fetch(marketConstants.eventQ);
  //   if(!eventQ.buf) return
  //   const myOrders = (eventQ?.buf as any[]).filter(item => item.owner.toString() == openOrdersPda.toString());
  //   console.log(myOrders[0].nativeQtyReleased.toString())
  // }

  useEffect(() => {
    if (connectedWallet && selectedMarket) {
      getCoinBalance();
    }
  }, [selectedMarket, connectedWallet]);

  return (
    <div className="overflow-hidden border border-default-200 rounded-2xl bg-gradient-to-br max-w-md w-full from-default-50 to-black">
      <div className="p-6  space-y-4">
        {/* PAY SECTION */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-medium whitespace-nowrap">
            Supply Tokens
          </p>
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

        <div className="p-4 rounded-xl bg-default-100/75 space-y-1 ">
          <p className="text-sm text-default-600">You send</p>
          <div className="flex justify-between">
            <input
              type="number"
              value={values.coinQty}
              onChange={handleCoinInput}
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
        {/* <div className="p-4 bg-default-100/75 rounded-xl space-y-1 ">
          <p className="text-sm text-default-600">You receive</p>
          <div className="flex justify-between">
            <input
              value={values.pcQty}
              type="number"
              step={0.01}
              min={0.0}
              disabled
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
        </div> */}

        <Button
          onClick={handleSupply}
          variant="solid"
          color="primary"
          fullWidth
          size="lg"
          radius="sm"
          isDisabled={Number(values.coinQty) === 0}
        >
          SUPPLY
        </Button>
      </div>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={closeModal}

      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Swap Successfull ✅
          </ModalHeader>
          <ModalBody>
            Tx: <p className="text-gray-400"> {tx.slice(0,15)}....{tx.slice(-15)}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Close
            </Button>
            <Link
              className={button({ color: "primary" })}
              color="primary"
              target="_blank"
              href={`https://solscan.io/tx/${tx}?cluster=devnet`}
            >
              See Tx in Explorer
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Liquidity;
