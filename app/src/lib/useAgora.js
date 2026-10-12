import { useEffect, useState } from 'react';

// Re-renderiza a cada intervalo enquanto "ativo" for verdadeiro (usado pelos cronômetros).
export function useAgora(ativo, intervaloMs = 1000) {
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    setAgora(Date.now());
    if (!ativo) return undefined;
    const id = setInterval(() => setAgora(Date.now()), intervaloMs);
    return () => clearInterval(id);
  }, [ativo, intervaloMs]);

  return agora;
}
