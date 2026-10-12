import { Router } from 'express';
import { prisma } from '../../shared/db.js';
import { autenticar } from '../../shared/http/auth.js';
import { validate } from '../../shared/http/validate.js';
import { LIVROS, TOTAL_CAPITULOS } from '../../shared/biblia/livros.js';
import { capitulosSchema } from './leitura.schema.js';
import * as leituraService from './leitura.service.js';

export const leituraRoutes = Router();

leituraRoutes.get('/livros', (req, res) => {
  res.set('Cache-Control', 'public, max-age=86400');
  res.json({ totalCapitulos: TOTAL_CAPITULOS, livros: LIVROS });
});

leituraRoutes.get('/progresso', autenticar, async (req, res) => {
  res.json(await leituraService.progresso(req.usuario.id));
});

leituraRoutes.post('/capitulos', autenticar, validate({ body: capitulosSchema }), async (req, res) => {
  const { livro, capitulos } = req.validado.body;
  const marcados = await leituraService.marcarCapitulos(
    prisma,
    req.usuario.id,
    capitulos.map((capitulo) => ({ livro, capitulo })),
  );
  res.json({ marcados });
});

leituraRoutes.delete('/capitulos', autenticar, validate({ body: capitulosSchema }), async (req, res) => {
  const { livro, capitulos } = req.validado.body;
  res.json({ desmarcados: await leituraService.desmarcarCapitulos(req.usuario.id, livro, capitulos) });
});
