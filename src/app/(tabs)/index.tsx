import { router, useFocusEffect } from "expo-router";
import { styled } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import AppIcon from "../../components/AppIcon";
import ProfileMenu from "../../components/ProfileMenu";
import { useAuth } from "../../context/AuthContext";
import {
  formatCurrency,
  formatFullDate,
  formatTransactionDate,
  getCategoryIcon,
  transactionService,
  type ApiTransaction,
  type DashboardSummary,
} from "../../service/transactionService";

const StyledSafeAreaView = styled(SafeAreaView);

export default function HomeScreen() {
  const { user } = useAuth();
  const [expandedTransactionId, setExpandedTransactionId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await transactionService.getDashboard();
      if (data) {
        setTransactions(data.recent_transactions || []);
        setSummary(data.summary || null);
      }
    } catch (error) {
      console.warn("[HomeScreen] Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  useEffect(() => {
    const unsubscribe = transactionService.onTransactionChanged(() => {
      fetchDashboardData();
    });
    return unsubscribe;
  }, [fetchDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalIncome = summary?.total_income ?? 0;
  const totalExpenses = summary?.total_expenses ?? 0;
  const currentBalance = summary?.current_balance ?? 0;

  // Percentage of income already used/spent
  const usedPercent =
    totalIncome > 0
      ? Math.round((totalExpenses / totalIncome) * 100)
      : totalExpenses > 0
        ? 100
        : 0;

  // Percentage of income remaining
  const remainingPercent =
    totalIncome > 0
      ? Math.max(0, Math.round((currentBalance / totalIncome) * 100))
      : 0;

  return (
    <StyledSafeAreaView className="home-safeArea" edges={["top"]}>
      <ScrollView
        className="home-screen"
        contentContainerClassName="home-content"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#376A43"
            colors={["#376A43"]}
          />
        }
      >
        <View className="home-header">
          <View>
            <Text className="home-greeting">Hi, {user?.name || "there"} 👋</Text>
            <Text className="home-subtitle">
              A little clarity for your everyday.
            </Text>
          </View>
          <ProfileMenu />
        </View>

        <View className="home-budgetCard">
          <View className="home-monthRow">
            <Text className="home-month">{summary?.month_name || "November"}</Text>
            <Text className="home-year">{summary?.year || 2026}</Text>
          </View>

          <View className="home-totalsRow">
            <View className="home-totalColumn">
              <Text className="home-totalLabel">• Budget</Text>
              <Text className="home-totalAmount">
                RM {totalIncome.toLocaleString("en-MY", { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View className="home-totalDivider" />
            <View className="home-totalColumn">
              <Text className="home-totalLabel">
                <Text className="home-greenDot">• </Text>Expenses
              </Text>
              <Text className="home-totalAmount home-expensesAmount">
                RM {totalExpenses.toLocaleString("en-MY", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          <View className="home-balanceCard">
            <View className="home-balanceText">
              <Text className="home-balanceLabel">Current Balance</Text>
              <Text className="home-balanceAmount">
                RM {currentBalance.toLocaleString("en-MY", { minimumFractionDigits: 2 })}
              </Text>
              <Text className="home-balanceCaption">
                {totalIncome > 0
                  ? `${remainingPercent}% of your budget remaining`
                  : "Track your income and expenses"}
              </Text>
            </View>
            <ProgressGauge percent={usedPercent} />
          </View>
        </View>

        <View className="home-sectionHeader">
          <Text className="home-sectionTitle">Recent Transactions</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View all transactions"
            onPress={() => router.navigate("/transaction")}
          >
            <Text className="home-viewAllText">View all ↗</Text>
          </Pressable>
        </View>

        <View className="home-listHeader">
          <Text className="home-listHeaderText home-dateColumn">Date</Text>
          <Text className="home-listHeaderText">Category</Text>
          <Text className="home-listHeaderText home-amountColumn">Amount</Text>
        </View>

        {isLoading && transactions.length === 0 ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator size="small" color="#376A43" />
            <Text className="text-stone-500 text-xs mt-2">
              Loading transactions from database...
            </Text>
          </View>
        ) : transactions.length === 0 ? (
          <View className="py-8 items-center justify-center">
            <Text className="text-stone-500 text-sm">No transactions found.</Text>
          </View>
        ) : (
          transactions.map((transaction) => {
            const expanded = expandedTransactionId === transaction.id;
            const isIncome = transaction.category?.type === "income";
            const icon = getCategoryIcon(
              transaction.category?.name,
              transaction.category?.icon
            );

            return (
              <View key={transaction.id} className="home-transactionContainer">
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  onPress={() =>
                    setExpandedTransactionId(expanded ? null : transaction.id)
                  }
                  className="home-transactionRow"
                >
                  <Text className="home-dateText home-dateColumn">
                    {formatTransactionDate(transaction.transaction_date)}
                  </Text>
                  <View className="home-transactionDetails">
                    <View className="home-categoryIcon">
                      <AppIcon
                        name={icon}
                        tintColor={isIncome ? "#2E7D32" : "#376A43"}
                        size={18}
                      />
                    </View>
                    <View className="home-transactionText">
                      <Text className="home-categoryName">
                        {transaction.category?.name || "General"}
                      </Text>
                      <Text className="home-description">
                        {transaction.description || "Transaction"}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`home-amountText ${isIncome ? "text-emerald-700 font-semibold" : ""
                      }`}
                  >
                    {formatCurrency(
                      transaction.amount,
                      transaction.category?.type || "expense"
                    )}
                  </Text>
                  <AppIcon
                    name={{
                      ios: expanded ? "chevron.up" : "chevron.down",
                      android: expanded ? "expand_less" : "expand_more",
                      web: expanded ? "expand_less" : "expand_more",
                    }}
                    tintColor="#7D857E"
                    size={16}
                  />
                </Pressable>
                {expanded && (
                  <View className="home-transactionExpanded">
                    <DetailRow
                      label="Transaction"
                      value={transaction.description || "-"}
                    />
                    <DetailRow
                      label="Category"
                      value={transaction.category?.name || "-"}
                    />
                    <DetailRow
                      label="Payment method"
                      value={transaction.payment_method || "-"}
                    />
                    <DetailRow
                      label="Date"
                      value={formatFullDate(transaction.transaction_date)}
                    />
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </StyledSafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="home-detailRow">
      <Text className="home-detailLabel">{label}</Text>
      <Text className="home-detailValue">{value}</Text>
    </View>
  );
}

function ProgressGauge({ percent }: { percent: number }) {
  const size = 58;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const strokeDashoffset =
    circumference - (circumference * clampedPercent) / 100;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
      >
        {/* Track circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#44544A"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Active progress arc in vibrant green */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#B8E779"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: "#1E2B24",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#B8E779",
            fontSize: 10,
            fontWeight: "700",
          }}
        >
          {percent}%
        </Text>
      </View>
    </View>
  );
}
