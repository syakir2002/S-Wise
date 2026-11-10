import { Tabs } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import AppIcon from "../../components/AppIcon";
import AddTransactionModal from "../../components/AddTransactionModal";
import FuturisticAddIcon from "../../components/FuturisticAddIcon";

const tabIcons = {
  index: {
    ios: "square.grid.2x2.fill",
    android: "dashboard",
    web: "dashboard",
  },
  transaction: {
    ios: "arrow.left.arrow.right",
    android: "swap_horiz",
    web: "swap_horiz",
  },
  subscription: {
    ios: "calendar",
    android: "event_repeat",
    web: "event_repeat",
  },
  setting: { ios: "slider.horizontal.3", android: "tune", web: "tune" },
} as const;

export default function TabLayout() {
  const [addModalVisible, setAddModalVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={({ state, descriptors, emitter, navigateToTab, insets }) => {
          const items: React.ReactNode[] = [];

          state.routes.forEach((route, index) => {
            // Insert Center Futuristic Add Button right before the 3rd tab (index === 2)
            if (index === 2) {
              items.push(
                <View key="center-add-pod" className="tabs-centerPod">
                  {/* Arched dome extending tab bar upwards */}
                  <View className="tabs-centerArch" />

                  {/* Elevated Add Action Button */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Add transaction"
                    hitSlop={10}
                    onPress={() => setAddModalVisible(true)}
                    style={({ pressed }) => [
                      {
                        shadowColor: "#006CB9",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 7,
                        elevation: 9,
                        transform: [{ scale: pressed ? 0.92 : 1 }],
                      },
                    ]}
                    className="tabs-futuristicButton"
                  >
                    <FuturisticAddIcon size={26} color="#FFFFFF" />
                  </Pressable>
                </View>
              );
            }

            const { options } = descriptors[route.key];
            const focused = state.index === index;
            const color = focused ? "#1E2B24" : "#C4CCC5";
            const label = options.title ?? route.name;
            const onPress = () => {
              const event = emitter.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigateToTab(route.key);
              }
            };

            items.push(
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                onPress={onPress}
                onLongPress={() =>
                  emitter.emit({ type: "tabLongPress", target: route.key })
                }
                className={[
                  "tabs-tabItem",
                  focused ? "tabs-activeTabItem" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {options.tabBarIcon?.({ focused, color, size: 19 })}
                {focused && (
                  <Text numberOfLines={1} className={"tabs-activeLabel"}>
                    {label}
                  </Text>
                )}
              </Pressable>
            );
          });

          return (
            <View
              className={"tabs-tabBarArea"}
              style={{ paddingBottom: Math.max(insets.bottom, 8) }}
            >
              <View className={"tabs-tabBar"}>{items}</View>
            </View>
          );
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AppIcon name={tabIcons.index} tintColor={color} size={19} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => (
            <AppIcon name={tabIcons.transaction} tintColor={color} size={19} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: "Subscription",
          tabBarIcon: ({ color }) => (
            <AppIcon name={tabIcons.subscription} tintColor={color} size={19} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) => (
            <AppIcon name={tabIcons.setting} tintColor={color} size={19} />
          ),
        }}
      />
    </Tabs>

    <AddTransactionModal
      visible={addModalVisible}
      onClose={() => setAddModalVisible(false)}
    />
  </>
  );
}
