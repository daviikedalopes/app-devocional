import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { api } from '../../api/client';
import { useAtualizarAposDevocional } from '../../api/consultas';
import { ETAPAS, tempoDaEtapa, useCronometro } from '../../store/cronometro';
import { formatarCronometro } from '../../lib/formato';
import { SeletorPassagens } from '../../components/SeletorPassagens';
import { Botao, Campo, Marcador, Mensagem, Superficie, TituloSecao } from '../../components/ui';
import { cores, espaco, raio, tipo } from '../../theme';

const DIAS_RETROATIVOS = 7;

// Últimos 7 dias (hoje incluso) para o registro manual.
function opcoesDeDia() {
  return Array.from({ length: DIAS_RETROATIVOS }, (_, i) => {
    const data = new Date(Date.now() - i * 86_400_000);
    const rotulo =
      i === 0 ? 'Hoje' : i === 1 ? 'Ontem' : data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
    return { diasAtras: i, rotulo };
  });
}

const minutosParaSegundos = (texto) => Math.round((Number(texto.replace(',', '.')) || 0) * 60);

function TempoEtapa({ nome, cor, fundo, texto, valor }) {
  return (
    <View style={[estilos.tempoEtapa, { backgroundColor: fundo }]}>
      <View style={estilos.tempoTopo}>
        <Marcador cor={cor} />
        <Text style={[tipo.rotulo, { color: texto }]}>{nome}</Text>
      </View>
      <Text style={[tipo.numero, estilos.tempoValor]}>{valor}</Text>
    </View>
  );
}

export default function Registrar() {
  const { origem } = useLocalSearchParams();
  const manual = origem !== 'cronometro';
  const cronometro = useCronometro();
  const atualizar = useAtualizarAposDevocional();

  const [minutosLeitura, setMinutosLeitura] = useState('');
  const [minutosOracao, setMinutosOracao] = useState('');
  const [diasAtras, setDiasAtras] = useState(0);
  const [passagens, setPassagens] = useState([]);
  const [visivelAmigos, setVisivelAmigos] = useState(false);
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const leituraMs = tempoDaEtapa(cronometro, ETAPAS.LEITURA);
  const oracaoMs = tempoDaEtapa(cronometro, ETAPAS.ORACAO);

  async function salvar() {
    setErro(null);
    setSalvando(true);
    try {
      const corpo = manual
        ? {
            iniciadoEm: new Date(Date.now() - diasAtras * 86_400_000).toISOString(),
            duracaoLeituraSeg: minutosParaSegundos(minutosLeitura),
            duracaoOracaoSeg: minutosParaSegundos(minutosOracao),
            manual: true,
          }
        : {
            iniciadoEm: cronometro.iniciadoEm,
            duracaoLeituraSeg: Math.round(leituraMs / 1000),
            duracaoOracaoSeg: Math.round(oracaoMs / 1000),
          };

      const devocional = await api('/devocionais', {
        metodo: 'POST',
        corpo: { ...corpo, passagens, visivelAmigos },
      });

      if (!manual) await cronometro.descartar();
      await atualizar();
      router.replace({
        pathname: '/devocional/concluido',
        params: {
          dia: devocional.dia,
          leituraSeg: devocional.duracaoLeituraSeg,
          oracaoSeg: devocional.duracaoOracaoSeg,
          capitulos: devocional.capitulosMarcados,
        },
      });
    } catch (e) {
      const detalhe = e.detalhes?.[0]?.mensagem;
      setErro(detalhe ?? e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
      <View>
        <TituloSecao>{manual ? 'Quando e por quanto tempo' : 'Seu tempo'}</TituloSecao>
        {manual ? (
          <View style={{ gap: espaco.md }}>
            <View style={estilos.dias} role="radiogroup" aria-label="Dia do devocional">
              {opcoesDeDia().map((opcao) => {
                const ativo = diasAtras === opcao.diasAtras;
                return (
                  <Pressable
                    key={opcao.diasAtras}
                    onPress={() => setDiasAtras(opcao.diasAtras)}
                    role="radio"
                    aria-checked={ativo}
                    style={[estilos.dia, ativo && estilos.diaAtivo]}
                  >
                    <Text style={[tipo.rotulo, ativo && { color: cores.branco }]}>{opcao.rotulo}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={estilos.linha}>
              <Campo
                style={{ flex: 1 }}
                rotulo="Leitura, em minutos"
                value={minutosLeitura}
                onChangeText={setMinutosLeitura}
                keyboardType="numeric"
                placeholder="0"
              />
              <Campo
                style={{ flex: 1 }}
                rotulo="Oração, em minutos"
                value={minutosOracao}
                onChangeText={setMinutosOracao}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>
        ) : (
          <View style={estilos.linha}>
            <TempoEtapa
              nome="Leitura"
              cor={cores.leitura}
              fundo={cores.leituraFundo}
              texto={cores.leituraTexto}
              valor={formatarCronometro(leituraMs)}
            />
            <TempoEtapa
              nome="Oração"
              cor={cores.oracao}
              fundo={cores.oracaoFundo}
              texto={cores.oracaoTexto}
              valor={formatarCronometro(oracaoMs)}
            />
          </View>
        )}
      </View>

      <View>
        <TituloSecao>O que você leu</TituloSecao>
        <Text style={[tipo.corpoMenor, { marginBottom: espaco.md }]}>
          Os capítulos entram sozinhos no seu checklist da Bíblia.
        </Text>
        <SeletorPassagens passagens={passagens} onChange={setPassagens} />
      </View>

      <Superficie style={estilos.compartilhar}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={tipo.corpoForte}>Compartilhar com amigos</Text>
          <Text style={tipo.corpoMenor}>Eles veem o tempo e as passagens. Suas anotações continuam só suas.</Text>
        </View>
        <Switch
          value={visivelAmigos}
          onValueChange={setVisivelAmigos}
          aria-label="Compartilhar com amigos"
          trackColor={{ true: cores.leitura, false: cores.linhaForte }}
          thumbColor={cores.branco}
          activeThumbColor={cores.branco}
        />
      </Superficie>

      <View style={{ gap: espaco.sm }}>
        <Mensagem texto={erro} />
        <Botao titulo="Salvar devocional" onPress={salvar} carregando={salvando} />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: espaco.md, paddingBottom: espaco.xxl, gap: espaco.xl },
  linha: { flexDirection: 'row', gap: espaco.sm },
  tempoEtapa: { flex: 1, borderRadius: raio.bloco, padding: espaco.md, gap: espaco.xs },
  tempoTopo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tempoValor: { fontSize: 34, lineHeight: 40 },
  dias: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  dia: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: raio.pilula,
    borderWidth: 1,
    borderColor: cores.linhaForte,
    backgroundColor: cores.branco,
  },
  diaAtivo: { backgroundColor: cores.tinta, borderColor: cores.tinta },
  compartilhar: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, padding: espaco.md },
});
