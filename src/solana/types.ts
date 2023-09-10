import { Program } from "@project-serum/anchor"
import { Keypair, PublicKey } from "@solana/web3.js"

export type OrderParams = {
  program:Program
  marketPda:PublicKey
  coinMint:PublicKey
  price:number
  pcMint:PublicKey
  quantity:number 
  authority:Keypair
}