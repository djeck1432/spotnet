import { vi } from 'vitest';

const mockStarknet = {
  isConnected: true,
  account: {
    deployContract: vi.fn().mockResolvedValue({
      transaction_hash: '0xabc...',
      contract_address: '0xdef...',
    }),
    waitForTransaction: vi.fn().mockResolvedValue(true),
  },
};

export const connect = vi.fn().mockResolvedValue(mockStarknet);
