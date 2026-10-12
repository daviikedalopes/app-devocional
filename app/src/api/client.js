import { useAuth } from '../store/auth';

// No celular físico, "localhost" é o próprio celular: use o IP da máquina no .env.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333';

export class ErroApi extends Error {
  constructor(status, corpo) {
    super(corpo?.erro ?? `Erro ${status}`);
    this.status = status;
    this.detalhes = corpo?.detalhes;
  }
}

async function requisitar(caminho, { metodo = 'GET', corpo, token } = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });

  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) throw new ErroApi(resposta.status, dados);
  return dados;
}

let renovacaoEmAndamento = null;

async function renovarSessao() {
  const { refreshToken, atualizarTokens, sair } = useAuth.getState();
  if (!refreshToken) throw new ErroApi(401, { erro: 'Sessão expirada' });

  try {
    const tokens = await requisitar('/auth/refresh', { metodo: 'POST', corpo: { refreshToken } });
    await atualizarTokens(tokens);
    return tokens.accessToken;
  } catch (erro) {
    await sair();
    throw erro;
  }
}

// Chamada autenticada: renova o access token uma vez se ele tiver expirado.
export async function api(caminho, opcoes = {}) {
  const { accessToken } = useAuth.getState();
  try {
    return await requisitar(caminho, { ...opcoes, token: accessToken });
  } catch (erro) {
    if (!(erro instanceof ErroApi) || erro.status !== 401 || !accessToken) throw erro;

    renovacaoEmAndamento ??= renovarSessao().finally(() => {
      renovacaoEmAndamento = null;
    });
    const novoToken = await renovacaoEmAndamento;
    return requisitar(caminho, { ...opcoes, token: novoToken });
  }
}

// Chamadas públicas (login, cadastro, lista de livros).
export const apiPublica = (caminho, opcoes) => requisitar(caminho, opcoes);
