import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { naoAutorizado } from './errors.js';

export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  if (tipo !== 'Bearer' || !token) throw naoAutorizado();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.usuario = { id: payload.sub, papel: payload.papel };
  } catch {
    throw naoAutorizado('Token inválido ou expirado');
  }
  next();
}
