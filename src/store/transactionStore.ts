import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TransactionInfo {
  from: string;
  to: string;
  amount: string;
  transactionHash: string;
  timestamp?: number;
}

interface TransactionStore {
  transactions: TransactionInfo[];
  addTransaction: (transaction: TransactionInfo) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            { ...transaction, timestamp: Date.now() },
          ],
        })),
      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: "transaction-storage",
    }
  )
);
