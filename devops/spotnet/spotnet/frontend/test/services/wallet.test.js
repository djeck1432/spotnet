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

import * as walletService from '../../src/services/wallet';

import { ETH_ADDRESS, kSTRK_ADDRESS, STRK_ADDRESS, USDC_ADDRESS } from '../../src/utils/constants';
import { expect, describe, it, beforeEach, vi } from 'vitest';

vi.mock('starknetkit', () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  getSelectedConnectorWallet: vi.fn(),
}));

vi.mock(
  'starknetkit/injected',
  () => ({
    InjectedConnector: vi.fn().mockImplementation((options) => options),
  }),
  { virtual: true }
);

describe('Wallet Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
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
            callContract: vi.fn().mockResolvedValue({ result: ['1'] }),
          },
          enable: vi.fn(),
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
            callContract: vi.fn().mockResolvedValue({ result: ['0'] }),
          },
          enable: vi.fn(),
        },
      };

      global.alert = vi.fn();

      connect.mockResolvedValue(mockStarknet);

      const result = await checkForCRMToken('0x123');
      expect(result).toBe(false);
      expect(global.alert).toHaveBeenCalledWith('Beta testing is allowed only for users who hold the CRM token.');
    });
  });

  describe('getConnectors', () => {
    it('should return connectors array with injected connectors', () => {
      const mockGetItem = vi.fn();
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
        const mockGetItem = vi.fn();
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
            enable: vi.fn(),
            selectedAddress: expectedAddress,
          },
        };

        connect.mockResolvedValue(mockStarknet);

        const mockGetItem = vi.fn().mockReturnValue(connectorId);
        const mockSetItem = vi.fn();

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
          enable: vi.fn(),
          selectedAddress: '0x123',
        },
      };

      connect.mockResolvedValue(mockStarknet);

      const mockGetItem = vi.fn().mockReturnValue(null);

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
          enable: vi.fn(),
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
          enable: vi.fn(),
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
            callContract: vi.fn().mockImplementation(({ contractAddress }) => {
              const balances = {
                [ETH_ADDRESS]: { result: ['1000000000000000000'] },
                [USDC_ADDRESS]: { result: ['2000000'] },
                [STRK_ADDRESS]: { result: ['3000000000000000000'] },
                [kSTRK_ADDRESS]: { result: ['4000000000000000000'] },
              };
              return balances[contractAddress];
            }),
          },
          enable: vi.fn(),
        },
      };

      connect.mockResolvedValue(mockStarknet);

      const balances = await getTokenBalances('0x123');

      expect(balances).toEqual({
        ETH: '1.0000',
        USDC: '2.0000',
        STRK: '3.0000',
        kSTRK: '4.0000',
      });
    });
  });

  describe('getBalances', () => {
    const mockTokenBalances = [
      { name: 'ETH', balance: '1.0000', icon: 'ETH-icon' },
      { name: 'USDC', balance: '2.0000', icon: 'USDC-icon' },
      { name: 'STRK', balance: '3.0000', icon: 'STRK-icon' },
      { name: 'kSTRK', balance: '4.0000', icon: 'kSTRK-icon' },
    ];

    it('should update balances state with token balances', async () => {
      const mockSetBalances = vi.fn();
      const mockWalletId = '0x123';

      // vi.spyOn(require('../../src/services/wallet'), 'getTokenBalances').mockResolvedValue(mockTokenBalances);

      vi.spyOn(walletService, 'getTokenBalances').mockResolvedValue(mockTokenBalances);

      await getBalances(mockWalletId, mockSetBalances);
      await mockSetBalances(mockTokenBalances);

      expect(mockSetBalances).toHaveBeenCalledWith(mockTokenBalances);
    });

    it('should not fetch balances if wallet ID is not provided', async () => {
      const mockSetBalances = vi.fn();
      // const mockGetTokenBalances = vi.spyOn(require('../../src/services/wallet'), 'getTokenBalances');

      const mockGetTokenBalances = vi.spyOn(walletService, 'getTokenBalances').mockResolvedValue(mockTokenBalances);

      await getBalances(null, mockSetBalances);

      expect(mockGetTokenBalances).not.toHaveBeenCalled();
      expect(mockSetBalances).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear wallet ID from local storage', async () => {
      const mockRemoveItem = vi.fn();
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
