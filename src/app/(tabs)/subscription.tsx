import { styled } from "nativewind";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppIcon, { type IconName } from "../../components/AppIcon";
import ProfileMenu from "../../components/ProfileMenu";

const StyledSafeAreaView = styled(SafeAreaView);

const colors = {
  background: "#F7F7F1",
  dark: "#1E2B24",
  muted: "#7D857E",
  line: "#E8EBE4",
  green: "#B8E779",
  paleGreen: "#E9F0E3",
};

type Subscription = {
  id: string;
  name: string;
  category: string;
  renewal: string;
  monthlyCost: number;
  icon: IconName;
  iconColor: string;
  iconBackground: string;
};

const initialSubscriptions: Subscription[] = [
  {
    id: "netflix",
    name: "Netflix",
    category: "Streaming",
    renewal: "Nov 08",
    monthlyCost: 15.49,
    icon: {
      ios: "play.rectangle.fill",
      android: "play_circle",
      web: "play_circle",
    },
    iconColor: "#E50914",
    iconBackground: "#FCEBED",
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "Music",
    renewal: "Nov 12",
    monthlyCost: 10.99,
    icon: { ios: "music.note", android: "music_note", web: "music_note" },
    iconColor: "#168A50",
    iconBackground: "#E8F4EB",
  },
  {
    id: "icloud",
    name: "iCloud+",
    category: "Storage",
    renewal: "Nov 18",
    monthlyCost: 2.99,
    icon: { ios: "cloud.fill", android: "cloud", web: "cloud" },
    iconColor: "#4C8FD9",
    iconBackground: "#EAF2FC",
  },
  {
    id: "youtube",
    name: "YouTube Premium",
    category: "Streaming",
    renewal: "Nov 21",
    monthlyCost: 13.99,
    icon: { ios: "play.fill", android: "play_arrow", web: "play_arrow" },
    iconColor: "#E12B27",
    iconBackground: "#FCEBED",
  },
];

