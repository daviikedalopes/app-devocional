import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { apiPublica } from '../../api/client';
import { useAuth } from '../../store/auth';
import { Botao, Campo, Mensagem } from '../../components/ui';
import { espaco, tipo } from '../../theme';

// Converte "DD/MM/AAAA" em "AAAA-MM-DD".
function paraIso(data) {
  const [dia, mes, ano] = data.split('/');
  return ano && mes && dia ? `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}` : data;
}

export default function Cadastro() {
  const entrar = useAuth((s) => s.entrar);
  const [form, setForm] = useState({ nome: '', username: '', email: '', senha: '', dataNascimento: '' });
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  async function cadastrar() {
    setErro(null);
    setEnviando(true);
    try {
      const sessao = await apiPublica('/auth/cadastro', {
        metodo: 'POST',
        corpo: {
          ...form,
          dataNascimento: paraIso(form.dataNascimento),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      await entrar(sessao);
    } catch (e) {
      const primeiroDetalhe = e.detalhes?.[0]?.mensagem;
      setErro(primeiroDetalhe ? `${e.message}: ${primeiroDetalhe}` : e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
      <View style={{ gap: espaco.xs }}>
        <Text style={tipo.titulo} role="heading" aria-level={1}>
          Criar sua conta
        </Text>
        <Text style={tipo.corpoMenor}>Leva menos de um minuto.</Text>
      </View>
      <Campo rotulo="Nome" value={form.nome} onChangeText={alterar('nome')} autoComplete="name" />
      <Campo
        rotulo="Nome de usuário"
        dica="Seus amigos vão te encontrar por ele. Letras, números, _ ou ."
        value={form.username}
        onChangeText={alterar('username')}
        autoCapitalize="none"
      />
      <Campo
        rotulo="E-mail"
        value={form.email}
        onChangeText={alterar('email')}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Campo
        rotulo="Senha"
        dica="Pelo menos 8 caracteres."
        value={form.senha}
        onChangeText={alterar('senha')}
        secureTextEntry
        autoComplete="new-password"
      />
      <Campo
        rotulo="Data de nascimento"
        placeholder="DD/MM/AAAA"
        value={form.dataNascimento}
        onChangeText={alterar('dataNascimento')}
        keyboardType="numbers-and-punctuation"
      />
      <Mensagem texto={erro} />
      <Botao titulo="Criar conta" onPress={cadastrar} carregando={enviando} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: espaco.lg, paddingBottom: espaco.xxl, gap: espaco.md, width: '100%', maxWidth: 480, alignSelf: 'center' },
});
