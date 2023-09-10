import {
  AggregatorAccount,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";


import { Connection } from "@solana/web3.js";

const program = await SwitchboardProgram.load(
  "devnet",
  new Connection(
    "https://rpc-devnet.helius.xyz/?api-key=69bea66a-a716-416b-8a45-a9c7049b0731",
    { commitment: "confirmed" }
  )
);

// export const getPrice = async () => {
try {
  // console.log("Got the program : ", { program });
  const aggregatorAccount = new AggregatorAccount(program, "FoBK7CgwobLrEfGC8MaGFpYxhucCo1DBhAm5EEvUPD2i");
  //console.log("Got the agrregator account : ", { aggregatorAccount });
  const aggregatorState =
    await aggregatorAccount.loadData();
  console.log("Got the agreegator state : ", { aggregatorState });
  // return aggregatorState;
} catch (err) {
  console.log("Caught an error in getPrice()", { err });
}
// };
