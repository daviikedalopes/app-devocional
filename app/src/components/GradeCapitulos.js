import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, raio, tipo } from '../theme';

// Grade de capítulos 1..total. Lido = turquesa (a cor da Leitura no app).
export function GradeCapitulos({ total, selecionados, onAlternar, desabilitado }) {
  return (
    <View style={estilos.grade}>
      {Array.from({ length: total }, (_, i) => i + 1).map((capitulo) => {
        const ativo = selecionados.has(capitulo);
        return (
          <Pressable
            key={capitulo}
            onPress={() => onAlternar(capitulo)}
            disabled={desabilitado}
            role="checkbox"
            aria-checked={ativo}
            aria-label={`Capítulo ${capitulo}`}
            style={({ pressed }) => [estilos.celula, ativo && estilos.ativa, pressed && { transform: [{ scale: 0.94 }] }]}
          >
            <Text style={[estilos.numero, ativo && estilos.numeroAtivo]}>{capitulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  celula: {
    width: 48,
    height: 48,
    borderRadius: raio.celula,
    borderWidth: 1,
    borderColor: cores.linhaForte,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ativa: { backgroundColor: cores.leitura, borderColor: cores.leitura },
  numero: { ...tipo.rotulo, color: cores.tinta },
  numeroAtivo: { fontFamily: 'Figtree_700Bold', color: cores.tinta },
});
