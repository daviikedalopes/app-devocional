import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './shared/http/errorHandler.js';
import { naoEncontrado } from './shared/http/errors.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { usuarioRoutes } from './modules/usuario/usuario.routes.js';
import { leituraRoutes } from './modules/leitura/leitura.routes.js';
import { devocionalRoutes } from './modules/devocional/devocional.routes.js';

export function criarApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS === '*' ? '*' : env.CORS_ORIGINS.split(',') }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/auth', authRoutes);
  app.use('/usuarios', usuarioRoutes);
  app.use('/leitura', leituraRoutes);
  app.use('/devocionais', devocionalRoutes);

  app.use((req, res, next) => next(naoEncontrado('Rota não encontrada')));
  app.use(errorHandler);

  return app;
}
