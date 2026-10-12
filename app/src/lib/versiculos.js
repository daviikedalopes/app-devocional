// Versículos curtos de encorajamento.
export const VERSICULOS = [
  { texto: 'Aquietai-vos e sabei que eu sou Deus.', referencia: 'Salmos 46:10' },
  { texto: 'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.', referencia: 'Salmos 119:105' },
  { texto: 'Chegai-vos a Deus, e ele se chegará a vós.', referencia: 'Tiago 4:8' },
  { texto: 'Buscai primeiro o reino de Deus e a sua justiça.', referencia: 'Mateus 6:33' },
  { texto: 'As misericórdias do Senhor se renovam a cada manhã.', referencia: 'Lamentações 3:22-23' },
  { texto: 'Orai sem cessar.', referencia: '1 Tessalonicenses 5:17' },
  { texto: 'O Senhor é o meu pastor; nada me faltará.', referencia: 'Salmos 23:1' },
];

export const versiculoAleatorio = () => VERSICULOS[Math.floor(Math.random() * VERSICULOS.length)];

// O mesmo versículo o dia inteiro; muda à meia-noite.
export function versiculoDoDia(data = new Date()) {
  const diaDoAno = Math.floor((data - new Date(data.getFullYear(), 0, 0)) / 86_400_000);
  return VERSICULOS[diaDoAno % VERSICULOS.length];
}
