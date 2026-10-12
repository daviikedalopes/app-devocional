import { z } from 'zod';
import { buscarLivro, capituloValido } from '../../shared/biblia/livros.js';

// Marcar/desmarcar capítulos manualmente no checklist.
export const capitulosSchema = z
  .object({
    livro: z.string().trim().toUpperCase(),
    capitulos: z.array(z.number().int()).min(1).max(150),
  })
  .superRefine((dados, ctx) => {
    if (!buscarLivro(dados.livro)) {
      ctx.addIssue({ code: 'custom', path: ['livro'], message: 'Livro inválido' });
      return;
    }
    const invalidos = dados.capitulos.filter((c) => !capituloValido(dados.livro, c));
    if (invalidos.length) {
      ctx.addIssue({ code: 'custom', path: ['capitulos'], message: `Capítulos inválidos: ${invalidos.join(', ')}` });
    }
  });
