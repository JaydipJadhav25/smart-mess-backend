import dotenv from "dotenv"
dotenv.config();
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { NonceManager } from "ethers";

const abiPath = path.resolve(
  process.cwd(),
  "contract/abi/SmartMessContract.json"
);


//  IMPORTANT FIX
const artifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const abi = artifact.abi;   // ✅ THIS MUST BE AN ARRAY



const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

const provider = new ethers.JsonRpcProvider(RPC_URL);


// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// //aacess contract
// const contract = new ethers.Contract(
//   process.env.CONTRACT_ADDRESS,
//   abi,
//   wallet
// );



const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const managedSigner = new NonceManager(wallet);

const contract = new ethers.Contract( 
process.env.CONTRACT_ADDRESS,
abi, 
managedSigner);



//acreate function
export const recordFeeOnBlockchain = async (
  studentId,
  receiptId,
  amount,
  method
) => {

  // console.log("data contract : " , studentId , receiptId , amount , method);

    //call contract function
  const tx = await contract.recordFee(
    studentId,
    receiptId,
    amount,
    method
  );

  // console.log("contract call : " , tx );

  //wait to verify and  done transcation
  const receipt = await tx.wait();


  // console.log("contract done: " , receipt);

  
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber
  };
};
// https://sepolia.etherscan.io/tx/<-- txHash -->#eventlog#117