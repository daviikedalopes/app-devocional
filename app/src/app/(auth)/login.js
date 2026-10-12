import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { apiPublica } from '../../api/client';
import { useAuth } from '../../store/auth';
import { Ceu } from '../../components/Ceu';
import { Botao, Campo, Mensagem } from '../../components/ui';
import { cores, espaco, tipo } from '../../theme';

export default function Login() {
  const entrar = useAuth((s) => s.entrar);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, []),
  );

  async function fazerLogin() {
    setErro(null);
    setEnviando(true);
    try {
      const sessao = await apiPublica('/auth/login', { metodo: 'POST', corpo: { email, senha } });
      await entrar(sessao);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Ceu style={estilos.ceu}>
          <Text style={estilos.marca} role="heading" aria-level={1}>
            Devocional
          </Text>
          <Text style={estilos.lema}>Um tempo com Deus, todos os dias.</Text>
        </Ceu>

        <View style={estilos.formulario}>
          <Campo
            rotulo="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Campo
            rotulo="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoComplete="password"
            onSubmitEditing={fazerLogin}
          />
          <Mensagem texto={erro} />
          <Botao titulo="Entrar" onPress={fazerLogin} carregando={enviando} />
          <Botao titulo="Criar uma conta" variante="fantasma" onPress={() => router.push('/cadastro')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  ceu: { minHeight: 300, justifyContent: 'flex-end', gap: espaco.sm },
  marca: { ...tipo.display, fontSize: 52, lineHeight: 56, color: cores.branco },
  lema: { ...tipo.escritura, color: 'rgba(255, 255, 255, 0.92)' },
  formulario: { padding: espaco.lg, gap: espaco.md, width: '100%', maxWidth: 480, alignSelf: 'center' },
});
