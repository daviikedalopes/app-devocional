import { create } from 'zustand';
import { armazenamento } from './armazenamento';

const CHAVE = 'devocional.cronometro';

export const ETAPAS = { LEITURA: 'LEITURA', ORACAO: 'ORACAO' };

const inicial = {
  iniciadoEm: null, // ISO do primeiro "Iniciar"
  etapa: ETAPAS.LEITURA,
  rodandoDesde: null, // timestamp (ms) de quando a etapa atual voltou a contar; null = pausado
  acumuladoMs: { LEITURA: 0, ORACAO: 0 },
};

// O tempo é calculado a partir de timestamps, então continua certo mesmo com o app fechado.
export function tempoDaEtapa(estado, etapa, agora = Date.now()) {
  const emAndamento = estado.etapa === etapa && estado.rodandoDesde ? agora - estado.rodandoDesde : 0;
  return estado.acumuladoMs[etapa] + emAndamento;
}

export const useCronometro = create((set, get) => {
  function salvar(mudancas) {
    set(mudancas);
    const { iniciadoEm, etapa, rodandoDesde, acumuladoMs } = get();
    armazenamento.gravar(CHAVE, JSON.stringify({ iniciadoEm, etapa, rodandoDesde, acumuladoMs })).catch(() => {});
  }

  function acumulado() {
    const { etapa, rodandoDesde, acumuladoMs } = get();
    if (!rodandoDesde) return acumuladoMs;
    return { ...acumuladoMs, [etapa]: acumuladoMs[etapa] + (Date.now() - rodandoDesde) };
  }

  return {
    ...inicial,
    carregando: true,

    async restaurar() {
      try {
        const salvo = await armazenamento.ler(CHAVE);
        if (salvo) set(JSON.parse(salvo));
      } catch {
        // Estado corrompido: começa do zero.
      } finally {
        set({ carregando: false });
      }
    },

    // Inicia ou continua a etapa atual.
    iniciar() {
      salvar({ iniciadoEm: get().iniciadoEm ?? new Date().toISOString(), rodandoDesde: Date.now() });
    },

    pausar() {
      salvar({ acumuladoMs: acumulado(), rodandoDesde: null });
    },

    trocarEtapa(etapa) {
      if (etapa === get().etapa) return;
      const rodando = Boolean(get().rodandoDesde);
      salvar({ acumuladoMs: acumulado(), etapa, rodandoDesde: rodando ? Date.now() : null });
    },

    async descartar() {
      set(inicial);
      await armazenamento.remover(CHAVE);
    },
  };
});
