import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { cores, espaco, raio, sombra, tipo } from '../theme';

// Variantes: primario (tinta), secundario (contorno), claro (branco sobre o céu), fantasma (só texto).
const VARIANTES = {
  primario: { fundo: cores.tinta, texto: cores.branco, borda: cores.tinta },
  secundario: { fundo: 'transparent', texto: cores.tinta, borda: cores.linhaForte },
  claro: { fundo: cores.branco, texto: cores.tinta, borda: cores.branco },
  fantasma: { fundo: 'transparent', texto: cores.azulTexto, borda: 'transparent' },
  fantasmaClaro: { fundo: 'transparent', texto: cores.branco, borda: 'transparent' },
};

export function Botao({ titulo, onPress, carregando, variante = 'primario', disabled, icone }) {
  const v = VARIANTES[variante];
  const fantasma = variante.startsWith('fantasma');
  return (
    <Pressable
      role="button"
      aria-label={titulo}
      aria-disabled={disabled || carregando}
      onPress={onPress}
      disabled={disabled || carregando}
      style={({ pressed }) => [
        estilos.botao,
        fantasma && estilos.botaoFantasma,
        { backgroundColor: v.fundo, borderColor: v.borda },
        pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.4 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={v.texto} />
      ) : (
        <View style={estilos.botaoConteudo}>
          {icone}
          <Text style={[tipo.botao, { color: v.texto }]}>{titulo}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Campo({ rotulo, dica, style, ...props }) {
  const [focado, setFocado] = useState(false);
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text style={tipo.rotulo}>{rotulo}</Text>
      <TextInput
        aria-label={rotulo}
        placeholderTextColor={cores.seixo}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        style={[estilos.campo, focado && estilos.campoFocado]}
        {...props}
      />
      {dica ? <Text style={tipo.legenda}>{dica}</Text> : null}
    </View>
  );
}

// Superfície branca com borda fina: listas e grupos de conteúdo.
export function Superficie({ children, style }) {
  return <View style={[estilos.superficie, style]}>{children}</View>;
}

// Bloco com lavagem pastel, para destaques (sem borda nem sombra).
export function Bloco({ children, cor = cores.pessego, style }) {
  return <View style={[estilos.bloco, { backgroundColor: cor }, style]}>{children}</View>;
}

export function TituloSecao({ children, acao }) {
  return (
    <View style={estilos.tituloSecao}>
      <Text style={tipo.tituloSecao} role="heading">
        {children}
      </Text>
      {acao}
    </View>
  );
}

export function Mensagem({ texto, tipo: tipoMensagem = 'erro' }) {
  if (!texto) return null;
  return (
    <Text role="alert" style={[tipo.corpoMenor, { color: tipoMensagem === 'erro' ? cores.erro : cores.pedra }]}>
      {texto}
    </Text>
  );
}

// Ponto colorido que identifica Leitura (turquesa) ou Oração (orquídea).
export function Marcador({ cor, tamanho = 8 }) {
  return <View style={{ width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: cor }} />;
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: 52,
    paddingHorizontal: espaco.lg,
    borderRadius: raio.pilula,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoFantasma: { minHeight: 44 },
  botaoConteudo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  campo: {
    ...tipo.corpo,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.linhaForte,
    borderRadius: raio.campo,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  campoFocado: { borderColor: cores.azul, boxShadow: `0px 0px 0px 2px ${cores.azul}33` },
  superficie: {
    backgroundColor: cores.branco,
    borderRadius: raio.lista,
    borderWidth: 1,
    borderColor: cores.linha,
    boxShadow: sombra.sutil,
  },
  bloco: { borderRadius: raio.bloco, padding: espaco.lg, gap: espaco.sm },
  tituloSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: espaco.sm,
  },
});
