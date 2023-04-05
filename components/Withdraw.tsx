import {
  Box,
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
// import { TokenSwap,TOKEN_SWAP_PROGRAM_ID} from "@solana/spl-token-swap"
import * as token from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const TOKEN_SWAP_PROGRAM_ID = new Web3.PublicKey(
  "3LB4DBcbCtMjJn2geDBzGidbpEgG9Z4785tRSAfNeedP"
);
import { TokenSwap, CurveType } from "../src";

export const WithdrawSingleTokenType: FC = (props: {
  onInputChange?: (val: number) => void;
  onMintChange?: (account: string) => void;
}) => {
  const [poolTokenAmount, setAmount] = useState(0);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleWithdrawSubmit = (event: any) => {
    event.preventDefault();
    handleTransactionSubmit();
  };

  const handleTransactionSubmit = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    let poolMintInfo;
    // const temp =  getMintInfo(poolMint, connection);
    const mintAccountInfo = await connection.getAccountInfo(poolMint);
    if (mintAccountInfo != null) {
      poolMintInfo = token.MintLayout.decode(Buffer.from(mintAccountInfo.data));
    }

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

    // let account = await connection.getAccountInfo(tokenAccountPool)
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

    // if (account == null) {
    //     const createATAInstruction =
    //         token.createAssociatedTokenAccountInstruction(
    //             publicKey,
    //             tokenAccountPool,
    //             publicKey,
    //             poolMint
    //         )
    //     transaction.add(createATAInstruction)
    // }

    const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
      connection,
      tokenSwapStateAccount,
      TOKEN_SWAP_PROGRAM_ID,
      new Web3.Account()
    );
    let tokenSwap = fetchedTokenSwap;

    const instruction = TokenSwap.withdrawAllTokenTypesInstruction(
      tokenSwap.tokenSwap,
      tokenSwap.authority,
      publicKey,
      poolMint,
      tokenSwap.feeAccount,
      tokenAccountPool,
      poolKryptAccount,
      poolScroogeAccount,
      kryptATA,
      scroogeATA,kryptMint,ScroogeCoinMint,
      TOKEN_SWAP_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      poolTokenAmount * 10 ** poolMintInfo.decimals,
      0,
      0
    );
console.log("Pool token Mint Decimals  ",poolMintInfo.decimals)
    transaction.add(instruction)
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
      <form onSubmit={handleWithdrawSubmit}>
        <FormControl isRequired>
          <FormLabel color="gray.200">LP-Token Withdrawal Amount</FormLabel>
          <NumberInput
            min={1}
            onChange={(valueString) => setAmount(parseInt(valueString))}
          >
            <NumberInputField id="amount" color="gray.400" />
          </NumberInput>
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Withdraw
        </Button>
      </form>
    </Box>
  );
};
