import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import SolanaService, { DEVNET_RPC_ENDPOINT, BURN_ADDRESS, TEST_TOKEN_MINT } from './solanaService';
import type { PhantomProvider } from '../types/phantom';

// Mock the Connection class
vi.mock('@solana/web3.js', async () => {
  const actual = await vi.importActual('@solana/web3.js');
  return {
    ...actual,
    Connection: class MockConnection {
      rpcEndpoint: string;
      constructor(endpoint: string) {
        this.rpcEndpoint = endpoint;
      }
      getGenesisHash = vi.fn().mockResolvedValue('EtWTRABZaYq6iMfeYKouRu166VU2xqa1');
      getAccountInfo = vi.fn();
      getLatestBlockhash = vi.fn();
      sendRawTransaction = vi.fn();
      confirmTransaction = vi.fn();
      requestAirdrop = vi.fn();
    },
  };
});

// Mock SPL token functions
vi.mock('@solana/spl-token', () => {
  return {
    getAssociatedTokenAddress: vi.fn().mockImplementation(async () => {
      // Return a valid mock token account address
      const { PublicKey } = await import('@solana/web3.js');
      return new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    }),
    createAssociatedTokenAccountInstruction: vi.fn().mockImplementation(() => {
      return {
        keys: [],
        programId: {},
        data: Buffer.from([]),
      };
    }),
    createTransferInstruction: vi.fn().mockImplementation(() => {
      return {
        keys: [],
        programId: {},
        data: Buffer.from([]),
      };
    }),
    getAccount: vi.fn(),
  };
});

