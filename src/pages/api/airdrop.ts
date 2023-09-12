// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OWNER_KEYPAIR, PROGRAM_ID } from '@/solana/config';
import { IDL } from '@/solana/tokenplex_exchange';
import { createAssociatedTokenAccount, mintTo } from '@/solana/utils';
import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const destinationAddress = req.body?.destinationAddress;
  const destination = new PublicKey(destinationAddress);
  const mint = req.body?.mint;
  const amount = Number(req.body?.amount);
  const authority = OWNER_KEYPAIR;
  const wallet = new Wallet(OWNER_KEYPAIR);
  const connection = new Connection("https://api.devnet.solana.com",{commitment:'confirmed'});
  const provider = new AnchorProvider(connection,wallet,AnchorProvider.defaultOptions());

  const authorityCoinTokenAccount: PublicKey = await getAssociatedTokenAddress(
    new PublicKey(mint),
    destination,
    false,
  );

  if (!(await connection.getAccountInfo(authorityCoinTokenAccount))) {
    console.log("Coin ATA not found , creating ... ")
    await createAssociatedTokenAccount(
      provider,
      new PublicKey(mint),
      authorityCoinTokenAccount,
      destination
    );
    console.log("Created COIN ATA")
  }

  await mintTo(
    provider,
    new PublicKey(mint),
    authorityCoinTokenAccount,
    BigInt(amount)
  );
  console.log("MINTED")

  res.status(200).json({ message:"SUCESS" })
}
