import { Stack } from 'expo-router';
import { cores } from '../../theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: cores.papel },
        headerTintColor: cores.tinta,
        headerTitleStyle: { fontFamily: 'Figtree_600SemiBold', fontSize: 17, color: cores.tinta },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: cores.papel },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: '' }} />
    </Stack>
  );
}
