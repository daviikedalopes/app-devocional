import { useMemo, useState } from 'react';
import { FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLivros } from '../api/consultas';
import { formatarPassagem, semAcentos } from '../lib/formato';
import { capitulosDoLivro, substituirLivro } from '../lib/passagens';
import { GradeCapitulos } from './GradeCapitulos';
import { Botao } from './ui';
import { cores, espaco, raio, tipo } from '../theme';

// Escolha das passagens lidas: livro → capítulos (toque para marcar).
export function SeletorPassagens({ passagens, onChange }) {
  const { livros, porId } = useLivros();
  const [aberto, setAberto] = useState(false);
  const [livroAtual, setLivroAtual] = useState(null);
  const [busca, setBusca] = useState('');
  const [capitulos, setCapitulos] = useState(new Set());

  const filtrados = useMemo(() => {
    const termo = semAcentos(busca.trim());
    if (!termo) return livros;
    return livros.filter(
      (l) => semAcentos(l.nome).includes(termo) || semAcentos(l.abreviacao).startsWith(termo),
    );
  }, [livros, busca]);

  function abrir(livro = null) {
    setBusca('');
    setLivroAtual(livro);
    setCapitulos(new Set(livro ? capitulosDoLivro(passagens, livro.id) : []));
    setAberto(true);
  }

  function escolherLivro(livro) {
    setLivroAtual(livro);
    setCapitulos(new Set(capitulosDoLivro(passagens, livro.id)));
  }

  function alternar(capitulo) {
    setCapitulos((atual) => {
      const novo = new Set(atual);
      if (novo.has(capitulo)) novo.delete(capitulo);
      else novo.add(capitulo);
      return novo;
    });
  }

  function confirmar() {
    onChange(substituirLivro(passagens, livroAtual.id, [...capitulos]));
    setAberto(false);
  }

  const remover = (indice) => onChange(passagens.filter((_, i) => i !== indice));
  const jaTinha = livroAtual ? capitulosDoLivro(passagens, livroAtual.id).length > 0 : false;

  return (
    <View style={{ gap: espaco.md }}>
      {passagens.length > 0 && (
        <View style={estilos.chips}>
          {passagens.map((p, i) => (
            <View key={`${p.livro}-${p.capituloInicio}`} style={estilos.chip}>
              <Pressable onPress={() => abrir(porId.get(p.livro))} role="button" aria-label={`Editar ${formatarPassagem(p, porId)}`}>
                <Text style={estilos.chipTexto}>{formatarPassagem(p, porId)}</Text>
              </Pressable>
              <Pressable onPress={() => remover(i)} hitSlop={10} role="button" aria-label={`Remover ${formatarPassagem(p, porId)}`}>
                <Ionicons name="close" size={16} color={cores.leituraTexto} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      <Botao
        titulo="Adicionar passagem"
        variante="secundario"
        icone={<Ionicons name="add" size={20} color={cores.tinta} />}
        onPress={() => abrir()}
      />

      <Modal visible={aberto} animationType="slide" onRequestClose={() => setAberto(false)}>
        <SafeAreaView style={estilos.modal}>
          <View style={estilos.topo}>
            <Pressable
              onPress={() => (livroAtual ? setLivroAtual(null) : setAberto(false))}
              hitSlop={10}
              role="button"
              aria-label={livroAtual ? 'Voltar para os livros' : 'Fechar'}
              style={estilos.voltar}
            >
              <Ionicons name={livroAtual ? 'chevron-back' : 'close'} size={24} color={cores.tinta} />
            </Pressable>
          </View>

          {livroAtual ? (
            <>
              <ScrollView contentContainerStyle={estilos.conteudo}>
                <View style={{ gap: espaco.xs }}>
                  <Text style={tipo.titulo} role="heading">
                    {livroAtual.nome}
                  </Text>
                  <Text style={tipo.corpoMenor}>Toque nos capítulos que você leu.</Text>
                </View>
                <GradeCapitulos total={livroAtual.capitulos} selecionados={capitulos} onAlternar={alternar} />
              </ScrollView>
              <View style={estilos.rodape}>
                <Botao
                  titulo={
                    capitulos.size === 0
                      ? jaTinha
                        ? 'Remover este livro'
                        : 'Escolha um capítulo'
                      : capitulos.size === 1
                        ? 'Adicionar 1 capítulo'
                        : `Adicionar ${capitulos.size} capítulos`
                  }
                  onPress={confirmar}
                  disabled={capitulos.size === 0 && !jaTinha}
                />
              </View>
            </>
          ) : (
            <>
              <View style={estilos.cabecalhoLista}>
                <Text style={tipo.titulo} role="heading">
                  Qual livro?
                </Text>
                <View style={estilos.busca}>
                  <Ionicons name="search" size={18} color={cores.pedra} />
                  <TextInput
                    value={busca}
                    onChangeText={setBusca}
                    placeholder="Buscar, por exemplo Marcos ou Sl"
                    placeholderTextColor={cores.seixo}
                    aria-label="Buscar livro"
                    style={estilos.buscaCampo}
                    autoCorrect={false}
                    autoFocus={Platform.OS === 'web'}
                  />
                </View>
              </View>
              <FlatList
                data={filtrados}
                keyExtractor={(l) => l.id}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: espaco.xl }}
                ListEmptyComponent={
                  <Text style={[tipo.corpoMenor, { padding: espaco.lg }]}>Nenhum livro com esse nome.</Text>
                }
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => escolherLivro(item)}
                    role="button"
                    style={({ pressed }) => [
                      estilos.livro,
                      index > 0 && estilos.divisor,
                      pressed && { backgroundColor: cores.branco },
                    ]}
                  >
                    <Text style={tipo.corpo}>{item.nome}</Text>
                    <Text style={tipo.corpoMenor}>{item.capitulos === 1 ? '1 capítulo' : `${item.capitulos} capítulos`}</Text>
                  </Pressable>
                )}
              />
            </>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    backgroundColor: cores.leituraFundo,
    borderRadius: raio.pilula,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 10,
  },
  chipTexto: { ...tipo.rotulo, color: cores.leituraTexto },
  modal: { flex: 1, backgroundColor: cores.papel },
  topo: { paddingHorizontal: espaco.sm, paddingTop: espaco.sm },
  voltar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  conteudo: { padding: espaco.md, gap: espaco.lg },
  rodape: { padding: espaco.md, borderTopWidth: 1, borderTopColor: cores.linha, backgroundColor: cores.papel },
  cabecalhoLista: { paddingHorizontal: espaco.md, paddingBottom: espaco.md, gap: espaco.md },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.linhaForte,
    borderRadius: raio.campo,
    paddingHorizontal: 12,
  },
  buscaCampo: {
    ...tipo.corpo,
    flex: 1,
    paddingVertical: 12,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  livro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
  },
  divisor: { borderTopWidth: 1, borderTopColor: cores.linha },
});
