import { Router } from 'express';
import { autenticar } from '../../shared/http/auth.js';
import { validate } from '../../shared/http/validate.js';
import { atualizarPerfilSchema } from './usuario.schema.js';
import * as usuarioService from './usuario.service.js';

export const usuarioRoutes = Router();

usuarioRoutes.use(autenticar);

usuarioRoutes.get('/me', async (req, res) => {
  res.json(await usuarioService.buscarPerfil(req.usuario.id));
});

usuarioRoutes.patch('/me', validate({ body: atualizarPerfilSchema }), async (req, res) => {
  res.json(await usuarioService.atualizarPerfil(req.usuario.id, req.validado.body));
});
