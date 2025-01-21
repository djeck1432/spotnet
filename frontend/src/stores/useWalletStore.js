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

export const useAccountStore = create((set) => ({
  account: localStorage.getItem('account'),
  setAccount: (account) => 
    {
      localStorage.setItem('account', account);
      set({ account });
    },
    removeAccount: () => {
    localStorage.removeItem('account');
    set({ account: null });
  },
}));
