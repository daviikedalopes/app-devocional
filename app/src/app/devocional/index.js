import { useEffect, useRef } from 'react';
import { Alert, Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ETAPAS, tempoDaEtapa, useCronometro } from '../../store/cronometro';
import { useAgora } from '../../lib/useAgora';
import { useMovimentoReduzido } from '../../lib/useMovimentoReduzido';
import { formatarCronometro } from '../../lib/formato';
import { Botao, Marcador } from '../../components/ui';
import { cores, espaco, raio, tipo } from '../../theme';

const ETAPA = {
  [ETAPAS.LEITURA]: { nome: 'Leitura', cor: cores.leitura, fundo: cores.leituraFundo, texto: cores.leituraTexto },
  [ETAPAS.ORACAO]: { nome: 'Oração', cor: cores.oracao, fundo: cores.oracaoFundo, texto: cores.oracaoTexto },
};

function confirmar(titulo, mensagem, aoConfirmar) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Descartar', style: 'destructive', onPress: aoConfirmar },
  ]);
}

// Círculo que "respira" devagar (4 s para cada lado) enquanto o tempo corre.
function Respiracao({ ativo, cor, children }) {
  const reduzido = useMovimentoReduzido();
  const valor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!ativo || reduzido) {
      valor.stopAnimation();
      Animated.timing(valor, { toValue: 0, duration: 400, useNativeDriver: Platform.OS !== 'web' }).start();
      return undefined;
    }
    const passo = (toValue) =>
      Animated.timing(valor, {
        toValue,
        duration: 4000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: Platform.OS !== 'web',
      });
    const laco = Animated.loop(Animated.sequence([passo(1), passo(0)]));
    laco.start();
    return () => laco.stop();
  }, [ativo, reduzido, valor]);

  const escala = valor.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <View style={estilos.respiracao}>
      <Animated.View style={[estilos.circulo, { backgroundColor: cor, transform: [{ scale: escala }] }]} />
      {children}
    </View>
  );
}

// Cronômetro do devocional, com etapas de Leitura e Oração.
export default function Cronometro() {
  const estado = useCronometro();
  const { bottom } = useSafeAreaInsets();
  const rodando = Boolean(estado.rodandoDesde);
  const iniciado = Boolean(estado.iniciadoEm);
  const agora = useAgora(rodando);

  const atual = ETAPA[estado.etapa];
  const outra = estado.etapa === ETAPAS.LEITURA ? ETAPAS.ORACAO : ETAPAS.LEITURA;
  const tempoAtual = tempoDaEtapa(estado, estado.etapa, agora);
  const tempoOutra = tempoDaEtapa(estado, outra, agora);

  function finalizar() {
    estado.pausar();
    router.push({ pathname: '/devocional/registrar', params: { origem: 'cronometro' } });
  }

  function descartar() {
    confirmar('Descartar devocional?', 'O tempo marcado até agora será perdido.', async () => {
      await estado.descartar();
      router.back();
    });
  }

  return (
    <View style={[estilos.tela, { paddingBottom: bottom + espaco.md }]}>
      <View style={estilos.etapas} role="tablist">
        {Object.values(ETAPAS).map((etapa) => {
          const info = ETAPA[etapa];
          const ativa = estado.etapa === etapa;
          return (
            <Pressable
              key={etapa}
              onPress={() => estado.trocarEtapa(etapa)}
              role="tab"
              aria-label={info.nome}
              aria-selected={ativa}
              style={[estilos.etapa, ativa && { backgroundColor: info.fundo }]}
            >
              <Marcador cor={info.cor} />
              <Text style={[tipo.rotulo, { color: ativa ? info.texto : cores.pedra }]}>{info.nome}</Text>
            </Pressable>
          );
        })}
      </View>

      <Respiracao ativo={rodando} cor={atual.fundo}>
        <Text style={[tipo.rotulo, { color: atual.texto }]}>{atual.nome}</Text>
        <Text style={[tipo.numero, estilos.tempo]} role="timer" aria-live="off">
          {formatarCronometro(tempoAtual)}
        </Text>
        {tempoOutra > 0 && (
          <View style={estilos.outra}>
            <Marcador cor={ETAPA[outra].cor} tamanho={6} />
            <Text style={tipo.corpoMenor}>
              {ETAPA[outra].nome} {formatarCronometro(tempoOutra)}
            </Text>
          </View>
        )}
      </Respiracao>

      <View style={estilos.rodape}>
        {!iniciado && (
          <Text style={[tipo.corpoMenor, estilos.dica]}>
            Comece pela leitura ou pela oração. Você pode trocar de etapa quando quiser.
          </Text>
        )}
        {rodando ? (
          <Botao titulo="Pausar" variante="secundario" onPress={estado.pausar} />
        ) : (
          <Botao titulo={iniciado ? 'Continuar' : 'Iniciar'} onPress={estado.iniciar} />
        )}
        {iniciado && <Botao titulo="Finalizar e registrar" variante={rodando ? 'primario' : 'secundario'} onPress={finalizar} />}
        {iniciado ? (
          <Botao titulo="Descartar" variante="fantasma" onPress={descartar} />
        ) : (
          <Botao
            titulo="Registrar sem cronômetro"
            variante="fantasma"
            onPress={() => router.replace({ pathname: '/devocional/registrar', params: { origem: 'manual' } })}
          />
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, paddingHorizontal: espaco.lg, paddingTop: espaco.sm, justifyContent: 'space-between' },
  etapas: {
    flexDirection: 'row',
    gap: espaco.xs,
    padding: 4,
    borderRadius: raio.pilula,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.linha,
    alignSelf: 'center',
  },
  etapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    paddingVertical: 10,
    paddingHorizontal: espaco.lg,
    borderRadius: raio.pilula,
  },
  respiracao: { alignItems: 'center', justifyContent: 'center', height: 300, gap: espaco.xs },
  circulo: { position: 'absolute', width: 280, height: 280, borderRadius: 140 },
  tempo: { fontSize: 72, lineHeight: 80, letterSpacing: 1 },
  outra: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rodape: { gap: espaco.sm },
  dica: { textAlign: 'center', marginBottom: espaco.sm },
});
