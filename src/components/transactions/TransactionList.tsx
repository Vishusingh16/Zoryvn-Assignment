import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../types';
import type { Transaction } from '../../types';
import { cn } from '../../utils/cn';

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ onEdit }: TransactionListProps) {
  const transactions = useStore((s) => s.transactions);
  const filters = useStore((s) => s.filters);
  const role = useStore((s) => s.role);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = transactions
    .filter((t) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !t.description.toLowerCase().includes(q) &&
          !t.category.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.category && t.category !== filters.category) return false;
      if (filters.type && t.type !== filters.type) return false;
      return true;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      switch (filters.sortBy) {
        case 'date':
          return a.date.localeCompare(b.date) * order;
        case 'amount':
          return (a.amount - b.amount) * order;
        case 'category':
          return a.category.localeCompare(b.category) * order;
        default:
          return 0;
      }
    });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteTransaction(id);
      setDeletingId(null);
    }, 300);
  };

  if (filtered.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description={
          filters.search || filters.category || filters.type
            ? 'Try adjusting your filters to see more results.'
            : 'Add your first transaction to get started.'
        }
      />
    );
  }

  return (
    <div className="space-y-1">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-2 text-right">
          {role === 'admin' ? 'Actions' : 'Type'}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 4 }}
            animate={{
              opacity: deletingId === t.id ? 0 : 1,
              y: 0,
              scale: deletingId === t.id ? 0.95 : 1,
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center',
              'px-4 py-3 rounded-xl',
              'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
              'border border-transparent hover:border-slate-100 dark:hover:border-slate-800'
            )}
          >
            <div className="md:col-span-4 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[t.category] ?? '#94a3b8'}15`,
                }}
              >
                {t.type === 'income' ? (
                  <ArrowUpRight
                    size={16}
                    style={{ color: CATEGORY_COLORS[t.category] ?? '#94a3b8' }}
                  />
                ) : (
                  <ArrowDownRight
                    size={16}
                    style={{ color: CATEGORY_COLORS[t.category] ?? '#94a3b8' }}
                  />
                )}
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {t.description}
              </span>
            </div>

            <div className="md:col-span-2 flex items-center">
              <Badge variant="neutral">{t.category}</Badge>
            </div>

            <div className="md:col-span-2 text-sm text-slate-500 dark:text-slate-400">
              {formatDate(t.date)}
            </div>

            <div className="md:col-span-2 text-right">
              <span
                className={cn(
                  'text-sm font-semibold',
                  t.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-1">
              {role === 'admin' ? (
                <>
                  <button
                    onClick={() => onEdit(t)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              ) : (
                <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                  {t.type}
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 mt-2">
        Showing {filtered.length} of {transactions.length} transactions
      </div>
    </div>
  );
}
