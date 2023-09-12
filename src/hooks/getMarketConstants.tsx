import { PROGRAM_ID } from "@/solana/config";
import { IDL, TokenplexExchange } from "@/solana/tokenplex_exchange";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

export const getMarketConstants = async (
  marketPda: PublicKey,
  program:Program<TokenplexExchange>,
) => {
  try {
    if (!program) throw new Error("No program found")
    const market = await program.account.market.fetch(marketPda);
    return market;
  } catch (err) {
    console.log("SOMETHING WENT WRONG WHILE FETCHING MARKET CONSTANTS");
    console.error(err);
  }
};
