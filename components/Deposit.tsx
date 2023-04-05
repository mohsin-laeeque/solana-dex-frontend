import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";

import { FC, useState,useEffect } from "react";
import * as Web3 from "@solana/web3.js";
import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  kryptMint,
  ScroogeCoinMint,
  tokenSwapStateAccount,
  swapAuthority,
  poolKryptAccount,
  poolScroogeAccount,
  poolMint,
} from "../utils/constants";

import { TokenSwap, CurveType } from "../src";
import * as token from "@solana/spl-token";
const TOKEN_SWAP_PROGRAM_ID = new Web3.PublicKey(
  "3LB4DBcbCtMjJn2geDBzGidbpEgG9Z4785tRSAfNeedP"
);

let tokenSwap: TokenSwap;

// async function getConnection(): Promise<Connection> {
//   if (connection) return connection;

//   const url = "https://api.devnet.solana.com";
//   connection = new Connection(url, "recent");
//   const version = await connection.getVersion();

//   console.log("Connection to cluster established:", url, version);

//   return connection;
// }

async function getMintInfo(
  mintAddress: PublicKey,
  connection: Web3.Connection
) {
  const mintAccountInfo = await connection.getAccountInfo(mintAddress);
  if (mintAccountInfo === null) {
    console.log(
      "Token mint account does not exist or has not been initialized"
    );
    return;
  }
  const mintInfo = token.MintLayout.decode(Buffer.from(mintAccountInfo.data));
  console.log("Mint info ", mintInfo);
  return mintInfo;
}

export const DepositSingleTokenType = (props: {
  onInputChange?: (val: number) => void;
  onMintChange?: (account: string) => void;
}) => {
  const { connection } = useConnection();
  console.log("Connection Established", connection);
  const [poolTokenAmount, setAmount] = useState(0);

  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleTransactionSubmit();
  };

  const handleTransactionSubmit = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }
    const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
      connection,
      tokenSwapStateAccount,
      TOKEN_SWAP_PROGRAM_ID,
      new Account()
    );
    tokenSwap = fetchedTokenSwap;
    console.log("Fetched Token Swap is ", tokenSwap);

    let poolMintInfo;
    // const temp =  getMintInfo(poolMint, connection);
    const mintAccountInfo= await connection.getAccountInfo(poolMint);
    if (mintAccountInfo != null) {
      poolMintInfo =token.MintLayout.decode(Buffer.from(mintAccountInfo.data));
    }
    console.log("The Decimails of this token is ",poolMintInfo.decimals)

    console.log(poolMintInfo);

    const kryptATA = await token.Token.getAssociatedTokenAddress(
      token.ASSOCIATED_TOKEN_PROGRAM_ID,
      token.TOKEN_PROGRAM_ID,
      kryptMint,
      publicKey
    );
    const scroogeATA = await token.Token.getAssociatedTokenAddress(
      token.ASSOCIATED_TOKEN_PROGRAM_ID,
      token.TOKEN_PROGRAM_ID,
      ScroogeCoinMint,
      publicKey
    );
    const tokenAccountPool = await token.Token.getAssociatedTokenAddress(
      token.ASSOCIATED_TOKEN_PROGRAM_ID,
      token.TOKEN_PROGRAM_ID,
      poolMint,
      publicKey
    );
    console.log("LP Token Pool is  ", tokenAccountPool.toBase58());
    const transaction = new Web3.Transaction();

    let account = await connection.getAccountInfo(tokenAccountPool);

    if (account == null) {
      const createATAInstruction =
        await token.Token.createAssociatedTokenAccountInstruction(
          token.ASSOCIATED_TOKEN_PROGRAM_ID,
          token.TOKEN_PROGRAM_ID,
          poolMint,
          publicKey,
          publicKey,
          publicKey
        );
      transaction.add(createATAInstruction);
    }
    console.log("Fetching token swap now  ");

    const confirmOptions = {
      skipPreflight: true,
    };

    
    console.log("User account b is ", scroogeATA.toBase58());
    const instruction = await TokenSwap.depositAllTokenTypesInstruction(
      tokenSwap.tokenSwap,
      tokenSwap.authority,
      publicKey,
      kryptATA,
      scroogeATA,
      tokenSwap.tokenAccountA,
      tokenSwap.tokenAccountB,
      tokenSwap.poolToken,
      tokenAccountPool,
      tokenSwap.mintA,
      tokenSwap.mintB,
      tokenSwap.swapProgramId,
      token.TOKEN_PROGRAM_ID,
      token.TOKEN_PROGRAM_ID,
      tokenSwap.poolTokenProgramId,
      poolTokenAmount * 10 ** 2, //poolMintInfo?.decimals,
      100e9,
      100e9
    );
    // const instruction = tokenSwap.depositAllTokenTypes(
    //     kryptATA,
    //     scroogeATA,
    //     tokenAccountPool,
    //     token.TOKEN_PROGRAM_ID,
    //     token.TOKEN_PROGRAM_ID,
    //     poolMint,
    //   tokenSwapStateAccount,
    //   swapAuthority,
    //   publicKey,

    //   scroogeATA,
    //   poolKryptAccount,
    //   poolScroogeAccount,

    //   ,
    //   TOKEN_SWAP_PROGRAM_ID,

    //   poolTokenAmount * 10 ** poolMintInfo.decimals,
    //   100e9,
    //   100e9
    // );
    console.log("Pool decimal info ", poolMintInfo.decimals);
    transaction.add(instruction);
    try {
      let txid = await sendTransaction(transaction, connection, confirmOptions);
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
    } catch (e) {
      console.log(JSON.stringify(e));
      alert(JSON.stringify(e));
    }
  };

  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      margin={2}
      justifyContent="center"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ padding: "0px 10px 5px 7px" }}>
          <FormControl isRequired>
            <FormLabel color="gray.200">
              LP-Tokens to receive for deposit to Liquidity Pool
            </FormLabel>
            <NumberInput
              onChange={(valueString) => setAmount(parseInt(valueString))}
              style={{
                fontSize: 20,
              }}
              placeholder="0.00"
            >
              <NumberInputField id="amount" color="gray.400" />
            </NumberInput>
            <Button width="full" mt={4} type="submit">
              Deposit
            </Button>
          </FormControl>
        </div>
      </form>
    </Box>
  );
};
