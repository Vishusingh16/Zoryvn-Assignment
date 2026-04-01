import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type { Transaction } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMM dd, yyyy');
}

export function formatDateShort(date: string): string {
  return format(parseISO(date), 'MMM dd');
}

export function formatMonth(date: string): string {
  return format(parseISO(date), 'MMM yyyy');
}

export function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getTransactionsForMonth(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));

  return transactions.filter((t) => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start, end });
  });
}

export function calculateTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expenses, balance: income - expenses };
}

export function groupByCategory(transactions: Transaction[]) {
  const groups: Record<string, number> = {};
  transactions.forEach((t) => {
    groups[t.category] = (groups[t.category] ?? 0) + t.amount;
  });
  return Object.entries(groups)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function groupByMonth(transactions: Transaction[]) {
  const groups: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((t) => {
    const monthKey = format(parseISO(t.date), 'yyyy-MM');
    if (!groups[monthKey]) {
      groups[monthKey] = { income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      groups[monthKey]!.income += t.amount;
    } else {
      groups[monthKey]!.expenses += t.amount;
    }
  });

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: format(parseISO(`${month}-01`), 'MMM'),
      monthFull: format(parseISO(`${month}-01`), 'MMM yyyy'),
      ...data,
      balance: data.income - data.expenses,
    }));
}

export function exportToCSV(transactions: Transaction[], filename: string) {
  const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description}"`,
    t.amount.toString(),
    t.category,
    t.type,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportToJSON(transactions: Transaction[], filename: string) {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}
