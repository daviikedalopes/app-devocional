import { Prisma } from '@prisma/client';
import { AppError } from './errors.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message, detalhes: err.detalhes });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const campos = err.meta?.target;
    return res.status(409).json({ erro: 'Registro já existe', detalhes: { campos } });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido' });
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}
