import { Search, X, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ALL_CATEGORIES } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function TransactionFilters() {
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const resetFilters = useStore((s) => s.resetFilters);

  const hasActiveFilters =
    filters.search || filters.category || filters.type;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className={cn(
              'w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700',
              'bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              'transition-colors'
            )}
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
            className={cn(
              'appearance-none rounded-xl border border-slate-200 dark:border-slate-700',
              'bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100',
              'px-3 py-2.5 min-w-[140px]',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              'transition-colors cursor-pointer'
            )}
          >
            <option value="">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value })}
            className={cn(
              'appearance-none rounded-xl border border-slate-200 dark:border-slate-700',
              'bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100',
              'px-3 py-2.5 min-w-[120px]',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              'transition-colors cursor-pointer'
            )}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [
                'date' | 'amount' | 'category',
                'asc' | 'desc',
              ];
              setFilters({ sortBy, sortOrder });
            }}
            className={cn(
              'appearance-none rounded-xl border border-slate-200 dark:border-slate-700',
              'bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100',
              'px-3 py-2.5 min-w-[150px]',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              'transition-colors cursor-pointer'
            )}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="category-asc">Category A-Z</option>
            <option value="category-desc">Category Z-A</option>
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="md"
              icon={<RotateCcw size={14} />}
              onClick={resetFilters}
              className="flex-shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
