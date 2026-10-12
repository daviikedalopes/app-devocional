import { StyleSheet, Text, View } from 'react-native';
import { formatarDuracao } from '../lib/formato';
import { Marcador } from './ui';
import { cores, espaco, tipo } from '../theme';

// Tempo de leitura (turquesa) e de oração (orquídea), lado a lado. Omite o que for zero.
export function Duracoes({ leituraSeg, oracaoSeg, estilo }) {
  const itens = [
    leituraSeg > 0 && { chave: 'leitura', cor: cores.leitura, texto: `${formatarDuracao(leituraSeg)} de leitura` },
    oracaoSeg > 0 && { chave: 'oracao', cor: cores.oracao, texto: `${formatarDuracao(oracaoSeg)} de oração` },
  ].filter(Boolean);

  if (itens.length === 0) return null;

  return (
    <View style={estilos.linha}>
      {itens.map((item) => (
        <View key={item.chave} style={estilos.item}>
          <Marcador cor={item.cor} />
          <Text style={[tipo.corpoMenor, estilo]}>{item.texto}</Text>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', flexWrap: 'wrap', columnGap: espaco.md, rowGap: espaco.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
