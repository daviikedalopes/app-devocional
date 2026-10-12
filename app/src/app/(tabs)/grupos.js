import { StyleSheet, Text, View } from 'react-native';
import { Tela } from '../../components/Tela';
import { Bloco, Marcador } from '../../components/ui';
import { cores, espaco, tipo } from '../../theme';

const RECURSOS = [
  { cor: cores.leitura, texto: 'Veja quem do grupo esteve com Deus hoje' },
  { cor: cores.ambar, texto: 'Leiam um livro juntos, no mesmo ritmo' },
  { cor: cores.oracao, texto: 'Compartilhem pedidos de oração' },
];

// Aba "Grupos": célula, mocidade e amigos.
export default function Grupos() {
  return (
    <Tela titulo="Grupos" subtitulo="Caminhar junto com sua célula, mocidade ou amigos">
      <Bloco cor={cores.oracaoFundo} style={estilos.bloco}>
        <Text style={tipo.tituloSecao}>Os grupos estão chegando</Text>
        <Text style={[tipo.corpo, { color: cores.pedra }]}>
          Logo você vai poder criar um grupo ou entrar com um código de convite.
        </Text>
        <View style={estilos.lista}>
          {RECURSOS.map((r) => (
            <View key={r.texto} style={estilos.item}>
              <Marcador cor={r.cor} />
              <Text style={tipo.corpo}>{r.texto}</Text>
            </View>
          ))}
        </View>
      </Bloco>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: espaco.md },
  lista: { gap: espaco.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
});
