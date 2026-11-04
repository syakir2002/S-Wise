import type { IconName } from '../components/AppIcon';

export type Transaction = {
  id: string;
  date: string;
  dateValue: string;
  category: string;
  transactionName: string;
  description: string;
  paymentMethod: string;
  createdAt: string;
  amount: string;
  icon: IconName;
};

export const transactions: Transaction[] = [
  {
    id: 'groceries-sep-24',
    date: 'Sep 24',
    dateValue: '2026-09-24',
    category: 'Groceries',
    transactionName: 'Whole Foods Market',
    description: 'Weekly groceries',
    paymentMethod: 'Visa •••• 4821',
    createdAt: '6:42 PM',
    amount: '−$186.40',
    icon: { ios: 'basket', android: 'shopping_basket', web: 'shopping_basket' },
  },
  {
    id: 'food-sep-23',
    date: 'Sep 23',
    dateValue: '2026-09-23',
    category: 'Food & drink',
    transactionName: 'Sunday Table',
    description: 'Dinner with friends',
    paymentMethod: 'Apple Pay',
    createdAt: '8:15 PM',
    amount: '−$68.60',
    icon: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  },
  {
    id: 'transport-sep-22',
    date: 'Sep 22',
    dateValue: '2026-09-22',
    category: 'Transport',
    transactionName: 'City transit pass',
    description: 'Monthly transit card',
    paymentMethod: 'Debit •••• 1092',
    createdAt: '9:05 AM',
    amount: '−$45.00',
    icon: { ios: 'tram', android: 'directions_bus', web: 'directions_bus' },
  },
  {
    id: 'subscriptions-sep-20',
    date: 'Sep 20',
    dateValue: '2026-09-20',
    category: 'Subscriptions',
    transactionName: 'Monthly memberships',
    description: 'Streaming and music plans',
    paymentMethod: 'Visa •••• 4821',
    createdAt: '12:00 AM',
    amount: '−$40.00',
    icon: { ios: 'arrow.triangle.2.circlepath', android: 'autorenew', web: 'autorenew' },
  },
  {
    id: 'housing-sep-01',
    date: 'Sep 01',
    dateValue: '2026-09-01',
    category: 'Housing',
    transactionName: 'Monthly rent',
    description: 'September apartment rent',
    paymentMethod: 'Bank transfer',
    createdAt: '10:30 AM',
    amount: '−$1,260.00',
    icon: { ios: 'house', android: 'home', web: 'home' },
  },
];
