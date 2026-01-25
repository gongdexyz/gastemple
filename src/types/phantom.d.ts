import { PublicKey, Transaction } from '@solana/web3.js';

/**
 * Phantom Wallet Provider Interface
 * Defines the structure of the Phantom wallet provider available on window.solana
 */
export interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  publicKey: PublicKey | null;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export {};
