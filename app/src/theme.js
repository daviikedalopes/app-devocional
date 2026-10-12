// Sistema visual "amanhecer": um céu azul→turquesa abre o dia (só no topo da aba Hoje e no login)
// e, abaixo dele, uma superfície de papel calma. Base: DESIGN.md / variables.css, adaptada ao app.
import { Fraunces_400Regular } from '@expo-google-fonts/fraunces/400Regular';
import { Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces/400Regular_Italic';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { Figtree_400Regular } from '@expo-google-fonts/figtree/400Regular';
import { Figtree_500Medium } from '@expo-google-fonts/figtree/500Medium';
import { Figtree_600SemiBold } from '@expo-google-fonts/figtree/600SemiBold';
import { Figtree_700Bold } from '@expo-google-fonts/figtree/700Bold';

export const arquivosDeFonte = {
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_600SemiBold,
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
};

export const cores = {
  // Neutros (tinta sobre papel)
  tinta: '#221f1c',
  pedra: '#797267', // texto secundário
  seixo: '#8c8a88', // texto terciário, desabilitado
  papel: '#f5f5f5', // fundo das telas
  branco: '#ffffff', // superfícies
  linha: 'rgba(34, 31, 28, 0.09)', // bordas finas
  linhaForte: 'rgba(34, 31, 28, 0.18)',

  // Céu do amanhecer (gradiente), só em aberturas
  ceuInicio: '#518bdb',
  ceuFim: '#36bab8',
  azul: '#518bdb', // anel de foco, estados ativos
  azulTexto: '#2f6bbd', // links: contraste AA sobre branco

  // Cor = significado: Leitura é turquesa, Oração é orquídea
  leitura: '#36bab8',
  leituraFundo: '#cff2ef',
  leituraTexto: '#1d6e6c',
  oracao: '#bf89cd',
  oracaoFundo: '#ede9fe',
  oracaoTexto: '#7a4a8a',

  // Lavagens pastel
  pessego: '#f8ebd8', // conclusão, encorajamento
  menta: '#cbfbf1',

  // Marcadores
  ambar: '#e5a057', // Antigo Testamento na estante
  coral: '#ed6d68',
  erro: '#b8332e',
};

export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

// Raio por hierarquia: ações e chips em pílula, campos 8, listas 14, blocos de destaque 18.
export const raio = { campo: 8, celula: 10, lista: 14, bloco: 18, pilula: 999 };

export const sombra = {
  sutil: '0px 1px 2px rgba(34, 31, 28, 0.06), 0px 1px 3px rgba(34, 31, 28, 0.05)',
  flutuante: '0px 10px 15px -3px rgba(34, 31, 28, 0.10), 0px 4px 6px -4px rgba(34, 31, 28, 0.08)',
};

const figtree = (peso) =>
  ({ 400: 'Figtree_400Regular', 500: 'Figtree_500Medium', 600: 'Figtree_600SemiBold', 700: 'Figtree_700Bold' })[peso];

// Estilos de texto. Fraunces só em títulos, números grandes e Escritura; Figtree no resto.
export const tipo = {
  display: { fontFamily: 'Fraunces_600SemiBold', fontSize: 38, lineHeight: 44, letterSpacing: 0.4, color: cores.tinta },
  titulo: { fontFamily: 'Fraunces_600SemiBold', fontSize: 30, lineHeight: 36, letterSpacing: 0.3, color: cores.tinta },
  tituloSecao: { fontFamily: figtree(600), fontSize: 18, lineHeight: 24, letterSpacing: -0.2, color: cores.tinta },
  numero: { fontFamily: 'Fraunces_400Regular', fontVariant: ['tabular-nums'], color: cores.tinta },
  escritura: { fontFamily: 'Fraunces_400Regular_Italic', fontSize: 17, lineHeight: 26, color: cores.tinta },
  corpo: { fontFamily: figtree(400), fontSize: 16, lineHeight: 24, color: cores.tinta },
  corpoForte: { fontFamily: figtree(600), fontSize: 16, lineHeight: 24, color: cores.tinta },
  corpoMenor: { fontFamily: figtree(400), fontSize: 14, lineHeight: 20, color: cores.pedra },
  rotulo: { fontFamily: figtree(500), fontSize: 14, lineHeight: 20, color: cores.tinta },
  legenda: { fontFamily: figtree(500), fontSize: 12, lineHeight: 16, color: cores.pedra },
  botao: { fontFamily: figtree(600), fontSize: 16, lineHeight: 20 },
};
