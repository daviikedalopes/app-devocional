// Os 66 livros da Bíblia (cânon protestante), na ordem tradicional.
// "id" é o código USFM, usado como referência estável no banco.

export const SECOES = {
  PENTATEUCO: 'Pentateuco',
  HISTORICOS: 'Históricos',
  POETICOS: 'Poéticos',
  PROFETAS_MAIORES: 'Profetas Maiores',
  PROFETAS_MENORES: 'Profetas Menores',
  EVANGELHOS: 'Evangelhos',
  ATOS: 'Histórico',
  CARTAS_PAULINAS: 'Cartas Paulinas',
  CARTAS_GERAIS: 'Cartas Gerais',
  PROFETICO: 'Profético',
};

const at = (id, nome, abreviacao, capitulos, secao) => ({ id, nome, abreviacao, capitulos, testamento: 'AT', secao });
const nt = (id, nome, abreviacao, capitulos, secao) => ({ id, nome, abreviacao, capitulos, testamento: 'NT', secao });

const S = SECOES;

export const LIVROS = [
  at('GEN', 'Gênesis', 'Gn', 50, S.PENTATEUCO),
  at('EXO', 'Êxodo', 'Êx', 40, S.PENTATEUCO),
  at('LEV', 'Levítico', 'Lv', 27, S.PENTATEUCO),
  at('NUM', 'Números', 'Nm', 36, S.PENTATEUCO),
  at('DEU', 'Deuteronômio', 'Dt', 34, S.PENTATEUCO),
  at('JOS', 'Josué', 'Js', 24, S.HISTORICOS),
  at('JDG', 'Juízes', 'Jz', 21, S.HISTORICOS),
  at('RUT', 'Rute', 'Rt', 4, S.HISTORICOS),
  at('1SA', '1 Samuel', '1Sm', 31, S.HISTORICOS),
  at('2SA', '2 Samuel', '2Sm', 24, S.HISTORICOS),
  at('1KI', '1 Reis', '1Rs', 22, S.HISTORICOS),
  at('2KI', '2 Reis', '2Rs', 25, S.HISTORICOS),
  at('1CH', '1 Crônicas', '1Cr', 29, S.HISTORICOS),
  at('2CH', '2 Crônicas', '2Cr', 36, S.HISTORICOS),
  at('EZR', 'Esdras', 'Ed', 10, S.HISTORICOS),
  at('NEH', 'Neemias', 'Ne', 13, S.HISTORICOS),
  at('EST', 'Ester', 'Et', 10, S.HISTORICOS),
  at('JOB', 'Jó', 'Jó', 42, S.POETICOS),
  at('PSA', 'Salmos', 'Sl', 150, S.POETICOS),
  at('PRO', 'Provérbios', 'Pv', 31, S.POETICOS),
  at('ECC', 'Eclesiastes', 'Ec', 12, S.POETICOS),
  at('SNG', 'Cânticos', 'Ct', 8, S.POETICOS),
  at('ISA', 'Isaías', 'Is', 66, S.PROFETAS_MAIORES),
  at('JER', 'Jeremias', 'Jr', 52, S.PROFETAS_MAIORES),
  at('LAM', 'Lamentações', 'Lm', 5, S.PROFETAS_MAIORES),
  at('EZK', 'Ezequiel', 'Ez', 48, S.PROFETAS_MAIORES),
  at('DAN', 'Daniel', 'Dn', 12, S.PROFETAS_MAIORES),
  at('HOS', 'Oseias', 'Os', 14, S.PROFETAS_MENORES),
  at('JOL', 'Joel', 'Jl', 3, S.PROFETAS_MENORES),
  at('AMO', 'Amós', 'Am', 9, S.PROFETAS_MENORES),
  at('OBA', 'Obadias', 'Ob', 1, S.PROFETAS_MENORES),
  at('JON', 'Jonas', 'Jn', 4, S.PROFETAS_MENORES),
  at('MIC', 'Miqueias', 'Mq', 7, S.PROFETAS_MENORES),
  at('NAM', 'Naum', 'Na', 3, S.PROFETAS_MENORES),
  at('HAB', 'Habacuque', 'Hc', 3, S.PROFETAS_MENORES),
  at('ZEP', 'Sofonias', 'Sf', 3, S.PROFETAS_MENORES),
  at('HAG', 'Ageu', 'Ag', 2, S.PROFETAS_MENORES),
  at('ZEC', 'Zacarias', 'Zc', 14, S.PROFETAS_MENORES),
  at('MAL', 'Malaquias', 'Ml', 4, S.PROFETAS_MENORES),

  nt('MAT', 'Mateus', 'Mt', 28, S.EVANGELHOS),
  nt('MRK', 'Marcos', 'Mc', 16, S.EVANGELHOS),
  nt('LUK', 'Lucas', 'Lc', 24, S.EVANGELHOS),
  nt('JHN', 'João', 'Jo', 21, S.EVANGELHOS),
  nt('ACT', 'Atos', 'At', 28, S.ATOS),
  nt('ROM', 'Romanos', 'Rm', 16, S.CARTAS_PAULINAS),
  nt('1CO', '1 Coríntios', '1Co', 16, S.CARTAS_PAULINAS),
  nt('2CO', '2 Coríntios', '2Co', 13, S.CARTAS_PAULINAS),
  nt('GAL', 'Gálatas', 'Gl', 6, S.CARTAS_PAULINAS),
  nt('EPH', 'Efésios', 'Ef', 6, S.CARTAS_PAULINAS),
  nt('PHP', 'Filipenses', 'Fp', 4, S.CARTAS_PAULINAS),
  nt('COL', 'Colossenses', 'Cl', 4, S.CARTAS_PAULINAS),
  nt('1TH', '1 Tessalonicenses', '1Ts', 5, S.CARTAS_PAULINAS),
  nt('2TH', '2 Tessalonicenses', '2Ts', 3, S.CARTAS_PAULINAS),
  nt('1TI', '1 Timóteo', '1Tm', 6, S.CARTAS_PAULINAS),
  nt('2TI', '2 Timóteo', '2Tm', 4, S.CARTAS_PAULINAS),
  nt('TIT', 'Tito', 'Tt', 3, S.CARTAS_PAULINAS),
  nt('PHM', 'Filemom', 'Fm', 1, S.CARTAS_PAULINAS),
  nt('HEB', 'Hebreus', 'Hb', 13, S.CARTAS_GERAIS),
  nt('JAS', 'Tiago', 'Tg', 5, S.CARTAS_GERAIS),
  nt('1PE', '1 Pedro', '1Pe', 5, S.CARTAS_GERAIS),
  nt('2PE', '2 Pedro', '2Pe', 3, S.CARTAS_GERAIS),
  nt('1JN', '1 João', '1Jo', 5, S.CARTAS_GERAIS),
  nt('2JN', '2 João', '2Jo', 1, S.CARTAS_GERAIS),
  nt('3JN', '3 João', '3Jo', 1, S.CARTAS_GERAIS),
  nt('JUD', 'Judas', 'Jd', 1, S.CARTAS_GERAIS),
  nt('REV', 'Apocalipse', 'Ap', 22, S.PROFETICO),
];

const porId = new Map(LIVROS.map((livro) => [livro.id, livro]));

export const buscarLivro = (id) => porId.get(id);

export const TOTAL_CAPITULOS = LIVROS.reduce((soma, livro) => soma + livro.capitulos, 0);

export function capituloValido(livroId, capitulo) {
  const livro = porId.get(livroId);
  return Boolean(livro) && Number.isInteger(capitulo) && capitulo >= 1 && capitulo <= livro.capitulos;
}
