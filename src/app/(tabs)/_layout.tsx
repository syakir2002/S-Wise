import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";
import AppIcon from "../../components/AppIcon";

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
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, descriptors, emitter, navigateToTab, insets }) => (
        <View
          className={"tabs-tabBarArea"}
          style={{ paddingBottom: Math.max(insets.bottom, 8) }}
        >
          <View className={"tabs-tabBar"}>
            {state.routes.map((route, index) => {
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

              return (
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
                    <Text className={"tabs-activeLabel"}>{label}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
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
  );
}
