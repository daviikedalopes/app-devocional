import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../store/auth';
import { useCronometro } from '../store/cronometro';
import { arquivosDeFonte, cores } from '../theme';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const cabecalho = {
  headerShown: true,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: cores.papel },
  headerTintColor: cores.tinta,
  headerTitleStyle: { fontFamily: 'Figtree_600SemiBold', fontSize: 17, color: cores.tinta },
  headerBackButtonDisplayMode: 'minimal',
};

export default function RootLayout() {
  const [fontesProntas, erroFontes] = useFonts(arquivosDeFonte);
  const carregandoSessao = useAuth((s) => s.carregando);
  const logado = useAuth((s) => Boolean(s.accessToken));
  const restaurarSessao = useAuth((s) => s.restaurar);
  const carregandoCronometro = useCronometro((s) => s.carregando);
  const restaurarCronometro = useCronometro((s) => s.restaurar);

  useEffect(() => {
    restaurarSessao();
    restaurarCronometro();
  }, [restaurarSessao, restaurarCronometro]);

  // Mantém a splash screen até ter fontes, sessão e cronômetro. Se as fontes falharem, segue com as do sistema.
  if ((!fontesProntas && !erroFontes) || carregandoSessao || carregandoCronometro) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.papel } }}>
        <Stack.Protected guard={logado}>
          <Stack.Screen name="(tabs)" options={{ title: 'Início' }} />
          <Stack.Screen name="devocional/index" options={{ ...cabecalho, title: '' }} />
          <Stack.Screen name="devocional/registrar" options={{ ...cabecalho, title: 'Registrar devocional' }} />
          <Stack.Screen name="devocional/concluido" options={{ gestureEnabled: false, contentStyle: { backgroundColor: cores.pessego } }} />
          <Stack.Screen name="livro/[id]" options={{ ...cabecalho, title: '' }} />
        </Stack.Protected>
        <Stack.Protected guard={!logado}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
