import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, apiPublica } from './client';

export const CHAVES = {
  livros: ['livros'],
  progresso: ['progresso'],
  hoje: ['devocionais', 'hoje'],
  devocionais: ['devocionais', 'lista'],
};

// Os 66 livros (fixos): busca uma vez e mantém em cache. Inclui um Map por id.
export function useLivros() {
  const consulta = useQuery({
    queryKey: CHAVES.livros,
    queryFn: () => apiPublica('/leitura/livros'),
    staleTime: Infinity,
  });
  const porId = useMemo(
    () => new Map((consulta.data?.livros ?? []).map((livro) => [livro.id, livro])),
    [consulta.data],
  );
  return { ...consulta, livros: consulta.data?.livros ?? [], porId };
}

export const useProgresso = () => useQuery({ queryKey: CHAVES.progresso, queryFn: () => api('/leitura/progresso') });

export const useResumoHoje = () => useQuery({ queryKey: CHAVES.hoje, queryFn: () => api('/devocionais/hoje') });

export const useDevocionaisRecentes = (limite = 5) =>
  useQuery({ queryKey: [...CHAVES.devocionais, limite], queryFn: () => api(`/devocionais?limite=${limite}`) });

// Depois de registrar/remover um devocional, atualiza tudo que depende dele.
export function useAtualizarAposDevocional() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['devocionais'] }),
      queryClient.invalidateQueries({ queryKey: CHAVES.progresso }),
    ]);
}
