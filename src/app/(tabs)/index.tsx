import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppIcon from "../../components/AppIcon";
import ProfileMenu from "../../components/ProfileMenu";
import { useAuth } from "../../context/AuthContext";
import { transactions } from "../../data/transactions";

const StyledSafeAreaView = styled(SafeAreaView);

export default function HomeScreen() {
  const { user } = useAuth();
  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);

  return (
    <StyledSafeAreaView className="home-safeArea" edges={["top"]}>
      <ScrollView
        className="home-screen"
        contentContainerClassName="home-content"
        showsVerticalScrollIndicator={false}
      >
        <View className="home-header">
          <View>
            <Text className="home-greeting">Hi, {user?.name || 'there'} 👋</Text>
            <Text className="home-subtitle">
              A little clarity for your everyday.
            </Text>
          </View>
          <ProfileMenu />
        </View>

        <View className="home-budgetCard">
          <View className="home-monthRow">
            <Text className="home-month">September⌄</Text>
            <Text className="home-year">2026</Text>
          </View>

          <View className="home-totalsRow">
            <View className="home-totalColumn">
              <Text className="home-totalLabel">• Budget</Text>
              <Text className="home-totalAmount">$4,000.00</Text>
            </View>
            <View className="home-totalDivider" />
            <View className="home-totalColumn">
              <Text className="home-totalLabel">
                <Text className="home-greenDot">• </Text>Expenses
              </Text>
              <Text className="home-totalAmount home-expensesAmount">
                $1,600.00
              </Text>
            </View>
          </View>

          <View className="home-balanceCard">
            <View className="home-balanceText">
              <Text className="home-balanceLabel">Current Balance</Text>
              <Text className="home-balanceAmount">$2,400.00</Text>
              <Text className="home-balanceCaption">
                60% of your budget remaining
              </Text>
            </View>
            <View className="home-gauge">
              <View className="home-gaugeInner">
                <Text className="home-gaugeText">40%</Text>
              </View>
            </View>
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

        {transactions.map((transaction) => {
          const expanded = expandedTransactionId === transaction.id;

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
                  {transaction.date}
                </Text>
                <View className="home-transactionDetails">
                  <View className="home-categoryIcon">
                    <AppIcon
                      name={transaction.icon}
                      tintColor="#376A43"
                      size={18}
                    />
                  </View>
                  <View className="home-transactionText">
                    <Text className="home-categoryName">
                      {transaction.category}
                    </Text>
                    <Text className="home-description">
                      {transaction.transactionName}
                    </Text>
                  </View>
                </View>
                <Text className="home-amountText">{transaction.amount}</Text>
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
                    value={transaction.transactionName}
                  />
                  <DetailRow
                    label="Description"
                    value={transaction.description}
                  />
                  <DetailRow
                    label="Payment method"
                    value={transaction.paymentMethod}
                  />
                  <DetailRow label="Created at" value={transaction.createdAt} />
                </View>
              )}
            </View>
          );
        })}
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
