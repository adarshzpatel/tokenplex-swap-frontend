import { Program } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";

export type OrderParams = {
  program: Program;
  marketPda: PublicKey;
  coinMint: PublicKey;
  price: number;
  pcMint: PublicKey;
  quantity: number;
  authority: Keypair;
};

export type Market = {
  market: string 
  pcToken: string 
  coinToken: string 
  pcMint: string
  coinMint: string 
  pcLotSize: number;
  coinLotSize: number;
  priceFeedPubKey:string ;
  oraclePubKey:string
  dataFeedPubKey:string
};
