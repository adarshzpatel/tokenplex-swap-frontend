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
    //market: "ByvgnkUWvcmBik47CFNt8R2xhF4hbwhcV72mJHCQ2wh1",
    market: "4D5LENKeUC5e6cMpx1zu8taQFsPZNgzQRJGMeFXbbrSt",
    coinMint: "Bd1nUvogLf3xaKrthpF6fmfafTBWw8U3RggYQHtLm8gp",
    pcMint: "AVUVm8v2N2ReFvNXd2DxG9893p5KbgAoj5hZ4fsXRVeL",
    pcToken: "USDC",
    coinToken: "PEPE",
    //coinMint: "aAZW6P6dpfX4DygWRDkj1vLPqtJBbY4EHPF7WwaCcwW",
    //pcMint: "3D5Ahi5C74V6hjQmPMhHs5hbMpdVhxqNPZutbftxn6jw",
    pcLotSize: 1000000,
    coinLotSize: 1000000000,
    priceFeedPubKey: "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR",
    oraclePubKey: "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f",
    dataFeedPubKey: "FoBK7CgwobLrEfGC8MaGFpYxhucCo1DBhAm5EEvUPD2i",
  },
];
