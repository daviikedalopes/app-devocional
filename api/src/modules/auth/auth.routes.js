import { Router } from 'express';
import { validate } from '../../shared/http/validate.js';
import { cadastroSchema, loginSchema, refreshSchema } from './auth.schema.js';
import * as authService from './auth.service.js';

export const authRoutes = Router();

authRoutes.post('/cadastro', validate({ body: cadastroSchema }), async (req, res) => {
  res.status(201).json(await authService.cadastrar(req.validado.body));
});

authRoutes.post('/login', validate({ body: loginSchema }), async (req, res) => {
  res.json(await authService.login(req.validado.body));
});

authRoutes.post('/refresh', validate({ body: refreshSchema }), async (req, res) => {
  res.json(await authService.renovar(req.validado.body.refreshToken));
});

authRoutes.post('/logout', validate({ body: refreshSchema }), async (req, res) => {
  await authService.logout(req.validado.body.refreshToken);
  res.status(204).end();
});
