export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Housing'
  | 'Food & Dining'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Healthcare'
  | 'Utilities'
  | 'Education'
  | 'Travel'
  | 'Subscriptions';

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Refunds'
  | 'Other Income';

export type Category = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export type Role = 'admin' | 'viewer';

export type Page = 'dashboard' | 'transactions' | 'insights';

export interface Filters {
  search: string;
  category: string;
  type: string;
  sortBy: 'date' | 'amount' | 'category';
  sortOrder: 'asc' | 'desc';
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Housing',
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Utilities',
  'Education',
  'Travel',
  'Subscriptions',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelance',
  'Investments',
  'Refunds',
  'Other Income',
];

export const ALL_CATEGORIES: Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
];

export const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#6366f1',
  'Food & Dining': '#f59e0b',
  Transportation: '#3b82f6',
  Entertainment: '#ec4899',
  Shopping: '#8b5cf6',
  Healthcare: '#ef4444',
  Utilities: '#06b6d4',
  Education: '#14b8a6',
  Travel: '#f97316',
  Subscriptions: '#a855f7',
  Salary: '#10b981',
  Freelance: '#22d3ee',
  Investments: '#6366f1',
  Refunds: '#84cc16',
  'Other Income': '#64748b',
};
