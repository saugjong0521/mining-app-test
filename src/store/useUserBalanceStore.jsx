
import { create } from 'zustand';

const useUserBalanceStore = create((set) => ({
    balance: 0,

    setBalance: (val) => set({ balance: val }),
}));

export { useUserBalanceStore }