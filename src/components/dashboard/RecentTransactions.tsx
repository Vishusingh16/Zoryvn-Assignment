import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../types';
import { cn } from '../../utils/cn';

export function RecentTransactions() {
  const transactions = useStore((s) => s.transactions);
  const setCurrentPage = useStore((s) => s.setCurrentPage);

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Transactions
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Latest activity
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('transactions')}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          View all
        </button>
      </div>
      <div className="space-y-3">
        {recent.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${CATEGORY_COLORS[t.category] ?? '#94a3b8'}15`,
              }}
            >
              {t.type === 'income' ? (
                <ArrowUpRight
                  size={18}
                  style={{ color: CATEGORY_COLORS[t.category] ?? '#94a3b8' }}
                />
              ) : (
                <ArrowDownRight
                  size={18}
                  style={{ color: CATEGORY_COLORS[t.category] ?? '#94a3b8' }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {t.description}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {formatDate(t.date)}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className={cn(
                  'text-sm font-semibold',
                  t.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-white'
                )}
              >
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </p>
              <Badge variant={t.type === 'income' ? 'income' : 'expense'} className="mt-1">
                {t.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
