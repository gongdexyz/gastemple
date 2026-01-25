import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';
import type { PhantomProvider } from '../types/phantom';

// Constants
export const DEVNET_RPC_ENDPOINT = 'https://api.devnet.solana.com';
export const BURN_ADDRESS = '1nc1nerator11111111111111111111111111111111';

// Test SPL token mint address on Devnet
// This is a well-known test token mint that can be used for testing
// In production, you would create your own token mint
export const TEST_TOKEN_MINT = new PublicKey('So11111111111111111111111111111111111111112');

// Wallet state interface
export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
}

/**
 * Solana Service for Devnet interactions
 * Handles wallet connection and blockchain operations on Solana Devnet
 */
class SolanaService {
  private connection: Connection;
  private walletState: WalletState;

  constructor() {
    // Initialize connection to Solana Devnet
    this.connection = new Connection(DEVNET_RPC_ENDPOINT, 'confirmed');
    
    // Initialize wallet state
    this.walletState = {
      connected: false,
      publicKey: null,
    };
  }

  /**
   * Get the current Solana connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get the current wallet state
   */
  getWalletState(): WalletState {
    return { ...this.walletState };
  }

  /**
   * Check if Phantom wallet is installed
   */
  isPhantomInstalled(): boolean {
    return typeof window !== 'undefined' && window.solana?.isPhantom === true;
  }

