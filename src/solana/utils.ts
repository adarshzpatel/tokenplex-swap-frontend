import {AnchorProvider} from "@project-serum/anchor"
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import * as spl from '@solana/spl-token';

export const createMint = async (
  provider: AnchorProvider,
  mint: Keypair,
  decimal: number,
) => {
  const tx = new Transaction();
  tx.add(
    SystemProgram.createAccount({
      programId: spl.TOKEN_PROGRAM_ID,
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      space: spl.MintLayout.span,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        spl.MintLayout.span,
      ),
    }),
  );
  tx.add(
    spl.createInitializeMintInstruction(
      mint.publicKey,
      decimal,
      provider.wallet.publicKey,
      provider.wallet.publicKey,
    ),
  );
  await provider.sendAndConfirm(tx, [mint]);
};

export const createAssociatedTokenAccount = async (
  provider: AnchorProvider,
  mint: PublicKey,
  ata: PublicKey,
  owner: PublicKey,
) => {
  const tx = new Transaction();
  tx.add(
    spl.createAssociatedTokenAccountInstruction(
      provider.wallet.publicKey,
      ata,
      owner,
      mint,
    ),
  );
  await provider.sendAndConfirm(tx, []);
};

export const mintTo = async (
  provider: AnchorProvider,
  mint: PublicKey,
  ta: PublicKey,
  amount: bigint,
) => {
  const tx = new Transaction();
  tx.add(
    spl.createMintToInstruction(
      mint,
      ta,
      provider.wallet.publicKey,
      amount,
      [],
    ),
  );
  await provider.sendAndConfirm(tx, []);
};


export const fetchTokenBalance = async (
  userPubKey:PublicKey,
  mintPubKey:PublicKey,
  connection:Connection 
) => {
  const associatedTokenAddress = await spl.getAssociatedTokenAddress(
    mintPubKey,
    userPubKey,
    false
  )

  const accountData = await spl.getAccount(connection,associatedTokenAddress);
  return accountData.amount.toString();

}