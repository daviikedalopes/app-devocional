import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Respeita a preferência do sistema por menos movimento.
export function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((valor) => ativo && setReduzido(valor))
      .catch(() => {});
    const assinatura = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduzido);
    return () => {
      ativo = false;
      assinatura?.remove?.();
    };
  }, []);

  return reduzido;
}