const categories = ["All", "Streaming", "Music", "Storage", "Other"];

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export default function SubscriptionScreen() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newRenewal, setNewRenewal] = useState("");
  const [formError, setFormError] = useState("");

  const filteredSubscriptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return subscriptions.filter((subscription) => {
      const matchesSearch =
        !query ||
        `${subscription.name} ${subscription.category}`
          .toLowerCase()
          .includes(query);
      const matchesCategory =
        selectedCategory === "All" ||
        subscription.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, subscriptions]);

  const totalMonthlyCost = subscriptions.reduce(
    (total, subscription) => total + subscription.monthlyCost,
    0,
  );

  const closeAddSheet = () => {
    setAddVisible(false);
    setEditingSubscription(null);
    setNewName("");
    setNewCost("");
    setNewRenewal("");
    setFormError("");
  };

  const openAddSheet = () => {
    setEditingSubscription(null);
    setNewName("");
    setNewCost("");
    setNewRenewal("");
    setFormError("");
    setAddVisible(true);
  };

  const openEditSheet = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setNewName(subscription.name);
    setNewCost(subscription.monthlyCost.toFixed(2));
    setNewRenewal(subscription.renewal);
    setFormError("");
    setAddVisible(true);
  };

  const saveSubscription = () => {
    const name = newName.trim();
    const monthlyCost = Number(newCost.replace(",", "."));
    const renewal = newRenewal.trim();

    if (
      !name ||
      !Number.isFinite(monthlyCost) ||
      monthlyCost <= 0 ||
      !renewal
    ) {
      setFormError("Add a name, a valid monthly cost, and a renewal date.");
      return;
    }

    if (editingSubscription) {
      setSubscriptions((current) =>
        current.map((subscription) =>
          subscription.id === editingSubscription.id
            ? { ...subscription, name, monthlyCost, renewal }
            : subscription,
        ),
      );
    } else {
      setSubscriptions((current) => [
        ...current,
        {
          id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
          name,
          category: "Other",
          renewal,
          monthlyCost,
          icon: {
            ios: "arrow.triangle.2.circlepath",
            android: "autorenew",
            web: "autorenew",
          },
          iconColor: colors.dark,
          iconBackground: colors.paleGreen,
        },
      ]);
    }
    closeAddSheet();
  };

  const deleteSubscription = (subscription: Subscription) => {
    Alert.alert(
      "Delete subscription?",
      `Remove ${subscription.name} from your subscriptions?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSubscriptions((current) =>
              current.filter((item) => item.id !== subscription.id),
            );
            setExpandedSubscriptionId(null);
          },
        },
      ],
    );
  };

  return (
    <StyledSafeAreaView className={"subscriptions-safeArea"} edges={["top"]}>
      <ScrollView
        className={"subscriptions-screen"}
        contentContainerClassName={"subscriptions-content"}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className={"subscriptions-header"}>
          <View>
            <Text className={"subscriptions-title"}>Subscription</Text>
            <Text className={"subscriptions-headerSubtitle"}>
              Your recurring plans
            </Text>
          </View>
          <ProfileMenu />
        </View>

        <View className={"subscriptions-totalCard"}>
          <View className={"subscriptions-totalCopy"}>
            <View className={"subscriptions-totalLabelRow"}>
              <View className={"subscriptions-totalDot"} />
              <Text className={"subscriptions-totalLabel"}>TOTAL MONTHLY</Text>
            </View>
            <Text className={"subscriptions-totalAmount"}>
              {formatCurrency(totalMonthlyCost)}
            </Text>
            <Text className={"subscriptions-totalCaption"}>
              {subscriptions.length} active{" "}
              {subscriptions.length === 1 ? "plan" : "plans"}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add subscription"
            onPress={openAddSheet}
            className={
              "subscriptions-addButton active:opacity-80 active:scale-[0.98]"
            }
          >
            <AppIcon
              name={{ ios: "plus", android: "add", web: "add" }}
              tintColor={colors.dark}
              size={23}
            />
          </Pressable>
          <View
            pointerEvents="none"
            className={"subscriptions-cardDecoration"}
          />
        </View>

        <View className={"subscriptions-recordSection"}>
          <Text className={"subscriptions-sectionEyebrow"}>Record</Text>
          <View className={"subscriptions-searchRow"}>
            <View className={"subscriptions-searchBox"}>
              <AppIcon
                name={{
                  ios: "magnifyingglass",
                  android: "search",
                  web: "search",
                }}
                tintColor="#9AA39B"
                size={18}
              />
              <TextInput
                accessibilityLabel="Search subscriptions"
                value={search}
                onChangeText={setSearch}
                placeholder="Search subscriptions"
                placeholderTextColor="#A6ADA6"
                returnKeyType="search"
                className={"subscriptions-searchInput"}
              />
              {search.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() => setSearch("")}
                  hitSlop={8}
                >
                  <AppIcon
                    name={{
                      ios: "xmark.circle.fill",
                      android: "cancel",
                      web: "cancel",
                    }}
                    tintColor="#A6ADA6"
                    size={18}
                  />
                </Pressable>
              )}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filter subscriptions"
              accessibilityState={{ expanded: filtersVisible }}
              onPress={() => setFiltersVisible((visible) => !visible)}
              className={[
                "subscriptions-filterButton",
                filtersVisible ? "subscriptions-filterButtonActive" : "",
                "active:opacity-80 active:scale-[0.98]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <AppIcon
                name={{
                  ios: "line.3.horizontal.decrease",
                  android: "tune",
                  web: "tune",
                }}
                tintColor={filtersVisible ? colors.dark : colors.muted}
                size={20}
              />
            </Pressable>
          </View>
          {filtersVisible && (
            <ScrollView
              horizontal
              contentContainerClassName={"subscriptions-filterOptions"}
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((category) => {
                const selected = selectedCategory === category;
                return (
                  <Pressable
                    key={category}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSelectedCategory(category)}
                    className={[
                      "subscriptions-filterChip",
                      selected ? "subscriptions-filterChipSelected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <Text
                      className={[
                        "subscriptions-filterChipText",
                        selected ? "subscriptions-filterChipTextSelected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>

        <View className={"subscriptions-listCard"}>
          <View className={"subscriptions-listHeader"}>
            <View>
              <Text className={"subscriptions-listTitle"}>
                Active subscriptions
              </Text>
              <Text className={"subscriptions-listSubtitle"}>
                Keep track of what renews next
              </Text>
            </View>
            <View className={"subscriptions-countBadge"}>
              <Text className={"subscriptions-countText"}>
                {filteredSubscriptions.length}
              </Text>
            </View>
          </View>

          {filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map((subscription, index) => {
              const expanded = expandedSubscriptionId === subscription.id;
              const lastSubscription =
                index === filteredSubscriptions.length - 1;

              return (
                <View
                  key={subscription.id}
                  className={[
                    "subscriptions-subscriptionContainer",
                    lastSubscription && !expanded
                      ? "subscriptions-lastSubscriptionRow"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${subscription.name}, ${formatCurrency(subscription.monthlyCost)} per month`}
                    accessibilityState={{ expanded }}
                    onPress={() =>
                      setExpandedSubscriptionId(
                        expanded ? null : subscription.id,
                      )
                    }
                    className={"subscriptions-subscriptionRow"}
                  >
                    <View
                      className={"subscriptions-appIcon"}
                      style={{ backgroundColor: subscription.iconBackground }}
                    >
                      <AppIcon
                        name={subscription.icon}
                        tintColor={subscription.iconColor}
                        size={20}
                      />
                    </View>
                    <View className={"subscriptions-subscriptionInfo"}>
                      <Text
                        numberOfLines={1}
                        className={"subscriptions-subscriptionName"}
                      >
                        {subscription.name}
                      </Text>
                      <Text className={"subscriptions-renewalText"}>
                        Renews {subscription.renewal}
                      </Text>
                    </View>
                    <View className={"subscriptions-priceColumn"}>
                      <Text className={"subscriptions-subscriptionPrice"}>
                        {formatCurrency(subscription.monthlyCost)}
                      </Text>
                      <Text className={"subscriptions-pricePeriod"}>
                        / month
                      </Text>
                    </View>
                    <AppIcon
                      name={{
                        ios: expanded ? "chevron.up" : "chevron.down",
                        android: expanded ? "expand_less" : "expand_more",
                        web: expanded ? "expand_less" : "expand_more",
                      }}
                      tintColor="#9AA39B"
                      size={16}
                    />
                  </Pressable>
                  {expanded && (
                    <View
                      className={[
                        "subscriptions-subscriptionExpanded",
                        lastSubscription
                          ? "subscriptions-lastExpandedSubscription"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <SubscriptionDetail
                        label="Category"
                        value={subscription.category}
                      />
                      <SubscriptionDetail
                        label="Next renewal"
                        value={subscription.renewal}
                      />
                      <SubscriptionDetail
                        label="Monthly cost"
                        value={`${formatCurrency(subscription.monthlyCost)} / month`}
                      />
                      <View className={"subscriptions-subscriptionActions"}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Update ${subscription.name}`}
                          onPress={() => openEditSheet(subscription)}
                          className={
                            "subscriptions-updateButton active:opacity-80 active:scale-[0.98]"
                          }
                        >
                          <AppIcon
                            name={{
                              ios: "pencil",
                              android: "edit",
                              web: "edit",
                            }}
                            tintColor={colors.dark}
                            size={14}
                          />
                          <Text className={"subscriptions-updateButtonText"}>
                            Update
                          </Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Delete ${subscription.name}`}
                          onPress={() => deleteSubscription(subscription)}
                          className={
                            "subscriptions-deleteButton active:opacity-80 active:scale-[0.98]"
                          }
                        >
                          <AppIcon
                            name={{
                              ios: "trash",
                              android: "delete",
                              web: "delete",
                            }}
                            tintColor="#B8473F"
                            size={14}
                          />
                          <Text className={"subscriptions-deleteButtonText"}>
                            Delete
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View className={"subscriptions-emptyState"}>
              <Text className={"subscriptions-emptyTitle"}>
                No subscriptions found
              </Text>
              <Text className={"subscriptions-emptyCopy"}>
                Try another search or choose a different filter.
              </Text>
            </View>
          )}
        </View>

        <View className={"subscriptions-footerNote"}>
          <AppIcon
            name={{
              ios: "sparkles",
              android: "auto_awesome",
              web: "auto_awesome",
            }}
            tintColor="#87947F"
            size={14}
          />
          <Text className={"subscriptions-footerNoteText"}>
            A little clarity for every month.
          </Text>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={closeAddSheet}
        transparent
        visible={addVisible}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className={"subscriptions-modalBackdrop"}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close add subscription form"
            onPress={closeAddSheet}
            className={"subscriptions-absoluteFill"}
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            className={"subscriptions-sheetContainer"}
            contentContainerClassName={"subscriptions-addSheet"}
          >
            <View className={"subscriptions-sheetHandle"} />
            <View className={"subscriptions-sheetHeader"}>
              <View>
                <Text className={"subscriptions-sheetTitle"}>
                  {editingSubscription
                    ? "Update subscription"
                    : "New subscription"}
                </Text>
                <Text className={"subscriptions-sheetSubtitle"}>
                  {editingSubscription
                    ? "Edit your recurring monthly expense"
                    : "Add a recurring monthly expense"}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={closeAddSheet}
                className={"subscriptions-closeButton"}
              >
                <AppIcon
                  name={{ ios: "xmark", android: "close", web: "close" }}
                  tintColor={colors.muted}
                  size={16}
                />
              </Pressable>
            </View>

            <Text className={"subscriptions-inputLabel"}>
              Subscription name
            </Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Netflix"
              placeholderTextColor="#A6ADA6"
              className={"subscriptions-formInput"}
              returnKeyType="next"
            />
            <View className={"subscriptions-formRow"}>
              <View className={"subscriptions-formField"}>
                <Text className={"subscriptions-inputLabel"}>Monthly cost</Text>
                <TextInput
                  value={newCost}
                  onChangeText={setNewCost}
                  placeholder="$0.00"
                  placeholderTextColor="#A6ADA6"
                  keyboardType="decimal-pad"
                  className={"subscriptions-formInput"}
                />
              </View>
              <View className={"subscriptions-formField"}>
                <Text className={"subscriptions-inputLabel"}>Next renewal</Text>
                <TextInput
                  value={newRenewal}
                  onChangeText={setNewRenewal}
                  placeholder="e.g. Nov 24"
                  placeholderTextColor="#A6ADA6"
                  className={"subscriptions-formInput"}
                  returnKeyType="done"
                />
              </View>
            </View>
            {formError ? (
              <Text className={"subscriptions-formError"}>{formError}</Text>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={saveSubscription}
              className={
                "subscriptions-saveButton active:opacity-80 active:scale-[0.98]"
              }
            >
              <Text className={"subscriptions-saveButtonText"}>
                {editingSubscription ? "Save changes" : "Add subscription"}
              </Text>
              <AppIcon
                name={{
                  ios: "arrow.right",
                  android: "arrow_forward",
                  web: "arrow_forward",
                }}
                tintColor={colors.dark}
                size={17}
              />
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </StyledSafeAreaView>
  );
}

function SubscriptionDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className={"subscriptions-detailRow"}>
      <Text className={"subscriptions-detailLabel"}>{label}</Text>
      <Text className={"subscriptions-detailValue"}>{value}</Text>
    </View>
  );
}
