import { SummaryCards } from './SummaryCards';
import { BalanceTrend } from './BalanceTrend';
import { SpendingBreakdown } from './SpendingBreakdown';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { RecentTransactions } from './RecentTransactions';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Your financial overview at a glance
        </p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <IncomeExpenseChart />
        <RecentTransactions />
      </div>
    </div>
  );
}
