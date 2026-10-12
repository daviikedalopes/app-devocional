import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { prisma } from '../../shared/db.js';
import { idadeEm } from '../../shared/datas.js';
import { conflito, naoAutorizado, requisicaoInvalida } from '../../shared/http/errors.js';
import { paraUsuarioDTO } from '../usuario/usuario.dto.js';

export const IDADE_MINIMA = 13;

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

async function emitirTokens(usuario) {
  const accessToken = jwt.sign({ papel: usuario.papel }, env.JWT_SECRET, {
    subject: usuario.id,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = randomBytes(48).toString('base64url');
  await prisma.refreshToken.create({
    data: {
      usuarioId: usuario.id,
      tokenHash: hashToken(refreshToken),
      expiraEm: new Date(Date.now() + env.REFRESH_TOKEN_DIAS * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken, usuario: paraUsuarioDTO(usuario) };
}

export async function cadastrar({ nome, username, email, senha, dataNascimento, timezone }) {
  if (idadeEm(dataNascimento) < IDADE_MINIMA) {
    throw requisicaoInvalida(`É preciso ter pelo menos ${IDADE_MINIMA} anos para usar o app`);
  }

  const existente = await prisma.usuario.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true },
  });
  if (existente) {
    throw conflito(existente.email === email ? 'E-mail já cadastrado' : 'Username já está em uso');
  }

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      username,
      email,
      senhaHash: await bcrypt.hash(senha, 10),
      dataNascimento: new Date(dataNascimento),
      ...(timezone && { timezone }),
    },
  });

  return emitirTokens(usuario);
}

export async function login({ email, senha }) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const senhaOk = usuario?.senhaHash && (await bcrypt.compare(senha, usuario.senhaHash));
  if (!senhaOk) throw naoAutorizado('E-mail ou senha incorretos');

  return emitirTokens(usuario);
}

// Troca o refresh token por um novo par (rotação: o token usado é revogado).
export async function renovar(refreshToken) {
  const registro = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(refreshToken) },
    include: { usuario: true },
  });

  if (!registro || registro.revogadoEm || registro.expiraEm < new Date()) {
    throw naoAutorizado('Sessão expirada, faça login novamente');
  }

  await prisma.refreshToken.update({ where: { id: registro.id }, data: { revogadoEm: new Date() } });
  return emitirTokens(registro.usuario);
}

export async function logout(refreshToken) {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(refreshToken), revogadoEm: null },
    data: { revogadoEm: new Date() },
  });
}
