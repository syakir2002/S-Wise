import '../../global.css';
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
