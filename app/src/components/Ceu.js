import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores, espaco } from '../theme';

// O céu do amanhecer: abertura do app (login) e do dia (aba Hoje). Não usar em outros lugares.
export function Ceu({ children, style }) {
  const { top } = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[cores.ceuInicio, cores.ceuFim]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[estilos.ceu, { paddingTop: top + espaco.lg }, style]}
    >
      {children}
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  ceu: { paddingHorizontal: espaco.lg, paddingBottom: espaco.xl, gap: espaco.md },
});
