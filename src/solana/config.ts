import { Keypair, PublicKey } from "@solana/web3.js";

export const DATA_FEE_PUBLIC_KEY =
  "FoBK7CgwobLrEfGC8MaGFpYxhucCo1DBhAm5EEvUPD2i";

export const PROGRAM_ID = "EK1tZCBzCu4iHXucWQjwK2XAyDb5diLiNoP5HUCiAn8h";

export const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    1, 60, 46, 125, 82, 22, 178, 15, 93, 247, 249, 207, 76, 156, 177, 42, 124,
    17, 225, 67, 204, 111, 68, 38, 71, 16, 206, 114, 165, 219, 70, 72, 134, 112,
    118, 222, 227, 101, 128, 158, 70, 17, 179, 29, 31, 208, 236, 211, 12, 89,
    41, 84, 52, 209, 127, 51, 144, 164, 103, 219, 20, 253, 3, 158
  ])
);

export const markets = [
  {
    market:"2dv1KUWrPWUNhHcHtu5PUN3MVMSUHgs8FVRBVH93Gism",
    pcToken: "USDC",
    coinToken: "PEPE",
    pcMint: "84PnN54mcaoCSn4igzrbdxxzM586sewhosNjtFZ7cFTS",
    coinMint: "HNF5nqF4h7zYGpzLBNsyMXyxoDBTzXo9tcSEstwjAwRJ",
    pcLotSize:1000000,
    coinLotSize:1000000000,
  },
];
