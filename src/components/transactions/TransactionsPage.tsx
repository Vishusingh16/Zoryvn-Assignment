import { useState, useCallback } from 'react';
import { Plus, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TransactionFilters } from './TransactionFilters';
import { TransactionList } from './TransactionList';
import { TransactionForm } from './TransactionForm';
import { useStore } from '../../store/useStore';
import { exportToCSV, exportToJSON } from '../../utils/helpers';
import type { Transaction } from '../../types';

export function TransactionsPage() {
  const role = useStore((s) => s.role);
  const transactions = useStore((s) => s.transactions);
  const addTransaction = useStore((s) => s.addTransaction);
  const updateTransaction = useStore((s) => s.updateTransaction);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const handleSubmit = useCallback(
    (transaction: Transaction) => {
      if (editingTransaction) {
        updateTransaction(transaction.id, transaction);
      } else {
        addTransaction(transaction);
      }
      setEditingTransaction(null);
    },
    [editingTransaction, addTransaction, updateTransaction]
  );

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingTransaction(null);
    setFormOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and explore your financial activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              Export
            </Button>
            {exportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 min-w-[140px]">
                  <button
                    onClick={() => {
                      exportToCSV(transactions, 'transactions');
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <FileSpreadsheet size={14} />
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      exportToJSON(transactions, 'transactions');
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <FileJson size={14} />
                    Export JSON
                  </button>
                </div>
              </>
            )}
          </div>

          {role === 'admin' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleAddNew}
            >
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      <Card padding={false}>
        <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <TransactionFilters />
        </div>
        <TransactionList onEdit={handleEdit} />
      </Card>

      {role === 'admin' && (
        <TransactionForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingTransaction(null);
          }}
          onSubmit={handleSubmit}
          editTransaction={editingTransaction}
        />
      )}
    </div>
  );
}
