import { Menu, Moon, Sun, Shield, Eye } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Role } from '../../types';
import { cn } from '../../utils/cn';

export function Header() {
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);

  return (
    <header
      className={cn(
        'sticky top-0 z-20 h-16 flex items-center justify-between px-4 lg:px-8',
        'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl',
        'border-b border-slate-200 dark:border-slate-800'
      )}
    >
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        {/* Role Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {(['admin', 'viewer'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                role === r
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              {r === 'admin' ? <Shield size={13} /> : <Eye size={13} />}
              {r === 'admin' ? 'Admin' : 'Viewer'}
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            'p-2 rounded-xl transition-colors',
            'text-slate-500 hover:text-slate-700 hover:bg-slate-100',
            'dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
          )}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
