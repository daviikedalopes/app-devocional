import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatarDia } from '../../lib/formato';
import { versiculoAleatorio } from '../../lib/versiculos';
import { Duracoes } from '../../components/Duracoes';
import { Botao } from '../../components/ui';
import { cores, espaco, tipo } from '../../theme';

// Encorajamento ao concluir: sem pontuação nem comparação.
export default function Concluido() {
  const { dia, leituraSeg, oracaoSeg, capitulos } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const [versiculo] = useState(versiculoAleatorio);

  const quando = dia ? formatarDia(dia) : 'hoje';
  const titulo = ['hoje', 'ontem'].includes(quando)
    ? `Você esteve com Deus ${quando}`
    : `Devocional de ${quando} registrado`;
  const novos = Number(capitulos);

  return (
    <View style={[estilos.tela, { paddingTop: top + espaco.xxl, paddingBottom: bottom + espaco.md }]}>
      <View style={estilos.topo}>
        <Text style={tipo.display} role="heading" aria-level={1}>
          {titulo}
        </Text>
        <Duracoes leituraSeg={Number(leituraSeg)} oracaoSeg={Number(oracaoSeg)} estilo={{ color: cores.tinta }} />
        {novos > 0 && (
          <Text style={[tipo.corpo, { color: cores.pedra }]}>
            {novos === 1 ? '1 capítulo novo' : `${novos} capítulos novos`} no seu checklist.
          </Text>
        )}
      </View>

      <View style={estilos.versiculo}>
        <Text style={[tipo.escritura, estilos.versiculoTexto]}>“{versiculo.texto}”</Text>
        <Text style={tipo.legenda}>{versiculo.referencia}</Text>
      </View>

      <Botao titulo="Amém" onPress={() => router.dismissTo('/')} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, paddingHorizontal: espaco.lg, justifyContent: 'space-between', backgroundColor: cores.pessego },
  topo: { gap: espaco.md },
  versiculo: {
    gap: espaco.sm,
    paddingLeft: espaco.md,
    borderLeftWidth: 3,
    borderLeftColor: cores.ambar,
  },
  versiculoTexto: { fontSize: 22, lineHeight: 32 },
});
