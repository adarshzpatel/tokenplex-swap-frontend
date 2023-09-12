import { Keypair, PublicKey } from "@solana/web3.js";

export const DATA_FEE_PUBLIC_KEY =
  "FoBK7CgwobLrEfGC8MaGFpYxhucCo1DBhAm5EEvUPD2i";

export const PROGRAM_ID = "EK1tZCBzCu4iHXucWQjwK2XAyDb5diLiNoP5HUCiAn8h";
export const rpcUrl = "";
export const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    1, 60, 46, 125, 82, 22, 178, 15, 93, 247, 249, 207, 76, 156, 177, 42, 124,
    17, 225, 67, 204, 111, 68, 38, 71, 16, 206, 114, 165, 219, 70, 72, 134, 112,
    118, 222, 227, 101, 128, 158, 70, 17, 179, 29, 31, 208, 236, 211, 12, 89,
    41, 84, 52, 209, 127, 51, 144, 164, 103, 219, 20, 253, 3, 158,
  ])
);

export const markets = [
  {
    market: "2236vbru7CFpCk5eNyRFgpC21nXCHH7ds3saQ7TjwDww",
    pcToken: "USDC",
    coinToken: "PEPE",
    pcMint: "A8jater2464KWT5maWBaSfU2L1xSU66D5iBjq7hMzBxx",
    coinMint: "8fH3g9Vo9zPvsNhQerRpwDySmNU5qy9HSodiRsARL3Wc",
    pcLotSize: 1000000,
    coinLotSize: 1000000000,
  },
];
