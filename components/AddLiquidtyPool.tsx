import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  Input,
  NumberInputField,
} from "@chakra-ui/react";
import { FC, useState, useEffect } from "react";
import * as Web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { TokenSwap,TOKEN_SWAP_PROGRAM_ID} from "@solana/spl-token-swap"
import * as token from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const TOKEN_SWAP_PROGRAM_ID = new Web3.PublicKey(
  "3LB4DBcbCtMjJn2geDBzGidbpEgG9Z4785tRSAfNeedP"
);
const poolMint = new Web3.PublicKey(
  "3vVQjmFGZpJLpMBfCHMJd8F89fzFMbJLqZ6zjJdG3Kv2" // pool mint
);
const tokenAccountPool = new Web3.PublicKey(
  "7dh8ffutXRZxMvyD6LDZsSCuDfSGxTASfreqUDdeH5Lr" // pool a lp ccout
);

import { TokenSwap, CurveType, Numberu64, TokenSwapLayout } from "../src";
// Pool fees
const TRADING_FEE_NUMERATOR = 25;
const TRADING_FEE_DENOMINATOR = 10000;
const OWNER_TRADING_FEE_NUMERATOR = 5;
const OWNER_TRADING_FEE_DENOMINATOR = 10000;
const OWNER_WITHDRAW_FEE_NUMERATOR = 1;
const OWNER_WITHDRAW_FEE_DENOMINATOR = 6;
const HOST_FEE_NUMERATOR = 20;
const HOST_FEE_DENOMINATOR = 100;
export const AddLiquidtyPool: FC = (props: {
  onInputChange?: (val: number) => void;
  onMintChange?: (account: string) => void;
}) => {
  const [poolTokenAmount, setAmount] = useState(0);
  const [mintA, setMintA] = useState("");
  const [mintB, setMintB] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction,signTransaction } = useWallet();

  let transaction = new Web3.Transaction();

  useEffect(() => {
    async function genAuthority() {}
    genAuthority();
  }, []);

  const handleWithdrawSubmit = (event: any) => {
    event.preventDefault();
    handleTransactionSubmit();
  };


  const handleTransactionSubmit = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }
 
    const tokenSwapAccount = new Web3.Account();
    let authority: Web3.PublicKey;

    // bump seed used to generate the authority public key
    let bumpSeed: number;
    [authority, bumpSeed] = await Web3.PublicKey.findProgramAddress(
      [tokenSwapAccount.publicKey.toBuffer()],
      TOKEN_SWAP_PROGRAM_ID
    );

    console.log("Token Swap Account is ", tokenSwapAccount.publicKey);

    console.log("Swap authority is ", authority);

    console.log("Mint Address of A is ", mintA);


    
  let tokenPool = await token.Token.createMint(
    connection,
    useWallet,
    authority, //mint
    null, // freeze
    2,
    TOKEN_PROGRAM_ID, //SPL Token program account
  );
    



    // Pool Token Account A
    const associatedTokenAccountA = await token.Token.getAssociatedTokenAddress(
      token.ASSOCIATED_TOKEN_PROGRAM_ID,
      new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      new Web3.PublicKey(mintA),
      authority,
      true
    );
    console.log(
      "The address for token A Account  is ",
      associatedTokenAccountA.toBase58()
    );
    let accountA = await connection.getAccountInfo(associatedTokenAccountA);
    if (accountA == null) {
      const transactionAcin =
        token.Token.createAssociatedTokenAccountInstruction(
          token.ASSOCIATED_TOKEN_PROGRAM_ID,
          new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          new Web3.PublicKey(mintA),
          associatedTokenAccountA,
          authority,
          publicKey
        );
      transaction.add(transactionAcin);
    }

    // Pool Token Account B
    const associatedTokenAccountB = await token.Token.getAssociatedTokenAddress(
      token.ASSOCIATED_TOKEN_PROGRAM_ID,
      new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      new Web3.PublicKey(mintB),
      publicKey,
      true
    );
    console.log(
      "The address for token B is  ",
      associatedTokenAccountB.toBase58()
    );
    let accountB = await connection.getAccountInfo(associatedTokenAccountB);
    if (accountB == null) {
      const transactionBcin =
        token.Token.createAssociatedTokenAccountInstruction(
          token.ASSOCIATED_TOKEN_PROGRAM_ID,
          new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          new Web3.PublicKey(mintB),
          associatedTokenAccountB,
          publicKey,
          publicKey
        );
      transaction.add(transactionBcin);
    }


     // Pool Token Account Pool
     const associatedTokenAccountPool = await token.Token.getAssociatedTokenAddress(
      token.ASSOCIATED_TOKEN_PROGRAM_ID,
      new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      new Web3.PublicKey(poolMint),
      authority,
      true
    );
    console.log(
      "The address for pool token account is   ",
      associatedTokenAccountPool.toBase58()
    );
    let accountPool = await connection.getAccountInfo(associatedTokenAccountPool);
    if (accountPool == null) {
      const transactionPoolIn =
        token.Token.createAssociatedTokenAccountInstruction(
          token.ASSOCIATED_TOKEN_PROGRAM_ID,
          new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          new Web3.PublicKey(poolMint),
          associatedTokenAccountPool,
          authority,
          publicKey
        );
      transaction.add(transactionPoolIn);
    }


      // user Pool Token Account 
      const associatedTokenAccountUser = await token.Token.getAssociatedTokenAddress(
        token.ASSOCIATED_TOKEN_PROGRAM_ID,
        new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),

        new Web3.PublicKey(poolMint),
        publicKey,
        true
      );
      console.log(
        "The address for token B is  ",
        associatedTokenAccountB.toBase58()
      );
      let accountPoolUser = await connection.getAccountInfo(associatedTokenAccountB);
      if (accountPoolUser == null) {
        const transactionPoolUser =
          token.Token.createAssociatedTokenAccountInstruction(
            token.ASSOCIATED_TOKEN_PROGRAM_ID,
            token.TOKEN_PROGRAM_ID,
            new Web3.PublicKey(poolMint),
            associatedTokenAccountUser,
            publicKey,
            publicKey
          );
        transaction.add(transactionPoolUser);
      }
      let txid = await sendTransaction(transaction, connection);
      transaction=new Web3.Transaction();

    console.log("Processing ");

    // const tokenAccountA = await token.Token.getAssociatedTokenAddress(
    //   token.ASSOCIATED_TOKEN_PROGRAM_ID,
    //   token.TOKEN_PROGRAM_ID,
    //   new Web3.PublicKey(mintA),
    //   publicKey
    // );
    // const tokenAccountB = await token.Token.getAssociatedTokenAddress(
    //   token.ASSOCIATED_TOKEN_PROGRAM_ID,
    //   token.TOKEN_PROGRAM_ID,
    //   new Web3.PublicKey(mintB),
    //   publicKey
    // );

    console.log("Account if Token A is ", associatedTokenAccountA.toBase58());
     accountPool = await connection.getAccountInfo(associatedTokenAccountPool);
    const newTokenSwap = new TokenSwap(
      connection,
      tokenSwapAccount.publicKey,
      TOKEN_SWAP_PROGRAM_ID,
      new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      
      poolMint,
      new Web3.PublicKey("Bo9tmnnyJjEMLAo17n1NbWoGK3tz1UD7WzmXEEFanYim"),
      authority,
      associatedTokenAccountA,
      associatedTokenAccountB,
      new Web3.PublicKey(mintA),
      new Web3.PublicKey(mintB),
      new Numberu64(TRADING_FEE_NUMERATOR),
      new Numberu64(TRADING_FEE_DENOMINATOR),
      new Numberu64(OWNER_TRADING_FEE_NUMERATOR),
      new Numberu64(OWNER_TRADING_FEE_DENOMINATOR),
      new Numberu64(OWNER_WITHDRAW_FEE_NUMERATOR),
      new Numberu64(OWNER_WITHDRAW_FEE_DENOMINATOR),
      new Numberu64(HOST_FEE_NUMERATOR),
      new Numberu64(HOST_FEE_DENOMINATOR),
      1,
      publicKey
    );

    const balanceNeeded = await TokenSwap.getMinBalanceRentForExemptTokenSwap(
      connection
    );
    transaction.add(
      Web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: tokenSwapAccount.publicKey,
        lamports: balanceNeeded,
        space: TokenSwapLayout.span,
        programId: TOKEN_SWAP_PROGRAM_ID,
      })
    );

    const confirmOptions = {
      skipPreflight: true
    };
        const instruction = TokenSwap.createInitSwapInstruction(
      tokenSwapAccount,
      authority,
      associatedTokenAccountA,
      associatedTokenAccountB,
      poolMint,
      new Web3.PublicKey("Bo9tmnnyJjEMLAo17n1NbWoGK3tz1UD7WzmXEEFanYim"),
      associatedTokenAccountPool,
      new Web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      TOKEN_SWAP_PROGRAM_ID,
      TRADING_FEE_NUMERATOR,
      TRADING_FEE_DENOMINATOR,
      OWNER_TRADING_FEE_NUMERATOR,
      OWNER_TRADING_FEE_DENOMINATOR,
      OWNER_WITHDRAW_FEE_NUMERATOR,
      OWNER_WITHDRAW_FEE_DENOMINATOR,
      HOST_FEE_NUMERATOR,
      HOST_FEE_DENOMINATOR,
      1,
      new Numberu64(1)
    );

      // transaction.add(instruction);

     transaction.add(instruction);
    try {
      const signers = {
        signers: [tokenSwapAccount],

      }
      Web3.sendAndConfirmTransaction
        let txid =   await sendTransaction(transaction, connection,signers);  
      // await Web3.sendAndConfirmTransaction(connection,transaction,[tokenSwapAccount])
        //sendTransaction(transaction, connection,signers);
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
    } catch (e) {
      console.log(JSON.stringify(e))
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
          <FormLabel color="gray.200"> Mint Address of Tokens</FormLabel>

          {/* <FormLabel color="gray.200">Mint Token A </FormLabel> */}
          <Input
            placeholder="Mint Address of Token A"
            size="lg"
            onChange={(event) => setMintA(event.target.value)}
          />
          <Input
            placeholder="Mint Address of Token B"
            size="lg"
            onChange={(event) => setMintB(event.target.value)}
          />

          <NumberInput
            min={1}
            onChange={(valueString) => setAmount(parseInt(valueString))}
          >
            <NumberInputField id="amount" color="gray.400" />
          </NumberInput>
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Create Pool
        </Button>
      </form>
    </Box>
  );
};
