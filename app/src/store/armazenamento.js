import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// SecureStore no celular; localStorage no navegador (desenvolvimento web).
export const armazenamento = {
  async ler(chave) {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(chave) ?? null;
    return SecureStore.getItemAsync(chave);
  },
  async gravar(chave, valor) {
    if (Platform.OS === 'web') return globalThis.localStorage?.setItem(chave, valor);
    return SecureStore.setItemAsync(chave, valor);
  },
  async remover(chave) {
    if (Platform.OS === 'web') return globalThis.localStorage?.removeItem(chave);
    return SecureStore.deleteItemAsync(chave);
  },
};
