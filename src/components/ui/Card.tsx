import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export function Card({ children, className, padding = true, hover = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl bg-white dark:bg-slate-900 card-shadow',
        'border border-slate-100 dark:border-slate-800',
        hover && 'transition-shadow hover:shadow-lg dark:hover:shadow-2xl cursor-pointer',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
