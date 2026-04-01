import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { calculateTotals, getTransactionsForMonth, formatCurrency } from '../../utils/helpers';
import { cn } from '../../utils/cn';

interface SummaryCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
  delay: number;
}

function SummaryCard({ title, value, change, icon, iconBg, delay }: SummaryCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6',
        'border border-slate-100 dark:border-slate-800 card-shadow',
        'group hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight size={14} className="text-emerald-500" />
              ) : (
                <ArrowDownRight size={14} className="text-rose-500" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {Math.abs(change).toFixed(1)}% vs last month
              </span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconBg)}>
          {icon}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 dark:to-slate-800/20 pointer-events-none" />
    </motion.div>
  );
}

export function SummaryCards() {
  const transactions = useStore((s) => s.transactions);

  const currentTotals = calculateTotals(transactions);
  const currentMonth = getTransactionsForMonth(transactions, 2026, 2);
  const prevMonth = getTransactionsForMonth(transactions, 2026, 1);
  const currentMonthTotals = calculateTotals(currentMonth);
  const prevMonthTotals = calculateTotals(prevMonth);

  const incomeChange = prevMonthTotals.income > 0
    ? ((currentMonthTotals.income - prevMonthTotals.income) / prevMonthTotals.income) * 100
    : 0;

  const expenseChange = prevMonthTotals.expenses > 0
    ? ((currentMonthTotals.expenses - prevMonthTotals.expenses) / prevMonthTotals.expenses) * 100
    : 0;

  const savingsRate = currentTotals.income > 0
    ? (currentTotals.balance / currentTotals.income) * 100
    : 0;

  const prevSavingsRate = prevMonthTotals.income > 0
    ? (prevMonthTotals.balance / prevMonthTotals.income) * 100
    : 0;

  const savingsRateChange = prevSavingsRate > 0
    ? ((savingsRate - prevSavingsRate) / prevSavingsRate) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      <SummaryCard
        title="Total Balance"
        value={formatCurrency(currentTotals.balance)}
        icon={<Wallet size={22} className="text-indigo-600 dark:text-indigo-400" />}
        iconBg="bg-indigo-50 dark:bg-indigo-900/30"
        delay={0}
      />
      <SummaryCard
        title="Total Income"
        value={formatCurrency(currentTotals.income)}
        change={incomeChange}
        icon={<TrendingUp size={22} className="text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-50 dark:bg-emerald-900/30"
        delay={0.05}
      />
      <SummaryCard
        title="Total Expenses"
        value={formatCurrency(currentTotals.expenses)}
        change={expenseChange}
        icon={<TrendingDown size={22} className="text-rose-600 dark:text-rose-400" />}
        iconBg="bg-rose-50 dark:bg-rose-900/30"
        delay={0.1}
      />
      <SummaryCard
        title="Savings Rate"
        value={`${savingsRate.toFixed(1)}%`}
        change={savingsRateChange}
        icon={<PiggyBank size={22} className="text-amber-600 dark:text-amber-400" />}
        iconBg="bg-amber-50 dark:bg-amber-900/30"
        delay={0.15}
      />
    </div>
  );
}
