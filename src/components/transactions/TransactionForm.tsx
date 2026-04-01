import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../types';
import type { Transaction, TransactionType, Category } from '../../types';
import { generateId } from '../../utils/helpers';
import { cn } from '../../utils/cn';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: Transaction) => void;
  editTransaction?: Transaction | null;
}

export function TransactionForm({
  open,
  onClose,
  onSubmit,
  editTransaction,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setDescription(editTransaction.description);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDate(editTransaction.date);
    } else {
      setType('expense');
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]!);
    }
    setErrors({});
  }, [editTransaction, open]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) newErrors['description'] = 'Description is required';
    if (!amount || parseFloat(amount) <= 0) newErrors['amount'] = 'Enter a valid amount';
    if (!category) newErrors['category'] = 'Select a category';
    if (!date) newErrors['date'] = 'Select a date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const transaction: Transaction = {
      id: editTransaction?.id ?? generateId(),
      date,
      description: description.trim(),
      amount: parseFloat(amount),
      category: category as Category,
      type,
    };

    onSubmit(transaction);
    onClose();
  };

  const inputClass = cn(
    'w-full rounded-xl border border-slate-200 dark:border-slate-700',
    'bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100',
    'px-3 py-2.5',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
    'transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500'
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editTransaction ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
            Type
          </label>
          <div className="flex gap-2">
            {(['expense', 'income'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  setCategory('');
                }}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border',
                  type === t
                    ? t === 'income'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                      : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                )}
              >
                {t === 'income' ? 'Income' : 'Expense'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Grocery shopping at Whole Foods"
            className={cn(inputClass, errors['description'] && 'border-rose-300 dark:border-rose-700')}
          />
          {errors['description'] && (
            <p className="text-xs text-rose-500 mt-1">{errors['description']}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={cn(inputClass, errors['amount'] && 'border-rose-300 dark:border-rose-700')}
            />
            {errors['amount'] && (
              <p className="text-xs text-rose-500 mt-1">{errors['amount']}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={cn(inputClass, errors['date'] && 'border-rose-300 dark:border-rose-700')}
            />
            {errors['date'] && (
              <p className="text-xs text-rose-500 mt-1">{errors['date']}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={cn(
              inputClass,
              'cursor-pointer appearance-none',
              errors['category'] && 'border-rose-300 dark:border-rose-700'
            )}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors['category'] && (
            <p className="text-xs text-rose-500 mt-1">{errors['category']}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {editTransaction ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
