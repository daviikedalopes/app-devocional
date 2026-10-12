import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, raio, tipo } from '../theme';

const ALTURA = 72;
// Lombadas vazias levemente tingidas, para a divisão entre os testamentos aparecer.
const FUNDO_AT = 'rgba(229, 160, 87, 0.16)';
const FUNDO_NT = 'rgba(54, 186, 184, 0.16)';

// A Bíblia como uma estante: 66 lombadas, cada uma preenchida conforme o livro foi lido.
// Antigo Testamento em âmbar, Novo em turquesa.
export function Estante({ livros, lidosPorLivro }) {
  return (
    <View style={estilos.envoltorio}>
      <View
        style={estilos.prateleira}
        role="img"
        aria-label="Estante com os 66 livros da Bíblia, preenchidos conforme a leitura"
      >
        {livros.map((livro) => {
          const fracao = (lidosPorLivro.get(livro.id) ?? 0) / livro.capitulos;
          const at = livro.testamento === 'AT';
          return (
            <View key={livro.id} style={[estilos.lombada, { backgroundColor: at ? FUNDO_AT : FUNDO_NT }]}>
              <View
                style={[
                  estilos.preenchimento,
                  {
                    height: `${fracao * 100}%`,
                    minHeight: fracao > 0 ? 6 : 0,
                    backgroundColor: at ? cores.ambar : cores.leitura,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={estilos.legenda}>
        <Text style={tipo.legenda}>Gênesis</Text>
        <Text style={tipo.legenda}>Apocalipse</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  envoltorio: { gap: espaco.xs },
  prateleira: {
    height: ALTURA,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderBottomColor: cores.tinta,
  },
  lombada: {
    flex: 1,
    height: '100%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  preenchimento: { width: '100%', borderRadius: raio.campo / 4 },
  legenda: { flexDirection: 'row', justifyContent: 'space-between' },
});
