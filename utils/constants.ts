import * as Web3 from "@solana/web3.js"

export const tokenSwapStateAccount = new Web3.PublicKey(
    "TSAm8mcZYDUiKgkwc9BomrqZG4HPFQnRst42YEoVkgN" // state account
)

export const swapAuthority = new Web3.PublicKey(
    "HWzvarxVbLSmWfdgrvC9JwCTZUm9eNfuWJF2V6irzMNq" // Swap authority 
)

export const poolKryptAccount = new Web3.PublicKey( // account pool  Swipe 
    "82MgziLkzUQw2X1aefV9TrfJnS2dLAcKi9C3USNcQvmA"
)

export const poolScroogeAccount = new Web3.PublicKey( // account pool muto 
    "6R85N6PY2X94zKZ2JxCSTF4ttRDKEZbKx7g9mw56sAjU"
)

export const poolMint = new Web3.PublicKey(
    "3vVQjmFGZpJLpMBfCHMJd8F89fzFMbJLqZ6zjJdG3Kv2"   // pool mint 
)

export const tokenAccountPool = new Web3.PublicKey(
    "7dh8ffutXRZxMvyD6LDZsSCuDfSGxTASfreqUDdeH5Lr"     // pool a lp ccout 
)

export const feeAccount = new Web3.PublicKey(
    "EY4hgx73saq9xuLr85HNaxGMAK6R5TkvuSDchKbpt291"
)

export const kryptMint = new Web3.PublicKey(    // swipe
    "97XEBow8d9otSkNM3SuyKJ5cFaDD6f7u8XVoLxU48bMG"
)

export const ScroogeCoinMint = new Web3.PublicKey(  // muto 
    "umPEWipi6y9gwM67BJ21SYQAseX2oLyfknwZH7oDTGs"
)

export const airdropProgramId = new Web3.PublicKey(
    "CPEV4ibq2VUv7UnNpkzUGL82VRzotbv2dy8vGwRfh3H3"
)

export const airdropPDA = new Web3.PublicKey(
    "99ynLfSvcRXwYMKv4kmbcAyGxhfD7KfgrsuHTx9Dvoot"
)

export const TOKEN_SWAP_PROGRAM_ID = new Web3.PublicKey(
    "3LB4DBcbCtMjJn2geDBzGidbpEgG9Z4785tRSAfNeedP"              // program 
)

export const ASSOCIATED_TOKEN_PROGRAM_ID = new Web3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
)
