import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { groupByCategory, formatCurrency } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../types';

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.payload.fill }}
        />
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {data.name}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
        {formatCurrency(data.value)}
      </p>
    </div>
  );
}

export function SpendingBreakdown() {
  const transactions = useStore((s) => s.transactions);

  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const categoryData = groupByCategory(expenseTransactions);
  const totalExpenses = categoryData.reduce((sum, c) => sum + c.amount, 0);

  const chartData = categoryData.slice(0, 8).map((c) => ({
    name: c.category,
    value: c.amount,
    percent: ((c.amount / totalExpenses) * 100).toFixed(1),
  }));

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Spending Breakdown
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Expenses by category
        </p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={CATEGORY_COLORS[entry.name] ?? '#94a3b8'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-2 max-h-[160px] overflow-y-auto pr-1">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[item.name] ?? '#94a3b8' }}
              />
              <span className="text-slate-600 dark:text-slate-400 truncate">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="font-medium text-slate-900 dark:text-white">
                {formatCurrency(item.value)}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 w-10 text-right">
                {item.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
