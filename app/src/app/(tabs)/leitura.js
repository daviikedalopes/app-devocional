import { useMemo } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLivros, useProgresso } from '../../api/consultas';
import { Estante } from '../../components/Estante';
import { Tela } from '../../components/Tela';
import { Botao, Marcador, Mensagem, Superficie, TituloSecao } from '../../components/ui';
import { cores, espaco, raio, tipo } from '../../theme';

const porcentagem = ({ lidos, total }) => (total ? Math.round((lidos / total) * 100) : 0);
const milhar = (n) => n.toLocaleString('pt-BR');

// Celebra o que já foi lido, nunca o que falta.
function fraseDoProgresso({ lidos, total }) {
  if (lidos === 0) return 'Sua estante espera o primeiro capítulo';
  if (lidos === total) return 'Você leu a Bíblia inteira';
  return lidos === 1 ? '1 capítulo lido' : `${milhar(lidos)} capítulos lidos`;
}

function LinhaTestamento({ nome, cor, dados }) {
  return (
    <View style={estilos.testamento}>
      <Marcador cor={cor} />
      <Text style={[tipo.rotulo, { flex: 1 }]}>{nome}</Text>
      <Text style={tipo.corpoMenor}>
        {milhar(dados.lidos)} de {milhar(dados.total)}
      </Text>
    </View>
  );
}

function LinhaLivro({ livro, primeiro }) {
  const concluido = livro.lidos === livro.capitulos;
  const fracao = livro.lidos / livro.capitulos;
  const cor = livro.testamento === 'AT' ? cores.ambar : cores.leitura;
  return (
    <Pressable
      onPress={() => router.push(`/livro/${livro.id}`)}
      role="button"
      aria-label={`${livro.nome}: ${livro.lidos} de ${livro.capitulos} capítulos lidos`}
      style={({ pressed }) => [estilos.livro, !primeiro && estilos.divisor, pressed && { backgroundColor: cores.papel }]}
    >
      <View style={{ flex: 1, gap: 6 }}>
        <View style={estilos.livroTopo}>
          <Text style={tipo.corpo}>{livro.nome}</Text>
          {concluido && <Ionicons name="checkmark-circle" size={18} color={cores.leituraTexto} />}
        </View>
        <View style={estilos.trilho}>
          <View style={[estilos.trilhoCheio, { width: `${fracao * 100}%`, backgroundColor: cor }]} />
        </View>
      </View>
      <Text style={[tipo.corpoMenor, estilos.contagem]}>
        {livro.lidos}/{livro.capitulos}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={cores.seixo} />
    </Pressable>
  );
}

// Aba "Leitura": a Bíblia como estante + checklist por livro.
export default function Leitura() {
  const livros = useLivros();
  const progresso = useProgresso();

  const { lidosPorLivro, secoes } = useMemo(() => {
    const lidos = new Map((progresso.data?.livros ?? []).map((l) => [l.id, l.capitulosLidos.length]));
    const grupos = new Map();
    for (const livro of livros.livros) {
      const titulo = livro.secao;
      if (!grupos.has(titulo)) grupos.set(titulo, []);
      grupos.get(titulo).push({ ...livro, lidos: lidos.get(livro.id) ?? 0 });
    }
    return { lidosPorLivro: lidos, secoes: [...grupos] };
  }, [livros.livros, progresso.data]);

  if (livros.isPending || progresso.isPending) {
    return (
      <Tela titulo="Leitura">
        <ActivityIndicator color={cores.tinta} />
      </Tela>
    );
  }

  if (livros.isError || progresso.isError) {
    return (
      <Tela titulo="Leitura">
        <Mensagem texto={`Não foi possível carregar sua leitura: ${(livros.error ?? progresso.error).message}`} />
        <Botao
          titulo="Tentar de novo"
          variante="secundario"
          onPress={() => {
            livros.refetch();
            progresso.refetch();
          }}
        />
      </Tela>
    );
  }

  const p = progresso.data;

  return (
    <Tela
      titulo="Leitura"
      subtitulo={p.ciclo > 1 ? `Sua ${p.ciclo}ª leitura da Bíblia` : 'Sua caminhada pela Bíblia'}
      refreshControl={
        <RefreshControl refreshing={progresso.isRefetching} onRefresh={progresso.refetch} tintColor={cores.tinta} />
      }
    >
      <Superficie style={estilos.painel}>
        <View style={{ gap: 2 }}>
          <Text style={estilos.frase}>{fraseDoProgresso(p.biblia)}</Text>
          {p.biblia.lidos > 0 && (
            <Text style={tipo.corpoMenor}>
              {milhar(p.biblia.lidos)} de {milhar(p.biblia.total)} capítulos
              {porcentagem(p.biblia) >= 1 ? `, ${porcentagem(p.biblia)}% da Bíblia` : ''}
            </Text>
          )}
        </View>
        <Estante livros={livros.livros} lidosPorLivro={lidosPorLivro} />
        <View style={{ gap: espaco.sm }}>
          <LinhaTestamento nome="Antigo Testamento" cor={cores.ambar} dados={p.antigoTestamento} />
          <LinhaTestamento nome="Novo Testamento" cor={cores.leitura} dados={p.novoTestamento} />
        </View>
      </Superficie>

      {secoes.map(([titulo, itens]) => (
        <View key={titulo}>
          <TituloSecao>{titulo}</TituloSecao>
          <Superficie style={{ overflow: 'hidden' }}>
            {itens.map((livro, i) => (
              <LinhaLivro key={livro.id} livro={livro} primeiro={i === 0} />
            ))}
          </Superficie>
        </View>
      ))}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  painel: { padding: espaco.md, gap: espaco.md, borderRadius: raio.bloco },
  frase: { ...tipo.numero, fontFamily: 'Fraunces_600SemiBold', fontSize: 24, lineHeight: 30 },
  testamento: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  livro: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, paddingVertical: 12, paddingHorizontal: espaco.md },
  divisor: { borderTopWidth: 1, borderTopColor: cores.linha },
  livroTopo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trilho: { height: 4, borderRadius: 2, backgroundColor: 'rgba(34, 31, 28, 0.07)', overflow: 'hidden', maxWidth: 220 },
  trilhoCheio: { height: 4, borderRadius: 2 },
  contagem: { fontVariant: ['tabular-nums'] },
});
