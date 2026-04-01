import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Role, Page, Filters } from '../types';
import { mockTransactions } from '../data/mockData';

const DEFAULT_FILTERS: Filters = {
  search: '',
  category: '',
  type: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

interface AppState {
  transactions: Transaction[];
  role: Role;
  darkMode: boolean;
  currentPage: Page;
  sidebarOpen: boolean;
  filters: Filters;

  setRole: (role: Role) => void;
  toggleDarkMode: () => void;
  setCurrentPage: (page: Page) => void;
  setSidebarOpen: (open: boolean) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'admin',
      darkMode: false,
      currentPage: 'dashboard',
      sidebarOpen: false,
      filters: DEFAULT_FILTERS,

      setRole: (role) => set({ role }),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      setCurrentPage: (currentPage) =>
        set({ currentPage, sidebarOpen: false }),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'financeflow-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
      }),
    }
  )
);
