import { 
  useWalletConnect, 
  useCRMToken, 
  useTokenBalances, 
  useGetBalance, 
  getTokenBalance
} from '../../src/services/wallet';

import { ETH_ADDRESS } from '../../src/utils/constants';
import * as starknetReactCore from '@starknet-react/core';

jest.mock('@starknet-react/core');
jest.mock('../../src/stores/useWalletStore', () => ({
  useAccountStore: jest.fn(),
}));

jest.mock('starknetkit', () => ({
  useStarknetkitConnectModal: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('assets/icons/ethereum.svg', () => ({
  ReactComponent: () => 'ETH',
}));
jest.mock('assets/icons/borrow_usdc.svg', () => ({
  ReactComponent: () => 'USDC',
}));
jest.mock('assets/icons/strk.svg', () => ({
  ReactComponent: () => 'STRK',
}));

describe('Wallet Services', () => {
  const mockAccount = {
    address: '0x123',
    isConnected: true,
    callContract: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    starknetReactCore.useAccount.mockReturnValue({
      account: mockAccount,
      address: mockAccount.address,
      isConnected: true,
    });
    starknetReactCore.useConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [],
    });
  });

  describe('useCRMToken', () => {
    it('should return true in development mode', async () => {
      process.env.REACT_APP_IS_DEV = 'true';
      const checkForCRMToken = useCRMToken();
      const result = await checkForCRMToken('0x123');

      expect(result).toBe(true);
    });

    it('should return true when wallet has CRM tokens', async () => {
      process.env.REACT_APP_IS_DEV = 'false';
      mockAccount.callContract.mockResolvedValueOnce(['1000']);

      const checkForCRMToken = useCRMToken();
      const result = await checkForCRMToken('0x123');

      expect(result).toBe(true);
    });

    it('should alert and return false when no CRM tokens', async () => {
      process.env.REACT_APP_IS_DEV = 'false';
      mockAccount.callContract.mockResolvedValueOnce(['0']);
      global.alert = jest.fn();

      const checkForCRMToken = useCRMToken();
      const result = await checkForCRMToken('0x123');

      expect(result).toBe(false);
      expect(global.alert).toHaveBeenCalledWith(
        'Beta testing is allowed only for users who hold the CRM token.'
      );
    });
  });

  describe('useWalletConnect', () => {
    it('should successfully connect to wallet', async () => {
      const mockConnector = { id: 'testConnector' };
      const mockConnect = jest.fn();
      const mockModal = jest.fn().mockResolvedValue({ connector: mockConnector });
      const mockSetAccount = jest.fn();

      starknetReactCore.useConnect.mockReturnValue({
        connect: mockConnect,
        connectors: [mockConnector],
      });
      require('starknetkit').useStarknetkitConnectModal.mockReturnValue({
        starknetkitConnectModal: mockModal,
      });
      require('../../src/stores/useWalletStore').useAccountStore.mockReturnValue(
        mockSetAccount
      );

      const connectWallet = useWalletConnect();
      const result = await connectWallet();

      expect(mockConnect).toHaveBeenCalledWith({ connector: mockConnector });
      expect(mockSetAccount).toHaveBeenCalledWith(mockAccount);
      expect(result).toBe(mockAccount.address);
    });

    it('should handle error when no connector is selected', async () => {
      const mockModal = jest.fn().mockResolvedValue({ connector: null });
      require('starknetkit').useStarknetkitConnectModal.mockReturnValue({
        starknetkitConnectModal: mockModal,
      });

      const connectWallet = useWalletConnect();
      const result = await connectWallet();

      expect(result).toBeNull();
    });
  });

  describe('useTokenBalances', () => {
    it('should fetch a single token balance', async () => {
      const walletAddress = '0x123';
      mockAccount.callContract.mockResolvedValueOnce(['1000000000000000000']);
    
      require('../../src/stores/useWalletStore').useAccountStore.mockReturnValue({
        account: mockAccount,
      });
    
      const balance = await getTokenBalance(mockAccount, walletAddress, ETH_ADDRESS);
    
      expect(balance).toEqual('1.0000');
    });
    

    it('should return undefined if wallet address is missing', async () => {
      require('../../src/stores/useWalletStore').useAccountStore.mockReturnValue({
        account: mockAccount,
      });

      const { getTokenBalances } = useTokenBalances();
      const balances = await getTokenBalances(null);

      expect(balances).toBeUndefined();
    });
  });

  describe('useGetBalance', () => {

    it('should not update balances when wallet ID is missing', async () => {
      const mockSetBalances = jest.fn();

      const { getBalances } = useGetBalance();
      await getBalances(null, mockSetBalances);

      expect(mockSetBalances).not.toHaveBeenCalled();
    });
  });
});
