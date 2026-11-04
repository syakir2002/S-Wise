import AppIcon from '../../components/AppIcon';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileMenu from '../../components/ProfileMenu';
import { transactions } from '../../data/transactions';
import type { Transaction } from '../../data/transactions';

const StyledSafeAreaView = styled(SafeAreaView);

const colors = {
  background: '#F7F7F1',
  dark: '#1E2B24',
  muted: '#7D857E',
  line: '#E5E7E0',
  green: '#B8E779',
  paleGreen: '#E9F0E3',
};

const categories = ['All', ...new Set(transactions.map(({ category }) => category))];
const paymentMethods = [
  'All',
  ...new Set(transactions.map(({ paymentMethod }) => paymentMethod)),
];
const months = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];
const years = [...new Set(transactions.map(({ dateValue }) => dateValue.slice(0, 4)))];
const days = Array.from({ length: 31 }, (_, index) =>
  String(index + 1).padStart(2, '0'),
);

type TransactionFilters = {
  year: string | null;
  month: string | null;
  day: string | null;
  paymentMethod: string | null;
  category: string | null;
};

type TransactionBreakdown = {
  label: string;
  count: number;
  amount: number;
};

const emptyFilters: TransactionFilters = {
  year: null,
  month: null,
  day: null,
  paymentMethod: null,
  category: null,
};

