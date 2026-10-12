import { prisma } from '../../shared/db.js';
import { idadeEm } from '../../shared/datas.js';
import { naoEncontrado, requisicaoInvalida } from '../../shared/http/errors.js';
import { paraUsuarioDTO } from './usuario.dto.js';

export async function buscarPerfil(usuarioId) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw naoEncontrado('Usuário não encontrado');
  return paraUsuarioDTO(usuario);
}

export async function atualizarPerfil(usuarioId, dados) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw naoEncontrado('Usuário não encontrado');

  // Menores de 18 anos mantêm o perfil privado.
  if (dados.perfilPrivado === false && idadeEm(usuario.dataNascimento) < 18) {
    throw requisicaoInvalida('Perfis de menores de 18 anos permanecem privados');
  }

  const atualizado = await prisma.usuario.update({ where: { id: usuarioId }, data: dados });
  return paraUsuarioDTO(atualizado);
}
