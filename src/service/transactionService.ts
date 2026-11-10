import { api } from './apiClient';
import type { IconName } from '../components/AppIcon';

export type ApiCategory = {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon?: string | null;
};

export type ApiTransaction = {
  id: number;
  user_id: number;
  amount: string;
  category_id: number;
  payment_method: string;
  description: string;
  transaction_date: string;
  updated_at?: string;
  category?: ApiCategory;
};

export type DashboardSummary = {
  current_balance: number;
  total_income: number;
  total_expenses: number;
  this_month_income: number;
  this_month_expenses: number;
  month_name: string;
  year: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  recent_transactions: ApiTransaction[];
};

export type CreateTransactionPayload = {
  type: 'income' | 'expense';
  amount: number | string;
  category_id: number;
  payment_method: string;
  description: string;
  transaction_date: string;
  notes?: string;
};

type TransactionChangeListener = () => void;
const changeListeners = new Set<TransactionChangeListener>();

export const defaultCategories: ApiCategory[] = [
  { id: 1, name: 'Food & Drinks', type: 'expense', icon: 'bi-cup-hot' },
  { id: 2, name: 'Transportation', type: 'expense', icon: 'bi-car-front' },
  { id: 3, name: 'Shopping', type: 'expense', icon: 'bi-bag' },
  { id: 4, name: 'Bills & Utilities', type: 'expense', icon: 'bi-lightning-charge' },
  { id: 5, name: 'Entertainment', type: 'expense', icon: 'bi-controller' },
  { id: 6, name: 'Education', type: 'expense', icon: 'bi-book' },
  { id: 7, name: 'Health', type: 'expense', icon: 'bi-heart-pulse' },
  { id: 8, name: 'Travel', type: 'expense', icon: 'bi-airplane' },
  { id: 9, name: 'Groceries', type: 'expense', icon: 'bi-cart' },
  { id: 10, name: 'Other', type: 'expense', icon: 'bi-three-dots' },
  { id: 11, name: 'Salary', type: 'income', icon: 'bi-cash-stack' },
  { id: 12, name: 'Allowance', type: 'income', icon: 'bi-wallet' },
  { id: 13, name: 'Freelance', type: 'income', icon: 'bi-laptop' },
  { id: 14, name: 'Business', type: 'income', icon: 'bi-graph-up-arrow' },
  { id: 15, name: 'Gift', type: 'income', icon: 'bi-gift' },
  { id: 16, name: 'Other Income', type: 'income', icon: 'bi-piggy-bank' },
];

export const defaultPaymentMethods = [
  'Cash',
  'Debit Card',
  'Credit Card',
  'Online Banking',
  'E-Wallet',
  'Bank Transfer',
  'Other',
];

export const transactionService = {
  getDashboard: async (): Promise<DashboardData> => {
    return api.get<DashboardData>('/api/dashboard');
  },

  getRecent: async (): Promise<DashboardData> => {
    return api.get<DashboardData>('/api/transactions/recent');
  },

  getAll: async (page = 1): Promise<{ data: ApiTransaction[]; current_page: number; last_page: number }> => {
    return api.get('/api/transactions', { params: { page } });
  },

  getCategories: async (type?: 'income' | 'expense'): Promise<ApiCategory[]> => {
    try {
      const data = await api.get<ApiCategory[]>('/api/categories', { params: { type } });
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback if offline or endpoint not yet configured
    }
    return defaultCategories.filter((cat) => !type || cat.type === type);
  },

  create: async (payload: CreateTransactionPayload): Promise<{ message: string; transaction: ApiTransaction }> => {
    const res = await api.post<{ message: string; transaction: ApiTransaction }>('/api/transactions', payload);
    transactionService.notifyChange();
    return res;
  },

  onTransactionChanged: (listener: TransactionChangeListener) => {
    changeListeners.add(listener);
    return () => {
      changeListeners.delete(listener);
    };
  },

  notifyChange: () => {
    changeListeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error notifying transaction change:', err);
      }
    });
  },
};

/**
 * Maps category name or icon identifier to an AppIcon name
 */
export function getCategoryIcon(categoryName?: string, icon?: string | null): IconName {
  const name = (categoryName || '').toLowerCase();
  const iconStr = (icon || '').toLowerCase();

  if (iconStr.includes('cup') || name.includes('food') || name.includes('drink') || name.includes('makan')) {
    return { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' };
  }
  if (iconStr.includes('cart') || iconStr.includes('basket') || name.includes('grocer') || name.includes('pasar')) {
    return { ios: 'basket', android: 'shopping_basket', web: 'shopping_basket' };
  }
  if (iconStr.includes('bag') || name.includes('shop') || name.includes('beli')) {
    return { ios: 'bag', android: 'shopping_basket', web: 'shopping_basket' };
  }
  if (iconStr.includes('car') || iconStr.includes('bus') || name.includes('transport') || name.includes('travel')) {
    return { ios: 'car', android: 'directions_bus', web: 'directions_bus' };
  }
  if (iconStr.includes('lightning') || name.includes('bill') || name.includes('utilit') || name.includes('electric')) {
    return { ios: 'bolt', android: 'auto_awesome', web: 'auto_awesome' };
  }
  if (iconStr.includes('wallet') || iconStr.includes('cash') || name.includes('allowance') || name.includes('salary') || name.includes('income')) {
    return { ios: 'dollarsign', android: 'attach_money', web: 'attach_money' };
  }
  if (iconStr.includes('heart') || name.includes('health') || name.includes('med')) {
    return { ios: 'heart', android: 'help', web: 'help' };
  }
  if (iconStr.includes('controller') || name.includes('entertain') || name.includes('game')) {
    return { ios: 'gamecontroller', android: 'play_circle', web: 'play_circle' };
  }
  if (iconStr.includes('book') || name.includes('educat') || name.includes('school')) {
    return { ios: 'book', android: 'info', web: 'info' };
  }

  return { ios: 'creditcard', android: 'tune', web: 'tune' };
}

/**
 * Formats ISO or YYYY-MM-DD date into "Nov 03" or "Sep 28"
 */
export function formatTransactionDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // If format is like "2026-09-28"
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${months[monthIdx] || parts[1]} ${parts[2]}`;
    }
    return dateStr;
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Formats date into DD/MM/YYYY (e.g. 03/11/2026)
 */
export function formatFullDate(dateStr: string): string {
  if (!dateStr) return '-';
  const cleanDateStr = dateStr.split('T')[0];
  const parts = cleanDateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

/**
 * Formats amount into currency representation, e.g. RM 6,000.00
 */
export function formatCurrency(amount: string | number, type: 'income' | 'expense' = 'expense'): string {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const formatted = num.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = type === 'income' ? '+RM ' : '−RM ';
  return `${prefix}${formatted}`;
}

