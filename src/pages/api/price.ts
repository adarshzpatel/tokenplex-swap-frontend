// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  AggregatorAccount,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { AggregatorAccountData } from "@switchboard-xyz/solana.js/generated";
import { DATA_FEE_PUBLIC_KEY } from "@/solana/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const program = await SwitchboardProgram.load(
      "devnet",
      new Connection(clusterApiUrl("devnet"), { commitment: "confirmed" })
    );

    const aggregatorAccount = new AggregatorAccount(
      program,
      DATA_FEE_PUBLIC_KEY
    );

    const aggregatorState: AggregatorAccountData = await aggregatorAccount.loadData();
    const price = await aggregatorState.latestConfirmedRound.result;
    
    // Send a successful JSON response
    res.status(200).json({ price:price.toString() });
  } catch (error) {
    console.error("Error:", error);

    // Send an error response with a status code of 500
    res.status(500).json({ error: "An error occurred" });
  }
}