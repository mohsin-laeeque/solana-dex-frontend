import type {Connection} from '@solana/web3.js';
import {PublicKey} from '@solana/web3.js';

export async function loadAccount(
  connection: Connection,
  address: PublicKey,
  programId: PublicKey,
): Promise<Buffer> {
  const accountInfo = await connection.getAccountInfo(address);
  console.log("Account info is ,",accountInfo?.owner.toBase58());
  console.log("ProgramId is ",programId.toBase58());
  if (accountInfo === null) {
    throw new Error('Failed to find account');
  }

  if (!accountInfo.owner.equals(programId)) {
   // throw new Error(`Invalid owner: ${JSON.stringify(accountInfo.owner)}`);
  }

  return Buffer.from(accountInfo.data);
}
