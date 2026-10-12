import { create } from 'zustand';
import { armazenamento } from './armazenamento';

const CHAVE_SESSAO = 'devocional.sessao';

// Sessão do usuário: tokens + dados básicos. Persistida no armazenamento seguro.
export const useAuth = create((set, get) => ({
  carregando: true,
  accessToken: null,
  refreshToken: null,
  usuario: null,

  async restaurar() {
    try {
      const salvo = await armazenamento.ler(CHAVE_SESSAO);
      if (salvo) set(JSON.parse(salvo));
    } finally {
      set({ carregando: false });
    }
  },

  async entrar({ accessToken, refreshToken, usuario }) {
    set({ accessToken, refreshToken, usuario });
    await armazenamento.gravar(CHAVE_SESSAO, JSON.stringify({ accessToken, refreshToken, usuario }));
  },

  async atualizarTokens({ accessToken, refreshToken }) {
    const { usuario } = get();
    await get().entrar({ accessToken, refreshToken, usuario });
  },

  async sair() {
    set({ accessToken: null, refreshToken: null, usuario: null });
    await armazenamento.remover(CHAVE_SESSAO);
  },
}));
