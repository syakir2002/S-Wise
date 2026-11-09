import '../../global.css';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/AuthContext';
import { ConfirmProvider } from '../context/ConfirmContext';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </ConfirmProvider>
    </AuthProvider>
  );
}
