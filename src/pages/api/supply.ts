import type { NextApiRequest, NextApiResponse } from "next";
import {
  AggregatorAccount,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { AggregatorAccountData } from "@switchboard-xyz/solana.js/generated";
import { DATA_FEE_PUBLIC_KEY, OWNER_KEYPAIR, PROGRAM_ID } from "@/solana/config";
import { IDL } from "@/solana/tokenplex_exchange";
import * as anchor from "@project-serum/anchor"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const program = await SwitchboardProgram.load(
      "devnet",
      new Connection(clusterApiUrl("devnet"), { commitment: "confirmed" })
    );

      res.status(200).json({program});
  } catch (error) {
    console.error("Error:", error);

    // Send an error response with a status code of 500
    res.status(500).json({ error: "An error occurred" });
  }
}