// Import Supabase types
import type { User as SupabaseUser, Invoice, Receipt, Feedback, CreditScore } from './database'

// User and Authentication Types (extending Supabase User)
export interface User extends SupabaseUser {
  name?: string;
  avatar?: string;
  role?: UserRole;
  isVerified?: boolean;
  preferences?: UserPreferences;
}

// Keep existing User interface for backwards compatibility
export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  preferences: UserPreferences;
}

export type UserRole = "admin" | "user" | "premium";

export interface UserPreferences {
  currency: string;
  timezone: string;
  notifications: NotificationSettings;
  theme: "light" | "dark" | "system";
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  transactions: boolean;
  budgetAlerts: boolean;
  investmentUpdates: boolean;
}

// Financial Types
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  institution?: string;
  accountNumber?: string;
}

export type AccountType = 
  | "checking" 
  | "savings" 
  | "credit" 
  | "investment" 
  | "retirement" 
  | "loan";

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  category: Category;
  type: TransactionType;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  location?: string;
  recurring?: RecurringPattern;
}

export type TransactionType = "income" | "expense" | "transfer";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  parentId?: string;
  isCustom: boolean;
}

export interface RecurringPattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  endDate?: Date;
  nextDate: Date;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  name: string;
  period: BudgetPeriod;
  categories: BudgetCategory[];
  totalLimit: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BudgetPeriod = "weekly" | "monthly" | "quarterly" | "yearly";

export interface BudgetCategory {
  categoryId: string;
  limit: number;
  spent: number;
  remaining: number;
}

// Investment Types
export interface Investment {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  currency: string;
  purchaseDate: Date;
  lastUpdated: Date;
}

export type InvestmentType = "stock" | "bond" | "etf" | "crypto" | "commodity";

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  investments: Investment[];
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// Goal Types
export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: Date;
  category: GoalCategory;
  priority: GoalPriority;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalCategory = 
  | "emergency_fund" 
  | "vacation" 
  | "home" 
  | "car" 
  | "education" 
  | "retirement" 
  | "debt_payoff" 
  | "other";

export type GoalPriority = "low" | "medium" | "high";

// Analytics Types
export interface AnalyticsData {
  period: AnalyticsPeriod;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  categoryBreakdown: CategoryAnalytics[];
  monthlyTrends: MonthlyTrend[];
  topCategories: TopCategory[];
}

export type AnalyticsPeriod = "week" | "month" | "quarter" | "year";

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  netIncome: number;
}

export interface TopCategory {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface CreateTransactionForm {
  accountId: string;
  amount: number;
  description: string;
  categoryId: string;
  type: TransactionType;
  date: string;
  tags?: string[];
}

export interface CreateBudgetForm {
  name: string;
  period: BudgetPeriod;
  totalLimit: number;
  categories: {
    categoryId: string;
    limit: number;
  }[];
  startDate: string;
  endDate: string;
}

export interface CreateGoalForm {
  name: string;
  description?: string;
  targetAmount: number;
  targetDate: string;
  category: GoalCategory;
  priority: GoalPriority;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

// Utility Types
export type LoadingState = "idle" | "loading" | "succeeded" | "failed";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface FilterOptions {
  categories?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  accountIds?: string[];
  transactionTypes?: TransactionType[];
} 