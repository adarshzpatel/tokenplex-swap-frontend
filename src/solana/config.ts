import { Keypair, PublicKey } from "@solana/web3.js";
import { Market } from "./types";

export const DATA_FEE_PUBLIC_KEY =
  "FoBK7CgwobLrEfGC8MaGFpYxhucCo1DBhAm5EEvUPD2i";

export const PROGRAM_ID = "84eo5XmbNUVgW32SxwA3Hzc8mH94HdyWg2m5bDPGT863";
export const rpcUrl = "";
export const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    1, 60, 46, 125, 82, 22, 178, 15, 93, 247, 249, 207, 76, 156, 177, 42, 124,
    17, 225, 67, 204, 111, 68, 38, 71, 16, 206, 114, 165, 219, 70, 72, 134, 112,
    118, 222, 227, 101, 128, 158, 70, 17, 179, 29, 31, 208, 236, 211, 12, 89,
    41, 84, 52, 209, 127, 51, 144, 164, 103, 219, 20, 253, 3, 158,
  ])
);

export const markets: Market[] = [
  {
    market: "97EbTcxHUAqDX2eKnJ5RU4qVVSvQ3teaNjtLZcf7UF6q",
    pcToken: "USDC",
    coinToken: "PEPE",
    coinMint: "Hx4ZRo3zGs2aBA144f4CLfi5XYaLqHNci6xKrXGr1VQz",
    pcMint: "J4dRdQyWvRZ7oSrhNfU1EwtKf98r7HupVhx9XJwLApYq",
    pcLotSize: 1000000,
    coinLotSize: 1000000000,
  },
];
