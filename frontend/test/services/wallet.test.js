import { useAccount, useBalance, useConnect, useDisconnect } from '@starknet-react/core';
import { useCRMToken, useWalletConnection, useTokenBalance, useAllTokenBalances } from '../../src/services/wallet';
import { ETH_ADDRESS} from '../../src/utils/constants';

jest.mock('@starknet-react/core', () => ({
  useAccount: jest.fn(),
  useBalance: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
}));

jest.mock('assets/icons/ethereum.svg', () => ({
  ReactComponent: 'ETH'
}));
jest.mock('assets/icons/borrow_usdc.svg', () => ({
  ReactComponent: 'USDC'
}));
jest.mock('assets/icons/strk.svg', () => ({
  ReactComponent: 'STRK'
}));

describe('Wallet Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCRMToken', () => {
    it('should return true in development mode', () => {
      process.env.REACT_APP_IS_DEV = 'true';
      useAccount.mockReturnValue({ address: '0x123', isConnected: true });
      useBalance.mockReturnValue({ data: { formatted: '1.0' }, isLoading: false, error: null });

      const result = useCRMToken();
      expect(result.hasCRMToken).toBe(true);
    });

    it('should return true when wallet has CRM tokens', () => {
      process.env.REACT_APP_IS_DEV = 'false';
      useAccount.mockReturnValue({ address: '0x123', isConnected: true });
      useBalance.mockReturnValue({ data: { formatted: '1.0' }, isLoading: false, error: null });

      const result = useCRMToken();
      expect(result.hasCRMToken).toBe(true);
    });

    it('should return false when wallet has no CRM tokens', () => {
      process.env.REACT_APP_IS_DEV = 'false';
      useAccount.mockReturnValue({ address: '0x123', isConnected: true });
      useBalance.mockReturnValue({ data: { formatted: '0.0' }, isLoading: false, error: null });

      global.alert = jest.fn();

      const result = useCRMToken();
      expect(result.hasCRMToken).toBe(false);
      expect(global.alert).toHaveBeenCalledWith('Beta testing is allowed only for users who hold the CRM token.');
    });
  });

  describe('useWalletConnection', () => {
    it('should handle wallet connection successfully', async () => {
      const mockConnect = jest.fn();
      const mockConnector = { id: 'testConnector' };
      
      useConnect.mockReturnValue({ 
        connect: mockConnect,
        connectors: [mockConnector]
      });
      useAccount.mockReturnValue({ 
        address: '0x123', 
        isConnected: true,
        account: {}
      });
      useDisconnect.mockReturnValue({ disconnect: jest.fn() });

      const { connectWallet } = useWalletConnection();
      await connectWallet(mockConnector);

      expect(mockConnect).toHaveBeenCalledWith({ connector: mockConnector });
    });
  });

  describe('useTokenBalance', () => {
    it('should return formatted balance when connected', () => {
      useAccount.mockReturnValue({ address: '0x123', isConnected: true });
      useBalance.mockReturnValue({ 
        data: { formatted: '1.2345' },
        isLoading: false 
      });

      const result = useTokenBalance(ETH_ADDRESS);
      expect(result.balance).toBe('1.23');
    });

    it('should return zero balance when not connected', () => {
      useAccount.mockReturnValue({ address: null, isConnected: false });

      const result = useTokenBalance(ETH_ADDRESS);
      expect(result.balance).toBe('0.0000');
    });
  });

  describe('useAllTokenBalances', () => {
    it('should return all token balances', () => {
      useAccount.mockReturnValue({ address: '0x123', isConnected: true });
      useBalance
        .mockReturnValueOnce({ data: { formatted: '1.0' }, isLoading: false })
        .mockReturnValueOnce({ data: { formatted: '2.0' }, isLoading: false })
        .mockReturnValueOnce({ data: { formatted: '3.0' }, isLoading: false });

      const result = useAllTokenBalances();

      expect(result).toEqual([
        { icon: expect.any(Object), title: 'ETH', balance: '1.0', isLoading: false },
        { icon: expect.any(Object), title: 'USDC', balance: '2.0', isLoading: false },
        { icon: expect.any(Object), title: 'STRK', balance: '3.0', isLoading: false }
      ]);
    });
  });
});