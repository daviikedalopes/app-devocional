import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores, espaco, tipo } from '../theme';

// Tela rolável com título grande em Fraunces (usada nas abas, que não têm cabeçalho de navegação).
export function Tela({ titulo, subtitulo, children, refreshControl, contentStyle }) {
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ backgroundColor: cores.papel }}
      contentContainerStyle={[estilos.conteudo, { paddingTop: top + espaco.lg }, contentStyle]}
      refreshControl={refreshControl}
      keyboardShouldPersistTaps="handled"
    >
      {titulo ? (
        <View style={estilos.cabecalho}>
          <Text style={tipo.titulo} role="heading" aria-level={1}>
            {titulo}
          </Text>
          {subtitulo ? <Text style={tipo.corpoMenor}>{subtitulo}</Text> : null}
        </View>
      ) : null}
      {children}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingHorizontal: espaco.md, paddingBottom: espaco.xxl, gap: espaco.lg },
  cabecalho: { gap: espaco.xs, paddingHorizontal: espaco.xs },
});
