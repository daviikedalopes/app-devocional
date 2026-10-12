import { Router } from 'express';
import { autenticar } from '../../shared/http/auth.js';
import { validate } from '../../shared/http/validate.js';
import { criarDevocionalSchema, idSchema, listarSchema } from './devocional.schema.js';
import * as devocionalService from './devocional.service.js';

export const devocionalRoutes = Router();

devocionalRoutes.use(autenticar);

devocionalRoutes.post('/', validate({ body: criarDevocionalSchema }), async (req, res) => {
  res.status(201).json(await devocionalService.criar(req.usuario.id, req.validado.body));
});

devocionalRoutes.get('/', validate({ query: listarSchema }), async (req, res) => {
  res.json(await devocionalService.listar(req.usuario.id, req.validado.query));
});

devocionalRoutes.get('/hoje', async (req, res) => {
  res.json(await devocionalService.resumoDeHoje(req.usuario.id));
});

devocionalRoutes.get('/:id', validate({ params: idSchema }), async (req, res) => {
  res.json(await devocionalService.buscar(req.usuario.id, req.validado.params.id));
});

devocionalRoutes.delete('/:id', validate({ params: idSchema }), async (req, res) => {
  await devocionalService.remover(req.usuario.id, req.validado.params.id);
  res.status(204).end();
});
