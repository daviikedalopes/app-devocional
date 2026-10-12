import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { CHAVES, useLivros, useProgresso } from '../../api/consultas';
import { GradeCapitulos } from '../../components/GradeCapitulos';
import { Marcador, Mensagem } from '../../components/ui';
import { cores, espaco, tipo } from '../../theme';

// Checklist de um livro: toque num capítulo para marcar ou desmarcar como lido.
export default function Livro() {
  const { id } = useLocalSearchParams();
  const { porId } = useLivros();
  const progresso = useProgresso();
  const queryClient = useQueryClient();
  const livro = porId.get(id);

  const lidos = useMemo(
    () => new Set(progresso.data?.livros.find((l) => l.id === id)?.capitulosLidos ?? []),
    [progresso.data, id],
  );

  const alternar = useMutation({
    mutationFn: (capitulo) =>
      api('/leitura/capitulos', {
        metodo: lidos.has(capitulo) ? 'DELETE' : 'POST',
        corpo: { livro: id, capitulos: [capitulo] },
      }),
    // Atualização otimista: a grade responde na hora.
    onMutate: async (capitulo) => {
      await queryClient.cancelQueries({ queryKey: CHAVES.progresso });
      const anterior = queryClient.getQueryData(CHAVES.progresso);
      queryClient.setQueryData(CHAVES.progresso, (dados) => {
        if (!dados) return dados;
        const marcar = !lidos.has(capitulo);
        const delta = marcar ? 1 : -1;
        const testamento = livro.testamento === 'AT' ? 'antigoTestamento' : 'novoTestamento';
        return {
          ...dados,
          biblia: { ...dados.biblia, lidos: dados.biblia.lidos + delta },
          [testamento]: { ...dados[testamento], lidos: dados[testamento].lidos + delta },
          livros: dados.livros.map((l) => {
            if (l.id !== id) return l;
            const capitulosLidos = marcar
              ? [...l.capitulosLidos, capitulo].sort((a, b) => a - b)
              : l.capitulosLidos.filter((c) => c !== capitulo);
            return { ...l, capitulosLidos, concluido: capitulosLidos.length === l.capitulos };
          }),
        };
      });
      return { anterior };
    },
    onError: (_erro, _capitulo, contexto) => queryClient.setQueryData(CHAVES.progresso, contexto.anterior),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CHAVES.progresso }),
  });

  if (!livro || progresso.isPending) {
    return <ActivityIndicator style={{ marginTop: espaco.xl }} color={cores.tinta} />;
  }

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <Stack.Screen options={{ title: '' }} />
      <View style={{ gap: espaco.xs }}>
        <Text style={tipo.titulo} role="heading" aria-level={1}>
          {livro.nome}
        </Text>
        <Text style={tipo.corpoMenor}>
          {livro.testamento === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}, {livro.secao}
        </Text>
      </View>
      <View style={estilos.resumo}>
        <Marcador cor={cores.leitura} />
        <Text style={tipo.corpoForte}>
          {lidos.size === livro.capitulos
            ? 'Livro lido por inteiro'
            : `${lidos.size} de ${livro.capitulos} capítulos lidos`}
        </Text>
      </View>
      <GradeCapitulos total={livro.capitulos} selecionados={lidos} onAlternar={(c) => alternar.mutate(c)} />
      <Text style={tipo.corpoMenor}>Toque num capítulo para marcar ou desmarcar.</Text>
      <Mensagem texto={alternar.error?.message} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: espaco.md, paddingBottom: espaco.xxl, gap: espaco.lg },
  resumo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
});