describe('SolanaService - Wallet Connection Tests', () => {
  let service: SolanaService;
  let mockPhantomProvider: Partial<PhantomProvider>;

  beforeEach(() => {
    // Create a new service instance for each test
    service = new SolanaService();

    // Create mock Phantom provider
    mockPhantomProvider = {
      isPhantom: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      on: vi.fn(),
      publicKey: null,
    };

    // Clear any existing window.solana
    delete (window as any).solana;
  });

  describe('Initialization', () => {
    it('should initialize with Devnet RPC endpoint', () => {
      const connection = service.getConnection();
      expect(connection).toBeDefined();
      // Verify the connection is using the correct endpoint
      expect(connection.rpcEndpoint).toBe(DEVNET_RPC_ENDPOINT);
    });

    it('should initialize with disconnected wallet state', () => {
      const walletState = service.getWalletState();
      expect(walletState.connected).toBe(false);
      expect(walletState.publicKey).toBeNull();
    });

    it('should define burn address constant correctly', () => {
      expect(BURN_ADDRESS).toBe('1nc1nerator11111111111111111111111111111111');
      const burnAddressKey = service.getBurnAddress();
      expect(burnAddressKey).toBeInstanceOf(PublicKey);
      expect(burnAddressKey.toBase58()).toBe(BURN_ADDRESS);
    });
  });

  describe('Phantom Wallet Detection', () => {
    it('should detect when Phantom wallet is not installed', () => {
      // window.solana is undefined
      expect(service.isPhantomInstalled()).toBe(false);
    });

    it('should detect when Phantom wallet is installed', () => {
      // Set up window.solana with isPhantom flag
      (window as any).solana = mockPhantomProvider;
      expect(service.isPhantomInstalled()).toBe(true);
    });

    it('should return false when window.solana exists but isPhantom is false', () => {
      (window as any).solana = { isPhantom: false };
      expect(service.isPhantomInstalled()).toBe(false);
    });
  });

  describe('Wallet Connection - Success Cases', () => {
    it('should successfully connect to Phantom wallet', async () => {
      // Create a mock public key
      const mockPublicKey = new PublicKey('11111111111111111111111111111111');
      
      // Set up mock provider
      mockPhantomProvider.connect = vi.fn().mockResolvedValue({
        publicKey: mockPublicKey,
      });
      
      (window as any).solana = mockPhantomProvider;

      // Connect wallet
      const publicKey = await service.connectWallet();

      // Verify connection was called
      expect(mockPhantomProvider.connect).toHaveBeenCalled();
      
      // Verify returned public key
      expect(publicKey).toBe(mockPublicKey);
      
      // Verify wallet state was updated
      const walletState = service.getWalletState();
      expect(walletState.connected).toBe(true);
      expect(walletState.publicKey).toBe(mockPublicKey);
    });

    it('should set up disconnect listener on successful connection', async () => {
      const mockPublicKey = new PublicKey('11111111111111111111111111111111');
      
      mockPhantomProvider.connect = vi.fn().mockResolvedValue({
        publicKey: mockPublicKey,
      });
      
      (window as any).solana = mockPhantomProvider;

      await service.connectWallet();

      // Verify disconnect listener was set up
      expect(mockPhantomProvider.on).toHaveBeenCalledWith(
        'disconnect',
        expect.any(Function)
      );
    });
  });

  describe('Wallet Connection - Error Cases', () => {
    it('should throw error when Phantom wallet is not installed', async () => {
      // window.solana is undefined
      await expect(service.connectWallet()).rejects.toThrow(
        'Please install Phantom wallet'
      );
    });

    it('should throw error when wallet connection is rejected', async () => {
      mockPhantomProvider.connect = vi.fn().mockRejectedValue(
        new Error('User rejected the request')
      );
      
      (window as any).solana = mockPhantomProvider;

      await expect(service.connectWallet()).rejects.toThrow(
        'Wallet connection rejected'
      );
    });

    it('should throw generic error for other connection failures', async () => {
      const errorMessage = 'Network error';
      mockPhantomProvider.connect = vi.fn().mockRejectedValue(
        new Error(errorMessage)
      );
      
      (window as any).solana = mockPhantomProvider;

      await expect(service.connectWallet()).rejects.toThrow(errorMessage);
    });

    it('should handle non-Error exceptions during connection', async () => {
      mockPhantomProvider.connect = vi.fn().mockRejectedValue('String error');
      
      (window as any).solana = mockPhantomProvider;

      await expect(service.connectWallet()).rejects.toThrow(
        'Failed to connect wallet'
      );
    });
  });

  describe('Wallet Disconnection', () => {
    it('should disconnect wallet and reset state', async () => {
      // First connect
      const mockPublicKey = new PublicKey('11111111111111111111111111111111');
      mockPhantomProvider.connect = vi.fn().mockResolvedValue({
        publicKey: mockPublicKey,
      });
      
      (window as any).solana = mockPhantomProvider;
      await service.connectWallet();

      // Verify connected
      expect(service.getWalletState().connected).toBe(true);

      // Now disconnect
      await service.disconnectWallet();

      // Verify disconnect was called
      expect(mockPhantomProvider.disconnect).toHaveBeenCalled();

      // Verify state was reset
      const walletState = service.getWalletState();
      expect(walletState.connected).toBe(false);
      expect(walletState.publicKey).toBeNull();
    });

    it('should handle disconnect when wallet is not installed', async () => {
      // No window.solana
      await expect(service.disconnectWallet()).resolves.not.toThrow();
      
      // Verify state is reset
      const walletState = service.getWalletState();
      expect(walletState.connected).toBe(false);
      expect(walletState.publicKey).toBeNull();
    });

    it('should handle disconnect errors gracefully', async () => {
      mockPhantomProvider.disconnect = vi.fn().mockRejectedValue(
        new Error('Disconnect failed')
      );
      
      (window as any).solana = mockPhantomProvider;

      // Should not throw
      await expect(service.disconnectWallet()).resolves.not.toThrow();
      
      // State should still be reset
      const walletState = service.getWalletState();
      expect(walletState.connected).toBe(false);
      expect(walletState.publicKey).toBeNull();
    });
  });

  describe('Wallet State Management', () => {
    it('should return a copy of wallet state, not the original', () => {
      const state1 = service.getWalletState();
      const state2 = service.getWalletState();
      
      // Should be equal but not the same object
      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2);
    });
  });

  describe('Burn Address', () => {
    it('should return valid burn address PublicKey', () => {
      const burnAddress = service.getBurnAddress();
      expect(burnAddress).toBeInstanceOf(PublicKey);
      expect(burnAddress.toBase58()).toBe(BURN_ADDRESS);
    });

    it('should return the same burn address on multiple calls', () => {
      const burnAddress1 = service.getBurnAddress();
      const burnAddress2 = service.getBurnAddress();
      expect(burnAddress1.equals(burnAddress2)).toBe(true);
    });
  });

  describe('Test Token Mint', () => {
    it('should define TEST_TOKEN_MINT constant', () => {
      expect(TEST_TOKEN_MINT).toBeDefined();
      expect(TEST_TOKEN_MINT).toBeInstanceOf(PublicKey);
    });

    it('should have a valid TEST_TOKEN_MINT address', () => {
      // Verify it's a valid base58 string
      const base58 = TEST_TOKEN_MINT.toBase58();
      expect(base58).toBeTruthy();
      expect(base58.length).toBeGreaterThan(0);
    });
  });

  describe('Get or Create Associated Token Account', () => {
    let mockWalletAddress: PublicKey;

    beforeEach(() => {
      mockWalletAddress = new PublicKey('11111111111111111111111111111111');
    });

    it('should return existing associated token account address', async () => {
      // Mock getAccountInfo to return an existing account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      const tokenAccount = await service.getOrCreateAssociatedTokenAccount(mockWalletAddress);

      expect(tokenAccount).toBeInstanceOf(PublicKey);
      expect(service.getConnection().getAccountInfo).toHaveBeenCalled();
    });

    it('should create associated token account if it does not exist', async () => {
      // Mock getAccountInfo to return null (account doesn't exist)
      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(null);

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue({
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      });

      // Mock sendRawTransaction
      service.getConnection().sendRawTransaction = vi.fn().mockResolvedValue('mockSignature');

      // Mock confirmTransaction
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      // Set up mock Phantom provider with a proper transaction mock
      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);

      (window as any).solana = mockPhantomProvider;

      const tokenAccount = await service.getOrCreateAssociatedTokenAccount(mockWalletAddress);

      expect(tokenAccount).toBeInstanceOf(PublicKey);
      expect(service.getConnection().getAccountInfo).toHaveBeenCalled();
      expect(mockPhantomProvider.signTransaction).toHaveBeenCalled();
      expect(service.getConnection().sendRawTransaction).toHaveBeenCalled();
      expect(service.getConnection().confirmTransaction).toHaveBeenCalled();
    });

    it('should throw error if wallet is not connected when creating account', async () => {
      // Mock getAccountInfo to return null (account doesn't exist)
      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(null);

      // No window.solana
      delete (window as any).solana;

      await expect(
        service.getOrCreateAssociatedTokenAccount(mockWalletAddress)
      ).rejects.toThrow('Wallet not connected');
    });

    it('should use custom token mint if provided', async () => {
      // Use a valid base58 public key
      const customMint = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

      // Mock getAccountInfo to return an existing account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      const tokenAccount = await service.getOrCreateAssociatedTokenAccount(
        mockWalletAddress,
        customMint
      );

      expect(tokenAccount).toBeInstanceOf(PublicKey);
    });

    it('should handle errors during account creation', async () => {
      // Mock getAccountInfo to return null (account doesn't exist)
      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(null);

      // Mock getLatestBlockhash to throw error
      service.getConnection().getLatestBlockhash = vi.fn().mockRejectedValue(
        new Error('Network error')
      );

      mockPhantomProvider.signTransaction = vi.fn();
      (window as any).solana = mockPhantomProvider;

      await expect(
        service.getOrCreateAssociatedTokenAccount(mockWalletAddress)
      ).rejects.toThrow('Failed to get or create token account');
    });
  });

  describe('Mint Test Tokens', () => {
    let mockWalletAddress: PublicKey;

    beforeEach(() => {
      mockWalletAddress = new PublicKey('11111111111111111111111111111111');
    });

    it('should successfully mint test tokens via airdrop', async () => {
      const mockSignature = 'mockAirdropSignature123';
      const mockBlockhash = {
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      };

      // Mock requestAirdrop
      service.getConnection().requestAirdrop = vi.fn().mockResolvedValue(mockSignature);

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue(mockBlockhash);

      // Mock confirmTransaction
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      const signature = await service.mintTestTokens(mockWalletAddress, 1_000_000_000);

      expect(signature).toBe(mockSignature);
      expect(service.getConnection().requestAirdrop).toHaveBeenCalledWith(
        mockWalletAddress,
        1_000_000_000
      );
      expect(service.getConnection().confirmTransaction).toHaveBeenCalled();
    });

    it('should use default amount of 1 SOL if not specified', async () => {
      const mockSignature = 'mockAirdropSignature123';
      const mockBlockhash = {
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      };

      service.getConnection().requestAirdrop = vi.fn().mockResolvedValue(mockSignature);
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue(mockBlockhash);
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      await service.mintTestTokens(mockWalletAddress);

      // Should use default 1 SOL (1_000_000_000 lamports)
      expect(service.getConnection().requestAirdrop).toHaveBeenCalledWith(
        mockWalletAddress,
        1_000_000_000
      );
    });

    it('should throw error for invalid wallet address', async () => {
      await expect(
        service.mintTestTokens(null as any)
      ).rejects.toThrow('Wallet address is required');
    });

    it('should throw error for zero or negative amount', async () => {
      await expect(
        service.mintTestTokens(mockWalletAddress, 0)
      ).rejects.toThrow('Amount must be greater than zero');

      await expect(
        service.mintTestTokens(mockWalletAddress, -100)
      ).rejects.toThrow('Amount must be greater than zero');
    });

    it('should handle airdrop request failure with rate limit message', async () => {
      service.getConnection().requestAirdrop = vi.fn().mockRejectedValue(
        new Error('airdrop request failed')
      );

      await expect(
        service.mintTestTokens(mockWalletAddress, 1_000_000_000)
      ).rejects.toThrow('Airdrop request failed. Devnet faucet may be rate limited. Please try again later.');
    });

    it('should handle invalid parameter errors', async () => {
      service.getConnection().requestAirdrop = vi.fn().mockRejectedValue(
        new Error('Invalid param: amount')
      );

      await expect(
        service.mintTestTokens(mockWalletAddress, 1_000_000_000)
      ).rejects.toThrow('Invalid wallet address or amount');
    });

    it('should handle generic minting errors', async () => {
      const errorMessage = 'Network connection failed';
      service.getConnection().requestAirdrop = vi.fn().mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        service.mintTestTokens(mockWalletAddress, 1_000_000_000)
      ).rejects.toThrow(`Failed to mint test tokens: ${errorMessage}`);
    });

    it('should handle non-Error exceptions during minting', async () => {
      service.getConnection().requestAirdrop = vi.fn().mockRejectedValue('String error');

      await expect(
        service.mintTestTokens(mockWalletAddress, 1_000_000_000)
      ).rejects.toThrow('Failed to mint test tokens');
    });

    it('should wait for transaction confirmation', async () => {
      const mockSignature = 'mockAirdropSignature123';
      const mockBlockhash = {
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      };

      service.getConnection().requestAirdrop = vi.fn().mockResolvedValue(mockSignature);
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue(mockBlockhash);
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      await service.mintTestTokens(mockWalletAddress, 1_000_000_000);

      // Verify confirmTransaction was called with correct parameters
      expect(service.getConnection().confirmTransaction).toHaveBeenCalledWith({
        signature: mockSignature,
        blockhash: mockBlockhash.blockhash,
        lastValidBlockHeight: mockBlockhash.lastValidBlockHeight,
      });
    });
  });

  describe('Get Token Balance', () => {
    let mockWalletAddress: PublicKey;

    beforeEach(() => {
      mockWalletAddress = new PublicKey('11111111111111111111111111111111');
    });

    it('should return token balance for existing account', async () => {
      const mockBalance = 1000000n; // Use bigint for token amount
      
      // Mock getAccountInfo to return an existing account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      // Mock getAccount to return token account with balance
      const { getAccount } = await import('@solana/spl-token');
      (getAccount as any).mockResolvedValue({
        amount: mockBalance,
        mint: TEST_TOKEN_MINT,
        owner: mockWalletAddress,
      });

      const balance = await service.getTokenBalance(mockWalletAddress);

      expect(balance).toBe(Number(mockBalance));
      expect(service.getConnection().getAccountInfo).toHaveBeenCalled();
      expect(getAccount).toHaveBeenCalled();
    });

    it('should return 0 for non-existent token account', async () => {
      // Mock getAccountInfo to return null (account doesn't exist)
      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(null);

      const balance = await service.getTokenBalance(mockWalletAddress);

      expect(balance).toBe(0);
      expect(service.getConnection().getAccountInfo).toHaveBeenCalled();
    });

    it('should return 0 when account not found error occurs', async () => {
      // Mock getAccountInfo to return an account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      // Mock getAccount to throw "could not find account" error
      const { getAccount } = await import('@solana/spl-token');
      (getAccount as any).mockRejectedValue(new Error('could not find account'));

      const balance = await service.getTokenBalance(mockWalletAddress);

      expect(balance).toBe(0);
    });

    it('should return 0 when TokenAccountNotFound error occurs', async () => {
      // Mock getAccountInfo to return an account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      // Mock getAccount to throw TokenAccountNotFound error
      const { getAccount } = await import('@solana/spl-token');
      (getAccount as any).mockRejectedValue(new Error('TokenAccountNotFound'));

      const balance = await service.getTokenBalance(mockWalletAddress);

      expect(balance).toBe(0);
    });

    it('should use custom token mint if provided', async () => {
      const customMint = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      const mockBalance = 5000000n;

      // Mock getAccountInfo to return an existing account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      // Mock getAccount to return token account with balance
      const { getAccount } = await import('@solana/spl-token');
      (getAccount as any).mockResolvedValue({
        amount: mockBalance,
        mint: customMint,
        owner: mockWalletAddress,
      });

      const balance = await service.getTokenBalance(mockWalletAddress, customMint);

      expect(balance).toBe(Number(mockBalance));
    });

    it('should handle errors during balance query', async () => {
      // Mock getAccountInfo to return an account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      // Mock getAccount to throw a generic error
      const { getAccount } = await import('@solana/spl-token');
      (getAccount as any).mockRejectedValue(new Error('Network error'));

      await expect(
        service.getTokenBalance(mockWalletAddress)
      ).rejects.toThrow('Failed to get token balance: Network error');
    });

    it('should handle non-Error exceptions during balance query', async () => {
      // Mock getAccountInfo to return an account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      // Mock getAccount to throw a non-Error exception
      const { getAccount } = await import('@solana/spl-token');
      (getAccount as any).mockRejectedValue('String error');

      await expect(
        service.getTokenBalance(mockWalletAddress)
      ).rejects.toThrow('Failed to get token balance');
    });

    it('should convert bigint balance to number correctly', async () => {
      const mockBalance = 123456789n;

      // Mock getAccountInfo to return an existing account
      const mockAccountInfo = {
        data: Buffer.from([]),
        executable: false,
        lamports: 1000000,
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      };

      service.getConnection().getAccountInfo = vi.fn().mockResolvedValue(mockAccountInfo);

      // Mock getAccount to return token account with balance
      const { getAccount } = await import('@solana/spl-token');
      (getAccount as any).mockResolvedValue({
        amount: mockBalance,
        mint: TEST_TOKEN_MINT,
        owner: mockWalletAddress,
      });

      const balance = await service.getTokenBalance(mockWalletAddress);

      expect(balance).toBe(123456789);
      expect(typeof balance).toBe('number');
    });
  });
});

