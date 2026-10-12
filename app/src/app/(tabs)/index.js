import { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useAuth } from '../../store/auth';
import { ETAPAS, tempoDaEtapa, useCronometro } from '../../store/cronometro';
import { useDevocionaisRecentes, useLivros, useResumoHoje } from '../../api/consultas';
import { useAgora } from '../../lib/useAgora';
import { formatarCronometro, formatarDia, formatarPassagem } from '../../lib/formato';
import { versiculoDoDia } from '../../lib/versiculos';
import { Ceu } from '../../components/Ceu';
import { Duracoes } from '../../components/Duracoes';
import { Bloco, Botao, Superficie, TituloSecao } from '../../components/ui';
import { cores, espaco, tipo } from '../../theme';

function saudacao(hora = new Date().getHours()) {
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

const hojePorExtenso = () => {
  const texto = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

// Aba "Hoje": o céu do amanhecer abre o dia; abaixo, o que já foi vivido.
export default function Hoje() {
  const usuario = useAuth((s) => s.usuario);
  const primeiroNome = usuario?.nome?.split(' ')[0];
  const resumo = useResumoHoje();
  const recentes = useDevocionaisRecentes(5);
  const { porId } = useLivros();
  const versiculo = versiculoDoDia();

  // Texto claro na barra de status enquanto o céu está visível.
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, []),
  );

  const atualizar = () => Promise.all([resumo.refetch(), recentes.refetch()]);
  const feitoHoje = resumo.data?.devocionais > 0;

  return (
    <ScrollView
      style={{ backgroundColor: cores.papel }}
      contentContainerStyle={{ paddingBottom: espaco.xxl }}
      refreshControl={<RefreshControl refreshing={resumo.isRefetching} onRefresh={atualizar} tintColor={cores.tinta} />}
    >
      <Ceu>
        <Text style={estilos.data}>{hojePorExtenso()}</Text>
        <Text style={[tipo.display, estilos.claro]} role="heading" aria-level={1}>
          {saudacao()}, {primeiroNome}
        </Text>
        <View style={estilos.versiculo}>
          <Text style={[tipo.escritura, estilos.claro]}>“{versiculo.texto}”</Text>
          <Text style={estilos.referencia}>{versiculo.referencia}</Text>
        </View>
        <AcaoDevocional feitoHoje={feitoHoje} />
      </Ceu>

      <View style={estilos.corpo}>
        {feitoHoje && (
          <Bloco cor={cores.pessego}>
            <Text style={tipo.tituloSecao}>Você esteve com Deus hoje</Text>
            <Duracoes
              leituraSeg={resumo.data.duracaoLeituraSeg}
              oracaoSeg={resumo.data.duracaoOracaoSeg}
              estilo={{ color: cores.tinta }}
            />
          </Bloco>
        )}

        <View>
          <TituloSecao>Seus últimos devocionais</TituloSecao>
          {recentes.data?.itens.length ? (
            <Superficie>
              {recentes.data.itens.map((d, i) => (
                <View key={d.id} style={[estilos.linha, i > 0 && estilos.divisor]}>
                  <Text style={estilos.dia}>{capitalizar(formatarDia(d.dia))}</Text>
                  <View style={estilos.detalhes}>
                    {d.passagens.length > 0 && (
                      <Text style={tipo.corpo}>{d.passagens.map((p) => formatarPassagem(p, porId)).join(', ')}</Text>
                    )}
                    <Duracoes leituraSeg={d.duracaoLeituraSeg} oracaoSeg={d.duracaoOracaoSeg} />
                  </View>
                </View>
              ))}
            </Superficie>
          ) : (
            <Text style={tipo.corpoMenor}>Quando você registrar um devocional, ele aparece aqui.</Text>
          )}
        </View>

        <View>
          <TituloSecao>Amigos</TituloSecao>
          <Text style={tipo.corpoMenor}>
            Em breve você verá aqui os devocionais que seus amigos compartilharem.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function AcaoDevocional({ feitoHoje }) {
  const cronometro = useCronometro();
  const emAndamento = Boolean(cronometro.iniciadoEm);
  const agora = useAgora(Boolean(cronometro.rodandoDesde));
  const totalMs = tempoDaEtapa(cronometro, ETAPAS.LEITURA, agora) + tempoDaEtapa(cronometro, ETAPAS.ORACAO, agora);

  if (emAndamento) {
    return (
      <View style={estilos.acoes}>
        <Botao
          variante="claro"
          titulo={`Continuar devocional  ${formatarCronometro(totalMs)}`}
          onPress={() => router.push('/devocional')}
        />
      </View>
    );
  }

  return (
    <View style={estilos.acoes}>
      <Botao
        variante="claro"
        titulo={feitoHoje ? 'Começar outro devocional' : 'Começar devocional'}
        onPress={() => router.push('/devocional')}
      />
      <Botao
        variante="fantasmaClaro"
        titulo="Registrar sem cronômetro"
        onPress={() => router.push({ pathname: '/devocional/registrar', params: { origem: 'manual' } })}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  claro: { color: cores.branco },
  data: { ...tipo.rotulo, color: 'rgba(255, 255, 255, 0.85)' },
  versiculo: { gap: espaco.xs, maxWidth: 520 },
  referencia: { ...tipo.legenda, color: 'rgba(255, 255, 255, 0.85)' },
  acoes: { gap: espaco.xs, marginTop: espaco.sm },
  corpo: { padding: espaco.md, paddingTop: espaco.lg, gap: espaco.xl },
  linha: { flexDirection: 'row', gap: espaco.md, padding: espaco.md },
  divisor: { borderTopWidth: 1, borderTopColor: cores.linha },
  dia: { ...tipo.numero, fontSize: 18, lineHeight: 24, width: 92 },
  detalhes: { flex: 1, gap: espaco.xs },
});
