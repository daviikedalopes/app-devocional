import { prisma } from '../../shared/db.js';
import { dateParaDia, diaLocal, diaParaDate } from '../../shared/datas.js';
import { naoEncontrado, requisicaoInvalida } from '../../shared/http/errors.js';
import { marcarCapitulos } from '../leitura/leitura.service.js';

const TOLERANCIA_FUTURO_MS = 5 * 60 * 1000;
const DIAS_RETROATIVOS = 7;

const paraDevocionalDTO = (d) => ({
  id: d.id,
  iniciadoEm: d.iniciadoEm,
  dia: dateParaDia(d.dia),
  duracaoLeituraSeg: d.duracaoLeituraSeg,
  duracaoOracaoSeg: d.duracaoOracaoSeg,
  manual: d.manual,
  visivelAmigos: d.visivelAmigos,
  passagens: d.passagens.map(({ livro, capituloInicio, capituloFim, versiculoInicio, versiculoFim }) => ({
    livro,
    capituloInicio,
    capituloFim,
    versiculoInicio,
    versiculoFim,
  })),
  criadoEm: d.criadoEm,
});

// Expande as passagens em capítulos individuais, sem repetição.
export function capitulosDasPassagens(passagens) {
  const vistos = new Set();
  const capitulos = [];
  for (const { livro, capituloInicio, capituloFim } of passagens) {
    for (let capitulo = capituloInicio; capitulo <= capituloFim; capitulo++) {
      const chave = `${livro}:${capitulo}`;
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      capitulos.push({ livro, capitulo });
    }
  }
  return capitulos;
}

async function timezoneDo(usuarioId) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId }, select: { timezone: true } });
  if (!usuario) throw naoEncontrado('Usuário não encontrado');
  return usuario.timezone;
}

export async function criar(usuarioId, dados) {
  const iniciadoEm = new Date(dados.iniciadoEm);
  const agora = Date.now();
  if (iniciadoEm.getTime() > agora + TOLERANCIA_FUTURO_MS) {
    throw requisicaoInvalida('A data do devocional não pode estar no futuro');
  }
  if (agora - iniciadoEm.getTime() > DIAS_RETROATIVOS * 24 * 60 * 60 * 1000) {
    throw requisicaoInvalida(`Só é possível registrar devocionais dos últimos ${DIAS_RETROATIVOS} dias`);
  }

  const dia = diaLocal(iniciadoEm, await timezoneDo(usuarioId));

  return prisma.$transaction(async (tx) => {
    const devocional = await tx.devocional.create({
      data: {
        usuarioId,
        iniciadoEm,
        dia: diaParaDate(dia),
        duracaoLeituraSeg: dados.duracaoLeituraSeg,
        duracaoOracaoSeg: dados.duracaoOracaoSeg,
        manual: dados.manual,
        visivelAmigos: dados.visivelAmigos,
        passagens: { create: dados.passagens },
      },
      include: { passagens: true },
    });

    const capitulosMarcados = await marcarCapitulos(
      tx,
      usuarioId,
      capitulosDasPassagens(dados.passagens),
      devocional.id,
    );

    return { ...paraDevocionalDTO(devocional), capitulosMarcados };
  });
}

export async function listar(usuarioId, { cursor, limite }) {
  const devocionais = await prisma.devocional.findMany({
    where: { usuarioId },
    include: { passagens: true },
    orderBy: [{ iniciadoEm: 'desc' }, { id: 'desc' }],
    take: limite + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
  });

  const temMais = devocionais.length > limite;
  const pagina = temMais ? devocionais.slice(0, limite) : devocionais;
  return {
    itens: pagina.map(paraDevocionalDTO),
    proximoCursor: temMais ? pagina.at(-1).id : null,
  };
}

export async function buscar(usuarioId, id) {
  const devocional = await prisma.devocional.findFirst({ where: { id, usuarioId }, include: { passagens: true } });
  if (!devocional) throw naoEncontrado('Devocional não encontrado');
  return paraDevocionalDTO(devocional);
}

// Remove o registro. Os capítulos continuam marcados no checklist.
export async function remover(usuarioId, id) {
  const { count } = await prisma.devocional.deleteMany({ where: { id, usuarioId } });
  if (count === 0) throw naoEncontrado('Devocional não encontrado');
}

// Resumo do dia de hoje no fuso do usuário.
export async function resumoDeHoje(usuarioId) {
  const dia = diaLocal(new Date(), await timezoneDo(usuarioId));
  const total = await prisma.devocional.aggregate({
    where: { usuarioId, dia: diaParaDate(dia) },
    _count: true,
    _sum: { duracaoLeituraSeg: true, duracaoOracaoSeg: true },
  });

  return {
    dia,
    devocionais: total._count,
    duracaoLeituraSeg: total._sum.duracaoLeituraSeg ?? 0,
    duracaoOracaoSeg: total._sum.duracaoOracaoSeg ?? 0,
  };
}
