import { prisma } from '../../shared/db.js';
import { LIVROS, TOTAL_CAPITULOS } from '../../shared/biblia/livros.js';

// Ciclo de leitura atual do usuário (o mais recente; 1 se ainda não leu nada).
export async function cicloAtual(db, usuarioId) {
  const ultimo = await db.capituloLido.aggregate({ where: { usuarioId }, _max: { ciclo: true } });
  return ultimo._max.ciclo ?? 1;
}

// Marca capítulos como lidos no ciclo atual. Capítulos já marcados são ignorados.
export async function marcarCapitulos(db, usuarioId, capitulos, devocionalId = null) {
  if (capitulos.length === 0) return 0;
  const ciclo = await cicloAtual(db, usuarioId);
  const { count } = await db.capituloLido.createMany({
    data: capitulos.map(({ livro, capitulo }) => ({ usuarioId, ciclo, livro, capitulo, devocionalId })),
    skipDuplicates: true,
  });
  return count;
}

export async function desmarcarCapitulos(usuarioId, livro, capitulos) {
  const ciclo = await cicloAtual(prisma, usuarioId);
  const { count } = await prisma.capituloLido.deleteMany({
    where: { usuarioId, ciclo, livro, capitulo: { in: capitulos } },
  });
  return count;
}

// Progresso do checklist no ciclo de leitura atual.
export async function progresso(usuarioId) {
  const ciclo = await cicloAtual(prisma, usuarioId);

  const lidos = await prisma.capituloLido.findMany({
    where: { usuarioId, ciclo },
    select: { livro: true, capitulo: true },
  });

  const porLivro = new Map();
  for (const { livro, capitulo } of lidos) {
    if (!porLivro.has(livro)) porLivro.set(livro, []);
    porLivro.get(livro).push(capitulo);
  }

  const livros = LIVROS.map((livro) => {
    const capitulosLidos = (porLivro.get(livro.id) ?? []).sort((a, b) => a - b);
    return {
      id: livro.id,
      capitulos: livro.capitulos,
      capitulosLidos,
      concluido: capitulosLidos.length === livro.capitulos,
    };
  });

  const somaTestamento = (testamento) =>
    LIVROS.filter((l) => l.testamento === testamento).reduce(
      (acc, l) => ({ lidos: acc.lidos + (porLivro.get(l.id)?.length ?? 0), total: acc.total + l.capitulos }),
      { lidos: 0, total: 0 },
    );

  return {
    ciclo,
    biblia: { lidos: lidos.length, total: TOTAL_CAPITULOS },
    antigoTestamento: somaTestamento('AT'),
    novoTestamento: somaTestamento('NT'),
    livros,
  };
}
