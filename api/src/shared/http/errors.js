export class AppError extends Error {
  constructor(status, mensagem, detalhes) {
    super(mensagem);
    this.status = status;
    this.detalhes = detalhes;
  }
}

export const naoEncontrado = (mensagem = 'Recurso não encontrado') => new AppError(404, mensagem);
export const naoAutorizado = (mensagem = 'Não autenticado') => new AppError(401, mensagem);
export const proibido = (mensagem = 'Acesso negado') => new AppError(403, mensagem);
export const conflito = (mensagem) => new AppError(409, mensagem);
export const requisicaoInvalida = (mensagem, detalhes) => new AppError(400, mensagem, detalhes);