export default function TransactionScreen() {
  const [search, setSearch] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<TransactionFilters>(emptyFilters);
  const [draftFilters, setDraftFilters] = useState<TransactionFilters>(emptyFilters);
  const [expandedTransactionId, setExpandedTransactionId] = useState<string | null>(null);
  const [records, setRecords] = useState<Transaction[]>(() => [...transactions]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedAmount, setEditedAmount] = useState('');

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;
  const breakdowns = useMemo(() => {
    const summarizeBy = (key: 'category' | 'paymentMethod') => {
      const groups = new Map<string, TransactionBreakdown>();

      records.forEach((transaction) => {
        const label = transaction[key];
        const current = groups.get(label) ?? { label, count: 0, amount: 0 };
        current.count += 1;
        current.amount += Number(transaction.amount.replace(/[^\d.]/g, '')) || 0;
        groups.set(label, current);
      });

      return [...groups.values()].sort((first, second) => second.amount - first.amount);
    };

    return {
      categories: summarizeBy('category'),
      paymentMethods: summarizeBy('paymentMethod'),
    };
  }, [records]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((transaction) => {
      const matchesSearch =
        !query ||
        `${transaction.category} ${transaction.transactionName} ${transaction.description}`
          .toLowerCase()
          .includes(query);
      const matchesYear =
        !appliedFilters.year || transaction.dateValue.startsWith(`${appliedFilters.year}-`);
      const matchesMonth =
        !appliedFilters.month ||
        transaction.dateValue.slice(5, 7) === appliedFilters.month;
      const matchesDay =
        !appliedFilters.day || transaction.dateValue.slice(8, 10) === appliedFilters.day;
      const matchesPaymentMethod =
        !appliedFilters.paymentMethod ||
        transaction.paymentMethod === appliedFilters.paymentMethod;
      const matchesCategory =
        !appliedFilters.category || transaction.category === appliedFilters.category;

      return (
        matchesSearch &&
        matchesYear &&
        matchesMonth &&
        matchesDay &&
        matchesPaymentMethod &&
        matchesCategory
      );
    });
  }, [search, appliedFilters, records]);

  return (
    <StyledSafeAreaView className={"transactions-safeArea"} edges={['top']}>
      <ScrollView
        className={"transactions-screen"}
        contentContainerClassName={"transactions-content"}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className={"transactions-header"}>
          <View>
            <Text className={"transactions-title"}>Transaction</Text>
            <Text className={"transactions-headerSubtitle"}>Manage spending</Text>
          </View>
          <ProfileMenu />
        </View>

        <View className={"transactions-summaryCard"}>
          <View className={"transactions-monthRow"}>
            <View className={"transactions-monthLabel"}>
              <Text className={"transactions-month"}>September</Text>
              <AppIcon
                name={{ ios: 'chevron.down', android: 'arrow_drop_down', web: 'arrow_drop_down' }}
                tintColor="#BEC7BF"
                size={13}
              />
            </View>
            <Text className={"transactions-year"}>2026</Text>
          </View>

          <View className={"transactions-summaryContent"}>
            <View className={"transactions-chartColumn"}>
              <View className={"transactions-chart"}>
                <View className={"transactions-chartFill"} />
              </View>
              <Text className={"transactions-chartCaption"}>
                <Text className={"transactions-chartDot"}>• </Text>40% spent · 60% left
              </Text>
              <Text className={"transactions-balanceCaption"}>Balance left</Text>
              <Text className={"transactions-balanceAmount"}>$2,400.00</Text>
            </View>

            <View className={"transactions-summaryDivider"} />
            <View className={"transactions-totals"}>
              <SummaryMetric
                label="Expenses"
                amount="$1,600.00"
                highlighted
                buttonClassName={"transactions-expenseAddButton"}
                iconColor={colors.dark}
              />
              <View className={"transactions-metricDivider"} />
              <SummaryMetric
                label="Budget"
                amount="$4,000.00"
                action="update"
                buttonClassName={"transactions-budgetUpdateButton"}
                iconColor="#D3DDD4"
              />
            </View>
          </View>
        </View>

        <View className={"transactions-breakdownCard"}>
          <View className={"transactions-breakdownHeader"}>
            <View>
              <Text className={"transactions-breakdownTitle"}>Spending breakdown</Text>
              <Text className={"transactions-breakdownSubtitle"}>
                {records.length} {records.length === 1 ? 'transaction' : 'transactions'} in total
              </Text>
            </View>
            <View className={"transactions-breakdownHeaderIcon"}>
              <AppIcon
                name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
                tintColor="#376A43"
                size={17}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            contentContainerClassName={"transactions-breakdownItems"}
            showsHorizontalScrollIndicator={false}>
            {breakdowns.categories.map((item) => (
              <BreakdownItem key={`category-${item.label}`} item={item} type="Category" />
            ))}
            {breakdowns.paymentMethods.map((item) => (
              <BreakdownItem
                key={`payment-${item.label}`}
                item={item}
                type="Payment"
              />
            ))}
          </ScrollView>
        </View>

        <View className={"transactions-sectionHeader"}>
          <Text className={"transactions-sectionTitle"}>Record</Text>
          <Text className={"transactions-recordCount"}>{filteredTransactions.length} transactions</Text>
        </View>

        <View className={"transactions-searchRow"}>
          <View className={"transactions-searchField"}>
            <AppIcon
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              tintColor="#828B83"
              size={17}
            />
            <TextInput
              accessibilityLabel="Search transactions"
              onChangeText={setSearch}
              placeholder="Search transactions"
              placeholderTextColor="#8C948E"
              returnKeyType="search"
              className={"transactions-searchInput"}
              value={search}
            />
            {search.length > 0 && (
              <Pressable
                accessibilityLabel="Clear search"
                accessibilityRole="button"
                onPress={() => setSearch('')}
                hitSlop={8}>
                <AppIcon
                  name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                  tintColor="#929A93"
                  size={17}
                />
              </Pressable>
            )}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
            onPress={() => {
              setDraftFilters(appliedFilters);
              setFiltersVisible(true);
            }}
            className={["transactions-filterButton", (activeFilterCount > 0 ? "transactions-filterButtonActive" : "")].filter(Boolean).join(' ')}>
            <AppIcon
              name={{ ios: 'line.3.horizontal.decrease', android: 'filter_list', web: 'filter_list' }}
              tintColor={activeFilterCount > 0 ? '#FFFFFF' : colors.dark}
              size={19}
            />
            {activeFilterCount > 0 && <View className={"transactions-filterIndicator"} />}
          </Pressable>
        </View>

        <View className={"transactions-listHeader"}>
          <Text className={"transactions-listHeaderText transactions-dateColumn"}>Date</Text>
          <Text className={"transactions-listHeaderText"}>Category</Text>
          <Text className={"transactions-listHeaderText transactions-amountColumn"}>Amount</Text>
        </View>

        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => {
            const expanded = expandedTransactionId === transaction.id;

            return (
              <View key={transaction.id} className={"transactions-transactionContainer"}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  onPress={() =>
                    setExpandedTransactionId(expanded ? null : transaction.id)
                  }
                  className={"transactions-transactionRow"}>
                  <Text className={"transactions-dateText transactions-dateColumn"}>{transaction.date}</Text>
                  <View className={"transactions-transactionDetails"}>
                    <View className={"transactions-categoryIcon"}>
                      <AppIcon name={transaction.icon} tintColor="#376A43" size={17} />
                    </View>
                    <View className={"transactions-transactionText"}>
                      <Text numberOfLines={1} className={"transactions-categoryName"}>
                        {transaction.category}
                      </Text>
                      <Text numberOfLines={1} className={"transactions-description"}>
                        {transaction.transactionName}
                      </Text>
                    </View>
                  </View>
                  <Text className={"transactions-amountText"}>{transaction.amount}</Text>
                </Pressable>
                {expanded && (
                  <View className={"transactions-transactionExpanded"}>
                    <DetailRow label="Description" value={transaction.description} />
                    <DetailRow label="Payment method" value={transaction.paymentMethod} />
                    <DetailRow label="Time" value={transaction.createdAt} />
                    <View className={"transactions-transactionActions"}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${transaction.category} transaction`}
                        onPress={() => {
                          setEditingTransaction(transaction);
                          setEditedName(transaction.transactionName);
                          setEditedAmount(transaction.amount);
                        }}
                        className={"transactions-editTransactionButton"}>
                        <AppIcon
                          name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                          tintColor={colors.dark}
                          size={14}
                        />
                        <Text className={"transactions-editTransactionText"}>Edit</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${transaction.category} transaction`}
                        onPress={() =>
                          Alert.alert(
                            'Delete transaction?',
                            `Remove ${transaction.transactionName} from your records?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => {
                                  setRecords((current) =>
                                    current.filter((record) => record.id !== transaction.id),
                                  );
                                  setExpandedTransactionId(null);
                                },
                              },
                            ],
                          )
                        }
                        className={"transactions-deleteTransactionButton"}>
                        <AppIcon
                          name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                          tintColor="#B8473F"
                          size={14}
                        />
                        <Text className={"transactions-deleteTransactionText"}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View className={"transactions-emptyState"}>
            <View className={"transactions-emptyIcon"}>
              <AppIcon
                name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                tintColor={colors.muted}
                size={20}
              />
            </View>
            <Text className={"transactions-emptyTitle"}>No transactions found</Text>
            <Text className={"transactions-emptyDescription"}>Try another search or category.</Text>
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        onRequestClose={() => setFiltersVisible(false)}
        transparent
        visible={filtersVisible}>
        <View className={"transactions-modalOverlay"}>
          <Pressable
            accessibilityLabel="Close filters"
            accessibilityRole="button"
            onPress={() => setFiltersVisible(false)}
            className={"transactions-modalBackdrop"}
          />
          <View className={"transactions-filterSheet"}>
            <View className={"transactions-sheetHandle"} />
            <View className={"transactions-sheetHeader"}>
              <View>
                <Text className={"transactions-sheetTitle"}>Filter transactions</Text>
                <Text className={"transactions-sheetSubtitle"}>Choose what you want to see</Text>
              </View>
              <Pressable
                accessibilityLabel="Close filters"
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => setFiltersVisible(false)}
                className={"transactions-closeButton"}>
                <AppIcon
                  name={{ ios: 'xmark', android: 'close', web: 'close' }}
                  tintColor={colors.dark}
                  size={15}
                />
              </Pressable>
            </View>

            <ScrollView
              className={"transactions-filterOptions"}
              contentContainerClassName={"transactions-filterOptionsContent"}
              showsVerticalScrollIndicator={false}>
              <FilterChoiceSection
                title="Year"
                options={[
                  { label: 'Any year', value: null },
                  ...years.map((year) => ({ label: year, value: year })),
                ]}
                selectedValue={draftFilters.year}
                onSelect={(value) =>
                  setDraftFilters((current) => ({ ...current, year: value }))
                }
              />
              <FilterChoiceSection
                title="Month"
                options={[
                  { label: 'Any month', value: null },
                  ...months.map((month) => ({ label: month.label, value: month.value })),
                ]}
                selectedValue={draftFilters.month}
                onSelect={(value) =>
                  setDraftFilters((current) => ({ ...current, month: value }))
                }
              />
              <FilterChoiceSection
                title="Specific day"
                options={[
                  { label: 'Any day', value: null },
                  ...days.map((day) => ({ label: day, value: day })),
                ]}
                selectedValue={draftFilters.day}
                onSelect={(value) =>
                  setDraftFilters((current) => ({ ...current, day: value }))
                }
              />
              <FilterChoiceSection
                title="Payment method"
                options={[
                  { label: 'Any method', value: null },
                  ...paymentMethods
                    .filter((method) => method !== 'All')
                    .map((method) => ({ label: method, value: method })),
                ]}
                selectedValue={draftFilters.paymentMethod}
                onSelect={(value) =>
                  setDraftFilters((current) => ({ ...current, paymentMethod: value }))
                }
              />
              <FilterChoiceSection
                title="Category"
                options={[
                  { label: 'Any category', value: null },
                  ...categories
                    .filter((category) => category !== 'All')
                    .map((category) => ({ label: category, value: category })),
                ]}
                selectedValue={draftFilters.category}
                onSelect={(value) =>
                  setDraftFilters((current) => ({ ...current, category: value }))
                }
              />
            </ScrollView>

            <View className={"transactions-sheetActions"}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDraftFilters(emptyFilters)}
                className={"transactions-resetButton"}>
                <Text className={"transactions-resetButtonText"}>Reset</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setAppliedFilters(draftFilters);
                  setFiltersVisible(false);
                }}
                className={"transactions-applyButton"}>
                <Text className={"transactions-applyButtonText"}>Apply filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        onRequestClose={() => setEditingTransaction(null)}
        transparent
        visible={editingTransaction !== null}>
        <View className={"transactions-editModalOverlay"}>
          <Pressable
            accessibilityLabel="Cancel editing transaction"
            accessibilityRole="button"
            onPress={() => setEditingTransaction(null)}
            className={"transactions-editModalBackdrop"}
          />
          <View className={"transactions-editDialog"}>
            <Text className={"transactions-editDialogTitle"}>Edit transaction</Text>
            <Text className={"transactions-editFieldLabel"}>Name</Text>
            <TextInput
              accessibilityLabel="Transaction name"
              onChangeText={setEditedName}
              className={"transactions-editInput"}
              value={editedName}
            />
            <Text className={"transactions-editFieldLabel"}>Amount</Text>
            <TextInput
              accessibilityLabel="Transaction amount"
              keyboardType="decimal-pad"
              onChangeText={setEditedAmount}
              className={"transactions-editInput"}
              value={editedAmount}
            />
            <View className={"transactions-editDialogActions"}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setEditingTransaction(null)}
                className={"transactions-editCancelButton"}>
                <Text className={"transactions-editCancelText"}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!editedName.trim() || !editedAmount.trim()}
                onPress={() => {
                  if (!editingTransaction) return;

                  setRecords((current) =>
                    current.map((record) =>
                      record.id === editingTransaction.id
                        ? {
                            ...record,
                            transactionName: editedName.trim(),
                            amount: editedAmount.trim(),
                          }
                        : record,
                    ),
                  );
                  setEditingTransaction(null);
                }}
                className={["transactions-editSaveButton", ((!editedName.trim() || !editedAmount.trim()) ? "transactions-editSaveButtonDisabled" : "")].filter(Boolean).join(' ')}>
                <Text className={"transactions-editSaveText"}>Save changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </StyledSafeAreaView>
  );
}

function FilterChoiceSection({
  title,
  options,
  selectedValue,
  onSelect,
}: {
  title: string;
  options: { label: string; value: string | null }[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <View className={"transactions-filterSection"}>
      <Text className={"transactions-filterSectionTitle"}>{title}</Text>
      <ScrollView
        horizontal
        contentContainerClassName={"transactions-filterChoices"}
        showsHorizontalScrollIndicator={false}>
        {options.map((option) => {
          const selected = selectedValue === option.value;

          return (
            <Pressable
              key={option.value ?? 'any'}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelect(option.value)}
              className={["transactions-filterChoice", (selected ? "transactions-filterChoiceSelected" : "")].filter(Boolean).join(' ')}>
              <Text
                className={["transactions-filterChoiceText", (selected ? "transactions-filterChoiceTextSelected" : "")].filter(Boolean).join(' ')}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function BreakdownItem({ item, type }: { item: TransactionBreakdown; type: string }) {
  return (
    <View className={"transactions-breakdownItem"}>
      <Text className={"transactions-breakdownItemType"}>{type}</Text>
      <Text numberOfLines={1} className={"transactions-breakdownItemLabel"}>
        {item.label}
      </Text>
      <Text className={"transactions-breakdownItemCount"}>
        {item.count} {item.count === 1 ? 'item' : 'items'}
      </Text>
      <Text className={"transactions-breakdownItemAmount"}>{formatAmount(item.amount)}</Text>
    </View>
  );
}

function formatAmount(amount: number) {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function SummaryMetric({
  label,
  amount,
  highlighted = false,
  action = 'add',
  buttonClassName,
  iconColor,
}: {
  label: string;
  amount: string;
  highlighted?: boolean;
  action?: 'add' | 'update';
  buttonClassName: string;
  iconColor: string;
}) {
  return (
    <View className={"transactions-metric"}>
      <View className={"transactions-metricText"}>
        <Text className={"transactions-metricLabel"}>{label}</Text>
        <Text className={["transactions-metricAmount", (highlighted ? "transactions-metricAmountHighlighted" : "")].filter(Boolean).join(' ')}>
          {amount}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${action === 'add' ? 'Add' : 'Update'} ${label.toLowerCase()}`}
        hitSlop={8}
        className={`transactions-metricActionButton ${buttonClassName}`}>
        <AppIcon
          name={
            action === 'add'
              ? { ios: 'plus', android: 'add', web: 'add' }
              : { ios: 'pencil', android: 'edit', web: 'edit' }
          }
          tintColor={iconColor}
          size={17}
        />
      </Pressable>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className={"transactions-detailRow"}>
      <Text className={"transactions-detailLabel"}>{label}</Text>
      <Text className={"transactions-detailValue"}>{value}</Text>
    </View>
  );
}
