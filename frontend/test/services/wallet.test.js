import { connect } from 'starknetkit';
import { InjectedConnector } from 'starknetkit/injected';
import {
  checkForCRMToken,
  connectWallet,
  getTokenBalances,
  getBalances,
  logout,
  getWallet,
  getConnectors,
} from '../../src/services/wallet';
import { ETH_ADDRESS, STRK_ADDRESS, USDC_ADDRESS } from '../../src/utils/constants';

jest.mock('starknetkit', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  getSelectedConnectorWallet: jest.fn(),
}));

jest.mock(
  'starknetkit/injected',
  () => ({
    InjectedConnector: jest.fn().mockImplementation((options) => options),
  }),
  { virtual: true }
);

describe('Wallet Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('checkForCRMToken', () => {
    it('should return true in development mode', async () => {
      process.env.VITE_APP_IS_DEV = 'true';
      const result = await checkForCRMToken('0x123');
      expect(result).toBe(true);
    });

    it('should validate CRM token and return true if wallet has tokens', async () => {
      process.env.VITE_APP_IS_DEV = 'false';
      const mockStarknet = {
        wallet: {
          isConnected: true,
          provider: {
            callContract: jest.fn().mockResolvedValue({ result: ['1'] }),
          },
          enable: jest.fn(),
        },
      };

      connect.mockResolvedValue(mockStarknet);

      const result = await checkForCRMToken('0x123');
      expect(result).toBe(true);
    });

    it('should return false and alert if wallet lacks CRM tokens', async () => {
      process.env.VITE_IS_DEV = 'false';
      const mockStarknet = {
        wallet: {
          isConnected: true,
          provider: {
            callContract: jest.fn().mockResolvedValue({ result: ['0'] }),
          },
          enable: jest.fn(),
        },
      };

      global.alert = jest.fn();

      connect.mockResolvedValue(mockStarknet);

      const result = await checkForCRMToken('0x123');
      expect(result).toBe(false);
      expect(global.alert).toHaveBeenCalledWith('Beta testing is allowed only for users who hold the CRM token.');
    });
  });

  describe('getConnectors', () => {
    it('should return connectors array with injected connectors', () => {
      const mockGetItem = jest.fn();
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: mockGetItem.mockReturnValue(null),
        },
        writable: true,
      });

      const connectors = getConnectors();

      expect(connectors).toEqual([
        new InjectedConnector({ options: { id: 'argentX' } }),
        new InjectedConnector({ options: { id: 'braavos' } }),
      ]);
    });

    ['argentX', 'braavos'].forEach((connector) => {
      it(`should return connectors array with injected connectors from local storage (${connector})`, () => {
        const mockGetItem = jest.fn();
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: mockGetItem.mockReturnValue(connector),
          },
          writable: true,
        });

        const connectors = getConnectors();

        expect(connectors).toEqual([new InjectedConnector({ options: { id: connector } })]);
      });
    });
  });

  describe('getWallet', () => {
    const testCases = [
      { connectorId: 'argentX', expectedAddress: '0x123' },
      { connectorId: 'braavos', expectedAddress: '0x456' },
    ];

    testCases.forEach(({ connectorId, expectedAddress }) => {
      it(`should return wallet object if wallet is connected with ${connectorId}`, async () => {
        const mockStarknet = {
          wallet: {
            isConnected: true,
            enable: jest.fn(),
            selectedAddress: expectedAddress,
          },
        };

        connect.mockResolvedValue(mockStarknet);

        const mockGetItem = jest.fn().mockReturnValue(connectorId);
        const mockSetItem = jest.fn();

        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: mockGetItem,
          },
          writable: true,
        });

        const wallet = await getWallet();

        expect(mockGetItem).toHaveBeenCalledWith('starknetLastConnectedWallet');

        expect(connect).toHaveBeenCalledWith(
          expect.objectContaining({
            connectors: expect.arrayContaining([
              expect.objectContaining({
                options: expect.objectContaining({
                  id: connectorId,
                }),
              }),
            ]),
            modalMode: 'neverAsk',
          })
        );
        expect(wallet.isConnected).toBe(true);
        expect(wallet.enable).toHaveBeenCalled();
        expect(wallet.selectedAddress).toBe(expectedAddress);
      });
    });

    it('should return wallet object if wallet is not choosen before', async () => {
      const mockStarknet = {
        wallet: {
          isConnected: true,
          enable: jest.fn(),
          selectedAddress: '0x123',
        },
      };

      connect.mockResolvedValue(mockStarknet);

      const mockGetItem = jest.fn().mockReturnValue(null);

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: mockGetItem,
        },
        writable: true,
      });

      const wallet = await getWallet();

      expect(mockGetItem).toHaveBeenCalledWith('starknetLastConnectedWallet');

      expect(connect).toHaveBeenCalledWith(
        expect.objectContaining({
          connectors: expect.arrayContaining([
            expect.objectContaining({
              options: expect.objectContaining({
                id: 'argentX',
              }),
            }),
            expect.objectContaining({
              options: expect.objectContaining({
                id: 'braavos',
              }),
            }),
          ]),
          modalMode: 'neverAsk',
        })
      );
      expect(wallet.isConnected).toBe(true);
      expect(wallet.enable).toHaveBeenCalled();
      expect(wallet.selectedAddress).toBe('0x123');
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

      const wallet = await connectWallet();

      expect(connect).toHaveBeenCalledWith(
        expect.objectContaining({
          connectors: expect.any(Array),
          modalMode: 'alwaysAsk',
          modalTheme: 'dark',
        })
      );
      expect(mockStarknet.wallet.enable).toHaveBeenCalled();
      expect(wallet.selectedAddress).toBe('0x123');
      expect(wallet.isConnected).toBe(true);
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

      connect.mockResolvedValue(mockStarknet);

      const balances = await getTokenBalances('0x123');

      expect(balances).toEqual({
        ETH: '1.0000',
        USDC: '2.0000',
        STRK: '3.0000',
      });
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
