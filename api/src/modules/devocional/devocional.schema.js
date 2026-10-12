import { z } from 'zod';
import { buscarLivro, capituloValido } from '../../shared/biblia/livros.js';

// Limite por registro: evita números irreais (ex.: cronômetro esquecido ligado).
export const DURACAO_MAXIMA_SEG = 4 * 60 * 60;

const duracao = z.number().int().min(0).max(DURACAO_MAXIMA_SEG).default(0);

export const passagemSchema = z
  .object({
    livro: z.string().trim().toUpperCase(),
    capituloInicio: z.number().int(),
    capituloFim: z.number().int(),
    versiculoInicio: z.number().int().min(1).optional(),
    versiculoFim: z.number().int().min(1).optional(),
  })
  .superRefine((p, ctx) => {
    if (!buscarLivro(p.livro)) {
      ctx.addIssue({ code: 'custom', path: ['livro'], message: 'Livro inválido' });
      return;
    }
    if (!capituloValido(p.livro, p.capituloInicio) || !capituloValido(p.livro, p.capituloFim)) {
      ctx.addIssue({ code: 'custom', path: ['capituloInicio'], message: 'Capítulo inválido para este livro' });
    }
    if (p.capituloFim < p.capituloInicio) {
      ctx.addIssue({ code: 'custom', path: ['capituloFim'], message: 'O capítulo final vem antes do inicial' });
    }
    if (
      p.versiculoInicio &&
      p.versiculoFim &&
      p.capituloInicio === p.capituloFim &&
      p.versiculoFim < p.versiculoInicio
    ) {
      ctx.addIssue({ code: 'custom', path: ['versiculoFim'], message: 'O versículo final vem antes do inicial' });
    }
  });

export const criarDevocionalSchema = z
  .object({
    iniciadoEm: z.iso.datetime({ offset: true }),
    duracaoLeituraSeg: duracao,
    duracaoOracaoSeg: duracao,
    manual: z.boolean().default(false),
    visivelAmigos: z.boolean().default(false),
    passagens: z.array(passagemSchema).max(20).default([]),
  })
  .refine((d) => d.duracaoLeituraSeg + d.duracaoOracaoSeg > 0 || d.passagens.length > 0, {
    message: 'Registre o tempo do devocional ou as passagens lidas',
    path: ['duracaoLeituraSeg'],
  })
  .refine((d) => d.duracaoLeituraSeg + d.duracaoOracaoSeg <= DURACAO_MAXIMA_SEG, {
    message: 'O tempo total passa de 4 horas',
    path: ['duracaoOracaoSeg'],
  });

export const listarSchema = z.object({
  cursor: z.uuid().optional(),
  limite: z.coerce.number().int().min(1).max(50).default(20),
});

export const idSchema = z.object({ id: z.uuid() });
