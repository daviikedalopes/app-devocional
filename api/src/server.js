import { env } from './config/env.js';
import { criarApp } from './app.js';
import { prisma } from './shared/db.js';

const app = criarApp();

const server = app.listen(env.PORT, () => {
  console.log(`API do App Devocional rodando em http://localhost:${env.PORT}`);
});

async function encerrar() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
