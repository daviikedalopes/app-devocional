// Dados do próprio usuário (nunca expõe senhaHash nem ids de login social).
export const paraUsuarioDTO = (u) => ({
  id: u.id,
  nome: u.nome,
  username: u.username,
  email: u.email,
  emailConfirmado: Boolean(u.emailConfirmadoEm),
  dataNascimento: u.dataNascimento.toISOString().slice(0, 10),
  fotoUrl: u.fotoUrl,
  bio: u.bio,
  igreja: u.igreja,
  perfilPrivado: u.perfilPrivado,
  timezone: u.timezone,
  horarioLembrete: u.horarioLembrete,
  papel: u.papel,
  criadoEm: u.criadoEm,
});
