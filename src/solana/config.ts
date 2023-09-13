import { Keypair, PublicKey } from "@solana/web3.js";
import { Market } from "./types";

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
    market: "6m5p2wCd4e2bhbYc6f37FLHABGYxrkGUGPmwSSo97aVq",
    pcToken: "USDC",
    coinToken: "PEPE",
    coinMint: "F2SJhj95iQUT6sn2JRYMJaDqjm7D96sUYW8p4ycRbvsV",
    pcMint: "73EnT6vwH2iw9pgDUnyMPmutFozaCSFNRF5StiHJ74jU",
    pcLotSize: 1000000,
    coinLotSize: 1000000000,
    priceFeedPubKey:"GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR",
    oraclePubKey:"SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f",
    dataFeedPubKey:"FoBK7CgwobLrEfGC8MaGFpYxhucCo1DBhAm5EEvUPD2i"
  },
];

