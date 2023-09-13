// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OWNER_KEYPAIR, PROGRAM_ID } from "@/solana/config";
import { IDL } from "@/solana/tokenplex_exchange";
import {

  createMint,

} from "@/solana/utils";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";

import * as anchor from "@project-serum/anchor";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const authority = OWNER_KEYPAIR;
  const wallet = new anchor.Wallet(OWNER_KEYPAIR);
  const connection = new anchor.web3.Connection(
    "https://api.devnet.solana.com"
  );
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);

  const coinMint = anchor.web3.Keypair.generate();
  const pcMint = anchor.web3.Keypair.generate();
  await createMint(provider, coinMint, 9);
  console.log("Created coin mint");
  await createMint(provider, pcMint, 6);
  console.log("Created pc mint");

  const [marketPda, marketPdaBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("market", "utf-8"),
        coinMint.publicKey.toBuffer(),
        pcMint.publicKey.toBuffer(),
      ],
      program.programId
    );

  const [bidsPda, bidsPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("bids", "utf-8"), marketPda.toBuffer()],
    program.programId
  );
  const [asksPda, asksPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("asks", "utf-8"), marketPda.toBuffer()],
    program.programId
  );

  const [reqQPda, reqQPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("req-q", "utf-8"), marketPda.toBuffer()],
    program.programId
  );
  const [eventQPda, eventQPdaBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

  const [openOrdersPda, openOrdersPdaBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        marketPda.toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      program.programId
    );

  const coinVault = await getAssociatedTokenAddress(
    coinMint.publicKey,
    marketPda,
    true
  );
  const pcVault = await getAssociatedTokenAddress(
    pcMint.publicKey,
    marketPda,
    true
  );

  await program.methods
    .initializeMarket(new anchor.BN("1000000000"), new anchor.BN("1000000"))
    .accounts({
      market: marketPda,
      coinVault,
      pcVault,
      coinMint: coinMint.publicKey,
      pcMint: pcMint.publicKey,
      bids: bidsPda,
      asks: asksPda,
      reqQ: reqQPda,
      eventQ: eventQPda,
      authority: authority.publicKey,
  
    })
    .signers([authority])
    .rpc();

    const marketConstants = {
      programId: PROGRAM_ID,
      marketPda: marketPda,
      coinVault: coinVault,
      pcVault: pcVault,
      coinMint: coinMint.publicKey,
      pcMint: pcMint.publicKey,
      bidsPda: bidsPda,
      asksPda: asksPda,
      reqQPda: reqQPda,
      eventQPda: eventQPda,
      authority: authority.publicKey,
    };

    console.log(
      'New market initilalized ✨',
      JSON.stringify(marketConstants, null, 2),
    );

  res.status(200).json({ message: "SUCESS" ,marketConstants});
}
