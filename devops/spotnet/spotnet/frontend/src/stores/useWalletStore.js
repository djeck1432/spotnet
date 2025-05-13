import { create } from 'zustand';

export const useWalletStore = create((set) => ({
  walletId: localStorage.getItem('wallet_id'),
  setWalletId: (walletId) => {
    localStorage.setItem('wallet_id', walletId);
    set({ walletId });
  },
  removeWalletId: () => {
    localStorage.removeItem('wallet_id');
    set({ walletId: undefined });
  },
}));
