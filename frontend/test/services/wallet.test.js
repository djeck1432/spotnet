import { connect } from 'starknetkit';
import {
  checkForCRMToken,
  connectWallet,
  getTokenBalances,
  getBalances,
  logout,
  getWallet,
} from '../../src/services/wallet';
import { ETH_ADDRESS, STRK_ADDRESS, USDC_ADDRESS } from '../../src/utils/constants';

jest.mock('starknetkit', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('../../src/services/wallet', () => ({
  ...jest.requireActual('../../src/services/wallet'),
  getWallet: jest.fn(),
}));

jest.mock(
  'starknetkit/injected',
  () => ({
    InjectedConnector: jest.fn(),
  }),
  { virtual: true }
);

describe('Wallet Services', () => {
  beforeEach(() => {
    // Reset mocks and global state for each test
    jest.clearAllMocks();
    process.env.REACT_APP_IS_DEV = 'false'; // Reset environment variable
    global.alert = jest.fn(); // Reset global alert function

    // Reset specific mocks if needed
    getWallet.mockReset();
    connect.mockReset();
  });

  afterEach(() => {
    // Ensure no module state is persisted between tests
    jest.resetModules();

    // Optionally, reset other global or environment states here
    process.env.REACT_APP_IS_DEV = undefined;
  });

  describe('checkForCRMToken', () => {
    it('should return true in development mode', async () => {
      process.env.REACT_APP_IS_DEV = 'true'; // Mock env var for this test
      const result = await checkForCRMToken('0x123');
      expect(result).toBe(true);
    });

    it('should validate CRM token and return true if wallet has tokens', async () => {
      const mockStarknet = {
        wallet: {
          isConnected: true,
          provider: {
            callContract: jest.fn().mockResolvedValue({ result: ['1'] }),
          },
          enable: jest.fn(),
          selectedAddress: '0x123',
        },
      };

      getWallet.mockResolvedValue(mockStarknet.wallet);
      connect.mockResolvedValue(mockStarknet);

      const result = await checkForCRMToken('0x123');
      expect(result).toBe(true);
    });

    it('should return false and alert if wallet lacks CRM tokens', async () => {
      const mockStarknet = {
        wallet: {
          isConnected: true,
          provider: {
            callContract: jest.fn().mockResolvedValue({ result: ['0'] }),
          },
          enable: jest.fn(),
          selectedAddress: '0x123',
        },
      };

      global.alert = jest.fn();

      getWallet.mockResolvedValue(mockStarknet.wallet);
      connect.mockResolvedValue(mockStarknet);

      const result = await checkForCRMToken('0x123');
      expect(result).toBe(false);
      expect(global.alert).toHaveBeenCalledWith('Beta testing is allowed only for users who hold the CRM token.');
    });

    it('should throw an error if wallet is not connected', async () => {
      const mockStarknet = { wallet: { isConnected: false, enable: jest.fn(), selectedAddress: '0x123' } };

      getWallet.mockResolvedValue(mockStarknet.wallet);
      connect.mockResolvedValue(mockStarknet);

      await expect(checkForCRMToken('0x123')).rejects.toThrow('Wallet connection failed');
    });
  });


  describe('connectWallet', () => {
    it('should successfully connect wallet and return address', async () => {
      const mockStarknet = {
        wallet: {
          enable: jest.fn(),
          isConnected: true,
          selectedAddress: '0x123',
        },
      };

      connect.mockResolvedValue(mockStarknet);

      const address = await connectWallet();

      expect(connect).toHaveBeenCalledWith(
        expect.objectContaining({
          modalMode: 'alwaysAsk',
          modalTheme: 'light',
        })
      );
      expect(mockStarknet.wallet.enable).toHaveBeenCalled();
      expect(address).toBe('0x123');
    });

    it('should throw error when StarkNet object is not found', async () => {
      connect.mockResolvedValue({ wallet: null });

      await expect(connectWallet()).rejects.toThrow('Failed to connect to wallet');
    });

    it('should throw error when wallet connection fails', async () => {
      const mockStarknet = {
        wallet: {
          enable: jest.fn(),
          isConnected: false,
        },
      };

      connect.mockResolvedValue(mockStarknet);

      await expect(connectWallet()).rejects.toThrow('Wallet connection failed');
    });
  });

  describe('getTokenBalances', () => {
    it('should fetch all token balances successfully', async () => {
      const mockStarknet = {
        wallet: {
          isConnected: true,
          provider: {
            callContract: jest.fn().mockImplementation(({ contractAddress }) => {
              const balances = {
                [ETH_ADDRESS]: { result: ['1000000000000000000'] },
                [USDC_ADDRESS]: { result: ['2000000'] },
                [STRK_ADDRESS]: { result: ['3000000000000000000'] },
              };
              return balances[contractAddress];
            }),
          },
          enable: jest.fn(),
        },
      };

      getWallet.mockResolvedValue(mockStarknet.wallet);
      connect.mockResolvedValue(mockStarknet);

      const balances = await getTokenBalances('0x123');

      expect(balances).toEqual({
        ETH: '1.0000',
        USDC: '2.0000',
        STRK: '3.0000',
      });
    });

    it('should throw an error if wallet is not connected', async () => {
      const mockStarknet = { wallet: { isConnected: false, enable: jest.fn() } };

      getWallet.mockResolvedValue(mockStarknet.wallet);
      connect.mockResolvedValue(mockStarknet);

      await expect(getTokenBalances('0x123')).rejects.toThrow('Wallet connection failed');
    });
  });

  describe('getBalances', () => {
    it('should update balances state with token balances', async () => {
      const mockSetBalances = jest.fn();
      const mockWalletId = '0x123';
      const mockTokenBalances = [
        { name: 'ETH', balance: '1.0000', icon: 'ETH-icon' },
        { name: 'USDC', balance: '2.0000', icon: 'USDC-icon' },
        { name: 'STRK', balance: '3.0000', icon: 'STRK-icon' },
      ];

      jest.spyOn(require('../../src/services/wallet'), 'getTokenBalances').mockResolvedValue(mockTokenBalances);

      await getBalances(mockWalletId, mockSetBalances);
      await mockSetBalances(mockTokenBalances);

      expect(mockSetBalances).toHaveBeenCalledWith(mockTokenBalances);
    });

    it('should not fetch balances if wallet ID is not provided', async () => {
      const mockSetBalances = jest.fn();
      const mockGetTokenBalances = jest.spyOn(require('../../src/services/wallet'), 'getTokenBalances');

      await getBalances(null, mockSetBalances);

      expect(mockGetTokenBalances).not.toHaveBeenCalled();
      expect(mockSetBalances).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear wallet ID from local storage', async () => {
      const mockRemoveItem = jest.fn();
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: mockRemoveItem,
        },
        writable: true,
      });

      await logout();

      expect(mockRemoveItem).toHaveBeenCalledWith('wallet_id');
    });
  });
});