  /**
   * Connect to Phantom wallet
   * @returns Promise<PublicKey> - The connected wallet's public key
   * @throws Error if wallet is not installed or connection fails
   */
  async connectWallet(): Promise<PublicKey> {
    // Check if Phantom is installed
    if (!this.isPhantomInstalled()) {
      throw new Error('Please install Phantom wallet');
    }

    try {
      const provider = window.solana!;
      
      // Request connection to wallet
      const response = await provider.connect();
      const publicKey = response.publicKey;

      // Verify connection is working
      await this.connection.getGenesisHash();
      
      // Update wallet state
      this.walletState = {
        connected: true,
        publicKey: publicKey,
      };

      // Set up disconnect listener
      provider.on('disconnect', () => {
        this.walletState = {
          connected: false,
          publicKey: null,
        };
      });

      return publicKey;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          throw new Error('Wallet connection rejected');
        }
        throw error;
      }
      throw new Error('Failed to connect wallet');
    }
  }

  /**
   * Disconnect from Phantom wallet
   */
  async disconnectWallet(): Promise<void> {
    if (this.isPhantomInstalled() && window.solana) {
      try {
        await window.solana.disconnect();
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    }
    
    this.walletState = {
      connected: false,
      publicKey: null,
    };
  }

  /**
   * Get the burn address as a PublicKey
   */
  getBurnAddress(): PublicKey {
    return new PublicKey(BURN_ADDRESS);
  }

  /**
   * Get or create an associated token account for a wallet
   * @param walletAddress - The wallet's public key
   * @param tokenMint - The token mint address (defaults to TEST_TOKEN_MINT)
   * @returns Promise<PublicKey> - The associated token account address
   * @throws Error if account creation fails
   */
  async getOrCreateAssociatedTokenAccount(
    walletAddress: PublicKey,
    tokenMint: PublicKey = TEST_TOKEN_MINT
  ): Promise<PublicKey> {
    try {
      // Get the associated token address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        walletAddress
      );

      // Check if the account exists
      const accountInfo = await this.connection.getAccountInfo(associatedTokenAddress);

      if (accountInfo === null) {
        // Account doesn't exist, need to create it
        if (!this.isPhantomInstalled() || !window.solana) {
          throw new Error('Wallet not connected');
        }

        // Create the instruction to create the associated token account
        const instruction = createAssociatedTokenAccountInstruction(
          walletAddress, // payer
          associatedTokenAddress, // associated token account address
          walletAddress, // owner
          tokenMint // token mint
        );

        // Create transaction with the instruction
        const { Transaction } = await import('@solana/web3.js');
        const transaction = new Transaction().add(instruction);

        // Get recent blockhash
        const { blockhash } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = walletAddress;

        // Sign and send transaction
        const signedTransaction = await window.solana.signTransaction(transaction);
        const signature = await this.connection.sendRawTransaction(
          signedTransaction.serialize()
        );

        // Wait for confirmation
        await this.connection.confirmTransaction(signature, 'confirmed');
      }

      return associatedTokenAddress;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get or create token account: ${error.message}`);
      }
      throw new Error('Failed to get or create token account');
    }
  }

  /**
   * Get the token balance for a wallet address
   * @param walletAddress - The wallet's public key
   * @param tokenMint - The token mint address (defaults to TEST_TOKEN_MINT)
   * @returns Promise<number> - The token balance
   * @throws Error if balance query fails
   */
  async getTokenBalance(
    walletAddress: PublicKey,
    tokenMint: PublicKey = TEST_TOKEN_MINT
  ): Promise<number> {
    try {
      // Get the associated token address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        walletAddress
      );

      // Query the token account balance
      const accountInfo = await this.connection.getAccountInfo(associatedTokenAddress);

      // If account doesn't exist, balance is 0
      if (accountInfo === null) {
        return 0;
      }

      // Parse the token account data to get balance
      const { getAccount } = await import('@solana/spl-token');
      const tokenAccount = await getAccount(
        this.connection,
        associatedTokenAddress
      );

      // Return balance as number (convert from bigint)
      return Number(tokenAccount.amount);
    } catch (error) {
      if (error instanceof Error) {
        // If the error is about account not found, return 0
        if (error.message.includes('could not find account') || 
            error.message.includes('TokenAccountNotFound')) {
          return 0;
        }
        throw new Error(`Failed to get token balance: ${error.message}`);
      }
      throw new Error('Failed to get token balance');
    }
  }

  /**
   * Mint test tokens to a wallet address on Devnet
   * For Devnet testing, this uses SOL airdrop to provide test tokens
   * @param walletAddress - The wallet's public key to receive tokens
   * @param amount - Amount of SOL to airdrop (in lamports, 1 SOL = 1,000,000,000 lamports)
   * @returns Promise<string> - The transaction signature
   * @throws Error if minting fails
   */
  async mintTestTokens(
    walletAddress: PublicKey,
    amount: number = 1_000_000_000 // Default 1 SOL
  ): Promise<string> {
    try {
      // Validate wallet address
      if (!walletAddress) {
        throw new Error('Wallet address is required');
      }

      // Validate amount
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      // Request airdrop from Devnet faucet
      // This is the standard way to get test tokens on Devnet
      const signature = await this.connection.requestAirdrop(
        walletAddress,
        amount
      );

      // Wait for confirmation with 'confirmed' commitment level
      const latestBlockhash = await this.connection.getLatestBlockhash();
      await this.connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      return signature;
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes('airdrop request failed')) {
          throw new Error('Airdrop request failed. Devnet faucet may be rate limited. Please try again later.');
        }
        if (error.message.includes('Invalid param')) {
          throw new Error('Invalid wallet address or amount');
        }
        throw new Error(`Failed to mint test tokens: ${error.message}`);
      }
      throw new Error('Failed to mint test tokens');
    }
  }

  /**
   * Burn tokens by sending them to the incinerator address
   * @param amount - Amount of tokens to burn (in lamports)
   * @param tokenMint - The token mint address (defaults to TEST_TOKEN_MINT)
   * @param walletAddress - The wallet's public key
   * @returns Promise<string> - The transaction signature
   * @throws Error if burning fails
   */
  async burnTokens(
    amount: number,
    tokenMint: PublicKey = TEST_TOKEN_MINT,
    walletAddress: PublicKey
  ): Promise<string> {
    try {
      // Validate inputs
      if (!walletAddress) {
        throw new Error('Wallet address is required');
      }

      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      // Check if wallet is connected
      if (!this.isPhantomInstalled() || !window.solana) {
        throw new Error('Wallet not connected');
      }

      // Check balance before creating transaction
      const balance = await this.getTokenBalance(walletAddress, tokenMint);
      
      if (balance < amount) {
        throw new Error('Insufficient token balance');
      }

      // Get the source token account (user's token account)
      const sourceTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        walletAddress
      );

      // Get the burn address as PublicKey
      const burnAddressKey = this.getBurnAddress();

      // Get or create the destination token account (burn address token account)
      const destinationTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        burnAddressKey
      );

      // Create transfer instruction to burn address
      const transferInstruction = createTransferInstruction(
        sourceTokenAccount,      // source
        destinationTokenAccount, // destination
        walletAddress,           // owner of source account
        amount                   // amount to transfer
      );

      // Create transaction with the transfer instruction
      const transaction = new Transaction().add(transferInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletAddress;

      // Sign transaction with Phantom wallet
      const signedTransaction = await window.solana.signTransaction(transaction);

      // Submit transaction to the network
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Wait for confirmation
      const latestBlockhash = await this.connection.getLatestBlockhash();
      await this.connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      return signature;
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes('User rejected')) {
          throw new Error('Transaction rejected by wallet');
        }
        if (error.message.includes('Insufficient token balance')) {
          throw error; // Re-throw our own error message
        }
        if (error.message.includes('Insufficient funds')) {
          throw new Error('Insufficient token balance');
        }
        if (error.message.includes('TokenAccountNotFound')) {
          throw new Error('Token account not found. Get test tokens first.');
        }
        throw new Error(`Failed to burn tokens: ${error.message}`);
      }
      throw new Error('Failed to burn tokens');
    }
  }
}

// Export singleton instance
export const solanaService = new SolanaService();

// Export class for testing
export default SolanaService;
