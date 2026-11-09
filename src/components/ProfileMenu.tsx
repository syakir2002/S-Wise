import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import AppIcon from './AppIcon';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';
import { toast } from '../utils/toast';

export default function ProfileMenu() {
  const { logout } = useAuth();
  const { confirm } = useConfirm();
  const [visible, setVisible] = useState(false);

  const openProfile = () => {
    setVisible(false);
    router.navigate({ pathname: '/setting', params: { view: 'profile' } });
  };

  const handleLogout = () => {
    setVisible(false);
    confirm({
      title: 'Log out of S-wise?',
      message:
        'Are you sure you want to log out? You will need to sign in again to access your account.',
      confirmText: 'Log Out',
      cancelText: 'Cancel',
      type: 'danger',
      icon: {
        ios: 'rectangle.portrait.and.arrow.right',
        android: 'logout',
        web: 'logout',
      },
      onConfirm: async () => {
        try {
          await logout();
          toast.info('Signed Out', 'You have been logged out.');
          router.replace('/(auth)/sign-in');
        } catch (e: any) {
          toast.error('Error', e.message || 'Failed to log out');
        }
      },
    });
  };

  return (
    <View className={"profile-menu-container"}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile menu"
        accessibilityState={{ expanded: visible }}
        onPress={() => setVisible((current) => !current)}
        className={"profile-menu-profileButton active:opacity-80 active:scale-[0.98]"}>
        <AppIcon
          name={{ ios: 'person.fill', android: 'person', web: 'person' }}
          tintColor={colors.dark}
          size={19}
        />
        <View className={"profile-menu-profileStatus"} />
      </Pressable>
      {visible && (
        <View className={"profile-menu-menu"}>
          <Pressable
            accessibilityRole="button"
            onPress={openProfile}
            className={"profile-menu-menuItem active:opacity-80 active:scale-[0.98]"}>
            <AppIcon
              name={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
              tintColor={colors.dark}
              size={17}
            />
            <Text className={"profile-menu-menuText"}>Profile</Text>
          </Pressable>
          <View className={"profile-menu-menuDivider"} />
          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            className={"profile-menu-menuItem active:opacity-80 active:scale-[0.98]"}>
            <AppIcon
              name={{
                ios: 'rectangle.portrait.and.arrow.right',
                android: 'logout',
                web: 'logout',
              }}
              tintColor="#B8473F"
              size={16}
            />
            <Text className={"profile-menu-logoutText"}>Log out</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const colors = {
  background: '#F7F7F1',
  dark: '#1E2B24',
  green: '#B8E779',
};