describe('SolanaService - Token Burning Tests', () => {
  let service: SolanaService;
  let mockPhantomProvider: Partial<PhantomProvider>;
  let mockWalletAddress: PublicKey;

  beforeEach(() => {
    service = new SolanaService();
    mockWalletAddress = new PublicKey('11111111111111111111111111111111');

    // Create mock Phantom provider
    mockPhantomProvider = {
      isPhantom: true,
      signTransaction: vi.fn(),
    };

    // Clear any existing window.solana
    delete (window as any).solana;
  });

  describe('Burn Tokens - Success Cases', () => {
    it('should successfully burn tokens by transferring to burn address', async () => {
      const burnAmount = 1000000;
      const mockSignature = 'mockBurnSignature123';
      const mockBlockhash = {
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      };

      // Mock getTokenBalance to return sufficient balance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue(mockBlockhash);

      // Mock sendRawTransaction
      service.getConnection().sendRawTransaction = vi.fn().mockResolvedValue(mockSignature);

      // Mock confirmTransaction
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      // Set up mock Phantom provider with transaction signing
      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);
      (window as any).solana = mockPhantomProvider;

      const signature = await service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress);

      expect(signature).toBe(mockSignature);
      expect(service.getTokenBalance).toHaveBeenCalledWith(mockWalletAddress, TEST_TOKEN_MINT);
      expect(mockPhantomProvider.signTransaction).toHaveBeenCalled();
      expect(service.getConnection().sendRawTransaction).toHaveBeenCalled();
      expect(service.getConnection().confirmTransaction).toHaveBeenCalled();
    });

    it('should check balance before creating transaction', async () => {
      const burnAmount = 1000000;
      const currentBalance = 2000000;

      // Mock getTokenBalance
      const getBalanceSpy = vi.spyOn(service, 'getTokenBalance').mockResolvedValue(currentBalance);

      // Mock other required functions
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue({
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      });

      service.getConnection().sendRawTransaction = vi.fn().mockResolvedValue('mockSignature');
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);
      (window as any).solana = mockPhantomProvider;

      await service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress);

      // Verify balance was checked with correct parameters
      expect(getBalanceSpy).toHaveBeenCalledWith(mockWalletAddress, TEST_TOKEN_MINT);
      expect(getBalanceSpy).toHaveBeenCalledBefore(mockPhantomProvider.signTransaction as any);
    });

    it('should create transfer instruction to burn address', async () => {
      const burnAmount = 1000000;

      // Mock getTokenBalance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue({
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      });

      // Mock sendRawTransaction
      service.getConnection().sendRawTransaction = vi.fn().mockResolvedValue('mockSignature');

      // Mock confirmTransaction
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);
      (window as any).solana = mockPhantomProvider;

      await service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress);

      // Verify transaction was created and signed
      expect(mockPhantomProvider.signTransaction).toHaveBeenCalled();
      
      // Get the transaction that was passed to signTransaction
      const signedTransaction = (mockPhantomProvider.signTransaction as any).mock.calls[0][0];
      expect(signedTransaction).toBeDefined();
      expect(signedTransaction.feePayer).toEqual(mockWalletAddress);
    });

    it('should wait for transaction confirmation', async () => {
      const burnAmount = 1000000;
      const mockSignature = 'mockBurnSignature123';
      const mockBlockhash = {
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      };

      // Mock getTokenBalance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue(mockBlockhash);

      // Mock sendRawTransaction
      service.getConnection().sendRawTransaction = vi.fn().mockResolvedValue(mockSignature);

      // Mock confirmTransaction
      const confirmSpy = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });
      service.getConnection().confirmTransaction = confirmSpy;

      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);
      (window as any).solana = mockPhantomProvider;

      await service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress);

      // Verify confirmTransaction was called with correct parameters
      expect(confirmSpy).toHaveBeenCalledWith({
        signature: mockSignature,
        blockhash: mockBlockhash.blockhash,
        lastValidBlockHeight: mockBlockhash.lastValidBlockHeight,
      });
    });

    it('should return transaction signature on success', async () => {
      const burnAmount = 1000000;
      const expectedSignature = 'expectedBurnSignature456';

      // Mock getTokenBalance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue({
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      });

      // Mock sendRawTransaction to return expected signature
      service.getConnection().sendRawTransaction = vi.fn().mockResolvedValue(expectedSignature);

      // Mock confirmTransaction
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);
      (window as any).solana = mockPhantomProvider;

      const signature = await service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress);

      expect(signature).toBe(expectedSignature);
    });
  });

  describe('Burn Tokens - Error Cases', () => {
    it('should throw error when wallet address is not provided', async () => {
      await expect(
        service.burnTokens(1000000, TEST_TOKEN_MINT, null as any)
      ).rejects.toThrow('Wallet address is required');
    });

    it('should throw error when amount is zero', async () => {
      await expect(
        service.burnTokens(0, TEST_TOKEN_MINT, mockWalletAddress)
      ).rejects.toThrow('Amount must be greater than zero');
    });

    it('should throw error when amount is negative', async () => {
      await expect(
        service.burnTokens(-1000, TEST_TOKEN_MINT, mockWalletAddress)
      ).rejects.toThrow('Amount must be greater than zero');
    });

    it('should throw error when wallet is not connected', async () => {
      // No window.solana
      delete (window as any).solana;

      await expect(
        service.burnTokens(1000000, TEST_TOKEN_MINT, mockWalletAddress)
      ).rejects.toThrow('Wallet not connected');
    });

    it('should throw error when balance is insufficient', async () => {
      const burnAmount = 1000000;
      const insufficientBalance = 500000;

      // Mock getTokenBalance to return insufficient balance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(insufficientBalance);

      (window as any).solana = mockPhantomProvider;

      await expect(
        service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress)
      ).rejects.toThrow('Insufficient token balance');

      // Verify balance was checked
      expect(service.getTokenBalance).toHaveBeenCalledWith(mockWalletAddress, TEST_TOKEN_MINT);
    });

    it('should throw error when user rejects transaction', async () => {
      const burnAmount = 1000000;

      // Mock getTokenBalance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Mock getLatestBlockhash (needed before signTransaction is called)
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue({
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      });

      // Mock signTransaction to reject
      mockPhantomProvider.signTransaction = vi.fn().mockRejectedValue(
        new Error('User rejected the request')
      );

      (window as any).solana = mockPhantomProvider;

      await expect(
        service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress)
      ).rejects.toThrow('Transaction rejected by wallet');
    });

    it('should throw error when token account is not found', async () => {
      const burnAmount = 1000000;

      // Mock getTokenBalance to throw TokenAccountNotFound error
      vi.spyOn(service, 'getTokenBalance').mockRejectedValue(
        new Error('TokenAccountNotFound')
      );

      (window as any).solana = mockPhantomProvider;

      await expect(
        service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress)
      ).rejects.toThrow('Token account not found. Get test tokens first.');
    });

    it('should handle network errors during transaction submission', async () => {
      const burnAmount = 1000000;

      // Mock getTokenBalance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue({
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      });

      // Mock sendRawTransaction to throw network error
      service.getConnection().sendRawTransaction = vi.fn().mockRejectedValue(
        new Error('Network connection failed')
      );

      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);
      (window as any).solana = mockPhantomProvider;

      await expect(
        service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress)
      ).rejects.toThrow('Failed to burn tokens: Network connection failed');
    });

    it('should handle non-Error exceptions during burn', async () => {
      const burnAmount = 1000000;

      // Mock getTokenBalance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Mock getLatestBlockhash to throw non-Error exception
      service.getConnection().getLatestBlockhash = vi.fn().mockRejectedValue('String error');

      (window as any).solana = mockPhantomProvider;

      await expect(
        service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress)
      ).rejects.toThrow('Failed to burn tokens');
    });
  });

  describe('Burn Tokens - Transaction Creation', () => {
    it('should use correct burn address constant', async () => {
      const burnAmount = 1000000;

      // Mock getTokenBalance
      vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Spy on getBurnAddress
      const getBurnAddressSpy = vi.spyOn(service, 'getBurnAddress');

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue({
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      });

      // Mock sendRawTransaction
      service.getConnection().sendRawTransaction = vi.fn().mockResolvedValue('mockSignature');

      // Mock confirmTransaction
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);
      (window as any).solana = mockPhantomProvider;

      await service.burnTokens(burnAmount, TEST_TOKEN_MINT, mockWalletAddress);

      // Verify burn address was retrieved
      expect(getBurnAddressSpy).toHaveBeenCalled();
      
      // Verify it returns the correct address
      const burnAddress = service.getBurnAddress();
      expect(burnAddress.toBase58()).toBe(BURN_ADDRESS);
    });

    it('should use custom token mint if provided', async () => {
      const burnAmount = 1000000;
      const customMint = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

      // Mock getTokenBalance
      const getBalanceSpy = vi.spyOn(service, 'getTokenBalance').mockResolvedValue(burnAmount * 2);

      // Mock getLatestBlockhash
      service.getConnection().getLatestBlockhash = vi.fn().mockResolvedValue({
        blockhash: 'mockBlockhash',
        lastValidBlockHeight: 123456,
      });

      // Mock sendRawTransaction
      service.getConnection().sendRawTransaction = vi.fn().mockResolvedValue('mockSignature');

      // Mock confirmTransaction
      service.getConnection().confirmTransaction = vi.fn().mockResolvedValue({
        context: { slot: 123 },
        value: { err: null },
      });

      const mockTransaction = {
        serialize: vi.fn().mockReturnValue(Buffer.from('mock transaction')),
        add: vi.fn().mockReturnThis(),
        recentBlockhash: '',
        feePayer: null,
      };

      mockPhantomProvider.signTransaction = vi.fn().mockResolvedValue(mockTransaction);
      (window as any).solana = mockPhantomProvider;

      await service.burnTokens(burnAmount, customMint, mockWalletAddress);

      // Verify balance was checked with custom mint
      expect(getBalanceSpy).toHaveBeenCalledWith(mockWalletAddress, customMint);
    });
  });
});
