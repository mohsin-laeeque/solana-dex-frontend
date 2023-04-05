import {
  Box,
  Select,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import * as Web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  kryptMint,
  ScroogeCoinMint,
  tokenSwapStateAccount,
  swapAuthority,
  poolKryptAccount,
  poolScroogeAccount,
  poolMint,
  feeAccount,
} from "../utils/constants";
import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { TokenSwap, CurveType } from "../src";
const TOKEN_SWAP_PROGRAM_ID = new Web3.PublicKey(
  "3LB4DBcbCtMjJn2geDBzGidbpEgG9Z4785tRSAfNeedP"
);
import * as token from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { publicKey } from "@project-serum/borsh";

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
  return mintInfo;
}

export const SwapToken: FC = () => {
  const [amount, setAmount] = useState(0);
  const [mint, setMint] = useState("");
  let tokenSwap: TokenSwap;
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSwapSubmit = (event: any) => {
    event.preventDefault();
    handleTransactionSubmit();
  };

  const handleTransactionSubmit = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const kryptMintInfo = getMintInfo(kryptMint, connection);
    const ScroogeCoinMintInfo = getMintInfo(ScroogeCoinMint, connection);

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

    const transaction = new Web3.Transaction();

    let account = await connection.getAccountInfo(tokenAccountPool);

    if (account == null) {
      const createATAInstruction =
        token.Token.createAssociatedTokenAccountInstruction(
          token.ASSOCIATED_TOKEN_PROGRAM_ID,
          token.TOKEN_PROGRAM_ID,
          poolMint,
          publicKey,
          publicKey,
          publicKey
        );
      transaction.add(createATAInstruction);
    }
    console.log("loading token swap");
    const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
        connection,
        tokenSwapStateAccount,
        TOKEN_SWAP_PROGRAM_ID,
        new Account()
      );
      tokenSwap = fetchedTokenSwap;
    const minout= 90674;
    if (mint == "option1") {
      const instruction = TokenSwap.swapInstruction(
        tokenSwap.tokenSwap,
        tokenSwap.authority,
        publicKey,
        kryptATA,
        poolKryptAccount,
        poolScroogeAccount,
        scroogeATA,
        poolMint,
        tokenSwap.feeAccount,
        null,
        kryptMint,
        ScroogeCoinMint,
        tokenSwap.swapProgramId,
        TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        amount*10** 2,
       1,
        
      );

      transaction.add(instruction);
    } else if (mint == "option2") {
      const instruction = TokenSwap.swapInstruction(
        tokenSwap.tokenSwap,
        tokenSwap.authority,
        publicKey,
        scroogeATA,

        poolScroogeAccount,
        poolKryptAccount,
        kryptATA,

        poolMint,
        tokenSwap.feeAccount,
        null,
        ScroogeCoinMint,
        kryptMint,
        tokenSwap.swapProgramId,
        TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        amount*10** 2,
        1,
      );

      transaction.add(instruction);
    }
    const confirmOptions = {
        skipPreflight: true,
      };

    try {
      let txid = await sendTransaction(transaction, connection);
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
      <form onSubmit={handleSwapSubmit}>
        <FormControl isRequired>
          <FormLabel color="gray.200">Swap Amount</FormLabel>
          <NumberInput
            max={1000}
            min={1}
            onChange={(valueString) => setAmount(parseInt(valueString))}
          >
            <NumberInputField id="amount" color="gray.400" />
          </NumberInput>
          <div style={{ display: "felx" }}>
            <Select
              display={{ md: "flex" }}
              justifyContent="center"
              placeholder="Token to Swap"
              color="white"
              variant="outline"
              dropShadow="#282c34"
              onChange={(item) => setMint(item.currentTarget.value)}
            >
              <option style={{ color: "#282c34" }} value="option1">
                {" "}
                Token A with Token B{" "}
              </option>
              <option style={{ color: "#282c34" }} value="option2">
                {" "}
                Token B with Token A {" "}
              </option>
            </Select>
          </div>
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Swap ⇅
        </Button>
      </form>
    </Box>
  );
};
