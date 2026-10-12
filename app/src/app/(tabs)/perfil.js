import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { api } from '../../api/client';
import { useAuth } from '../../store/auth';
import { Tela } from '../../components/Tela';
import { Botao, Superficie, TituloSecao } from '../../components/ui';
import { cores, espaco, raio, tipo } from '../../theme';

const iniciais = (nome = '') =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');

function Linha({ icone, rotulo, valor, primeiro }) {
  return (
    <View style={[estilos.linha, !primeiro && estilos.divisor]}>
      <Ionicons name={icone} size={18} color={cores.pedra} />
      <Text style={[tipo.corpo, { flex: 1 }]}>{rotulo}</Text>
      <Text style={tipo.corpoMenor}>{valor}</Text>
    </View>
  );
}

export default function Perfil() {
  const { usuario: salvo, refreshToken, sair } = useAuth();
  const { data: usuario = salvo } = useQuery({ queryKey: ['me'], queryFn: () => api('/usuarios/me') });

  async function sairDaConta() {
    // Revoga o refresh token no servidor; sai localmente mesmo se a API estiver fora do ar.
    await api('/auth/logout', { metodo: 'POST', corpo: { refreshToken } }).catch(() => {});
    await sair();
  }

  return (
    <Tela>
      <View style={estilos.identidade}>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarTexto}>{iniciais(usuario?.nome)}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={tipo.titulo} role="heading" aria-level={1}>
            {usuario?.nome}
          </Text>
          <Text style={tipo.corpoMenor}>@{usuario?.username}</Text>
        </View>
      </View>

      <View>
        <TituloSecao>Sua conta</TituloSecao>
        <Superficie>
          <Linha primeiro icone="home-outline" rotulo="Igreja" valor={usuario?.igreja || 'Não informada'} />
          <Linha
            icone={usuario?.perfilPrivado ? 'lock-closed-outline' : 'globe-outline'}
            rotulo="Perfil"
            valor={usuario?.perfilPrivado ? 'Privado' : 'Aberto'}
          />
          <Linha icone="alarm-outline" rotulo="Lembrete diário" valor={usuario?.horarioLembrete || 'Desligado'} />
        </Superficie>
      </View>

      <View>
        <TituloSecao>Sua caminhada</TituloSecao>
        <Text style={tipo.corpoMenor}>Em breve: calendário de constância e seus números pessoais.</Text>
      </View>

      <Botao titulo="Sair da conta" variante="secundario" onPress={sairDaConta} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  identidade: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: raio.pilula,
    backgroundColor: cores.leituraFundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: { ...tipo.numero, fontFamily: 'Fraunces_600SemiBold', fontSize: 24, color: cores.leituraTexto },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, padding: espaco.md },
  divisor: { borderTopWidth: 1, borderTopColor: cores.linha },
});
