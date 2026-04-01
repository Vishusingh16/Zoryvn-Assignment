import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Trophy,
  CalendarDays,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';
import {
  formatCurrency,
  groupByCategory,
  groupByMonth,
  getTransactionsForMonth,
  calculateTotals,
} from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../types';
import { cn } from '../../utils/cn';

interface InsightCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

function InsightCard({ icon, iconBg, title, value, subtitle, trend, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 card-shadow"
    >
      <div className={cn('p-3 rounded-xl flex-shrink-0', iconBg)}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
        {subtitle && (
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' && <ArrowUpRight size={12} className="text-emerald-500" />}
            {trend === 'down' && <ArrowDownRight size={12} className="text-rose-500" />}
            <p
              className={cn(
                'text-xs',
                trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
                trend === 'down' && 'text-rose-600 dark:text-rose-400',
                (!trend || trend === 'neutral') && 'text-slate-500 dark:text-slate-400'
              )}
            >
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 min-w-[140px]">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-300">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InsightsPage() {
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    const categoryBreakdown = groupByCategory(expenses);
    const topCategory = categoryBreakdown[0];

    const currentMonth = getTransactionsForMonth(transactions, 2026, 2);
    const prevMonth = getTransactionsForMonth(transactions, 2026, 1);
    const currentTotals = calculateTotals(currentMonth);
    const prevTotals = calculateTotals(prevMonth);

    const expenseChange = prevTotals.expenses > 0
      ? ((currentTotals.expenses - prevTotals.expenses) / prevTotals.expenses) * 100
      : 0;

    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const monthlyData = groupByMonth(transactions);
    const totalDays = 183;
    const avgDailySpending = totalExpenses / totalDays;

    const biggestTransaction = [...expenses].sort((a, b) => b.amount - a.amount)[0];

    const incomeSources = groupByCategory(incomes);

    const monthlyExpenses = monthlyData.map((m) => m.expenses);
    const avgMonthlyExpense = monthlyExpenses.reduce((a, b) => a + b, 0) / monthlyExpenses.length;

    const savingsData = monthlyData.map((m) => ({
      month: m.month,
      savings: m.income - m.expenses,
      rate: m.income > 0 ? ((m.income - m.expenses) / m.income) * 100 : 0,
    }));

    return {
      topCategory,
      categoryBreakdown,
      currentTotals,
      prevTotals,
      expenseChange,
      savingsRate,
      avgDailySpending,
      biggestTransaction,
      incomeSources,
      avgMonthlyExpense,
      monthlyData,
      savingsData,
    };
  }, [transactions]);

  const topCategoryChartData = insights.categoryBreakdown.slice(0, 6).map((c) => ({
    name: c.category.length > 12 ? c.category.slice(0, 12) + '...' : c.category,
    fullName: c.category,
    amount: c.amount,
    fill: CATEGORY_COLORS[c.category] ?? '#94a3b8',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Understand your spending patterns and financial health
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <InsightCard
          icon={<Trophy size={20} className="text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-50 dark:bg-amber-900/30"
          title="Top Spending Category"
          value={insights.topCategory?.category ?? 'N/A'}
          subtitle={insights.topCategory ? formatCurrency(insights.topCategory.amount) : undefined}
          delay={0}
        />
        <InsightCard
          icon={<CalendarDays size={20} className="text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-50 dark:bg-blue-900/30"
          title="Avg. Daily Spending"
          value={formatCurrency(insights.avgDailySpending)}
          subtitle={`${formatCurrency(insights.avgMonthlyExpense)}/month avg`}
          delay={0.05}
        />
        <InsightCard
          icon={<Target size={20} className="text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/30"
          title="Overall Savings Rate"
          value={`${insights.savingsRate.toFixed(1)}%`}
          subtitle={insights.savingsRate > 20 ? 'Great progress!' : 'Room for improvement'}
          trend={insights.savingsRate > 20 ? 'up' : 'down'}
          delay={0.1}
        />
        <InsightCard
          icon={
            insights.expenseChange <= 0 ? (
              <TrendingDown size={20} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingUp size={20} className="text-rose-600 dark:text-rose-400" />
            )
          }
          iconBg={
            insights.expenseChange <= 0
              ? 'bg-emerald-50 dark:bg-emerald-900/30'
              : 'bg-rose-50 dark:bg-rose-900/30'
          }
          title="Monthly Expense Change"
          value={`${insights.expenseChange > 0 ? '+' : ''}${insights.expenseChange.toFixed(1)}%`}
          subtitle={`${formatCurrency(insights.currentTotals.expenses)} this month`}
          trend={insights.expenseChange <= 0 ? 'up' : 'down'}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Top Spending Categories
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Where your money goes
          </p>
          <div className="h-[260px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCategoryChartData} layout="vertical" barSize={20}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? '#334155' : '#e2e8f0'}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }}
                  width={100}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="amount" name="Amount" radius={[0, 6, 6, 0]}>
                  {topCategoryChartData.map((entry, i) => (
                    <motion.rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Savings Trend
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Monthly net savings over time
          </p>
          <div className="h-[260px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.savingsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? '#334155' : '#e2e8f0'}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: darkMode ? '#94a3b8' : '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: darkMode ? '#94a3b8' : '#64748b' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Net Savings"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/30">
              <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Biggest Expense
            </h3>
          </div>
          {insights.biggestTransaction ? (
            <div className="space-y-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(insights.biggestTransaction.amount)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {insights.biggestTransaction.description}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[insights.biggestTransaction.category] ?? '#94a3b8',
                  }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {insights.biggestTransaction.category}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No expenses found</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
              <Wallet size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Income Sources
            </h3>
          </div>
          <div className="space-y-3">
            {insights.incomeSources.map((source) => {
              const totalIncome = insights.incomeSources.reduce((s, i) => s + i.amount, 0);
              const pct = ((source.amount / totalIncome) * 100).toFixed(0);
              return (
                <div key={source.category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{source.category}</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(source.amount)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: CATEGORY_COLORS[source.category] ?? '#6366f1',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30">
              <Zap size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Monthly Comparison
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-500 dark:text-slate-400">This Month</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(insights.currentTotals.expenses)}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      (insights.currentTotals.expenses /
                        Math.max(insights.currentTotals.expenses, insights.prevTotals.expenses)) *
                        100,
                      100
                    )}%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-indigo-500"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-500 dark:text-slate-400">Last Month</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(insights.prevTotals.expenses)}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      (insights.prevTotals.expenses /
                        Math.max(insights.currentTotals.expenses, insights.prevTotals.expenses)) *
                        100,
                      100
                    )}%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-slate-400 dark:bg-slate-600"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {insights.expenseChange <= 0 ? (
                  <>
                    <TrendingDown size={16} className="text-emerald-500" />
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      You spent {Math.abs(insights.expenseChange).toFixed(1)}% less this month
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} className="text-rose-500" />
                    <span className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                      You spent {insights.expenseChange.toFixed(1)}% more this month
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
