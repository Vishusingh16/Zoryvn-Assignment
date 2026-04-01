# FinanceFlow — Personal Finance Dashboard

A clean, interactive, and beautifully designed finance dashboard built with modern frontend technologies. Track your financial activity, explore transactions, and gain insights into your spending patterns.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

---

## Features

### Dashboard Overview
- **Summary Cards** — Total Balance, Income, Expenses, and Savings Rate with month-over-month change indicators
- **Balance Trend** — Area chart showing cumulative balance growth over 6 months
- **Spending Breakdown** — Interactive donut chart with category-wise expense distribution
- **Income vs Expenses** — Monthly bar chart comparison
- **Recent Transactions** — Quick-access list of the latest 5 transactions

### Transactions
- Full transaction list with description, category, date, amount, and type
- **Search** — Filter by description or category name
- **Category Filter** — Filter by any expense or income category
- **Type Filter** — Filter by income or expense
- **Sorting** — Sort by date (newest/oldest), amount (highest/lowest), or category (A-Z)
- **Add/Edit/Delete** — Full CRUD operations (admin role only)
- **Export** — Download transactions as CSV or JSON

### Insights
- **Top Spending Category** — Identifies where you spend the most
- **Average Daily Spending** — Calculated across the entire dataset
- **Savings Rate** — Overall percentage of income saved
- **Monthly Expense Change** — Percentage change vs previous month
- **Top Spending Categories Chart** — Horizontal bar chart of top 6 categories
- **Savings Trend** — Line chart of net savings per month
- **Biggest Single Expense** — Highlights the largest individual transaction
- **Income Sources** — Progress bars showing income distribution
- **Monthly Comparison** — Visual side-by-side of current vs previous month spending

### Role-Based UI (RBAC)
- **Admin** — Can add, edit, and delete transactions
- **Viewer** — Read-only access; action buttons are hidden
- Switch roles via the toggle in the header

### Additional Features
- **Dark Mode** — Full dark theme with smooth transitions, persisted to local storage
- **Data Persistence** — Transactions and preferences saved to localStorage via Zustand persist
- **Responsive Design** — Fully responsive from mobile to widescreen; collapsible sidebar on mobile
- **Animations** — Smooth transitions and micro-interactions powered by Framer Motion
- **Empty States** — Graceful handling when no data or no filter results
- **Export Functionality** — Download your data as CSV or JSON files

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI library with functional components and hooks |
| **TypeScript** | Type safety across the entire codebase |
| **Vite 6** | Lightning-fast build tool and dev server |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **Zustand** | Lightweight state management with persistence |
| **Recharts** | Composable charting library built on D3 |
| **Framer Motion** | Production-ready animation library |
| **Lucide React** | Beautiful, consistent icon set |
| **date-fns** | Modern date utility library |

---

## Getting Started

### Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd financeflow-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard page components
│   │   ├── BalanceTrend.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── IncomeExpenseChart.tsx
│   │   ├── RecentTransactions.tsx
│   │   ├── SpendingBreakdown.tsx
│   │   └── SummaryCards.tsx
│   ├── insights/           # Insights page
│   │   └── InsightsPage.tsx
│   ├── layout/             # App shell
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   ├── transactions/       # Transactions page
│   │   ├── TransactionFilters.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   └── TransactionsPage.tsx
│   └── ui/                 # Reusable UI primitives
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       ├── Modal.tsx
│       └── Select.tsx
├── data/
│   └── mockData.ts         # Realistic 6-month transaction dataset
├── store/
│   └── useStore.ts         # Zustand store with persistence
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   ├── cn.ts               # Tailwind class merge utility
│   └── helpers.ts          # Formatting, calculations, exports
├── App.tsx
├── index.css
└── main.tsx
```

---

## Design Decisions

### State Management
Chose **Zustand** for its minimal boilerplate, excellent TypeScript support, and built-in persistence middleware. The single store manages transactions, UI state (page, sidebar, dark mode), user role, and filters — keeping data flow predictable without the overhead of Redux.

### Component Architecture
Components are organized by feature domain (dashboard, transactions, insights) with shared UI primitives extracted into a `ui/` directory. Each page component composes smaller, focused sub-components for maintainability.

### Styling Approach
**Tailwind CSS** provides consistent spacing, typography, and color tokens. A `cn()` utility (clsx + tailwind-merge) handles conditional class composition cleanly. Custom CSS is minimal — just scrollbar styling and glass-morphism effects.

### Data Flow
Mock data simulates 6 months of realistic transactions (94 records). All filtering, sorting, and aggregation happens client-side with memoized computations to keep re-renders efficient.

### Responsiveness
The layout uses a fixed sidebar on desktop (lg+) and a slide-out overlay on mobile. Grids adapt from 1-column (mobile) to 2-column (tablet) to 4-column (desktop). All components use relative sizing and proper truncation.

---

## Screenshots

The dashboard includes three main views:

1. **Dashboard** — Overview with summary cards, balance trend, spending breakdown, income vs expenses chart, and recent transactions
2. **Transactions** — Searchable, filterable, sortable transaction list with CRUD operations
3. **Insights** — Analytics cards, category charts, savings trends, and monthly comparisons

---


