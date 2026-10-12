// Utilitários de data. Datas "de calendário" (sem hora) circulam como string YYYY-MM-DD.

export function idadeEm(dataNascimento, referencia = new Date()) {
  const nasc = new Date(dataNascimento);
  let idade = referencia.getUTCFullYear() - nasc.getUTCFullYear();
  const mes = referencia.getUTCMonth() - nasc.getUTCMonth();
  if (mes < 0 || (mes === 0 && referencia.getUTCDate() < nasc.getUTCDate())) idade--;
  return idade;
}

// Dia local (YYYY-MM-DD) de um instante no fuso horário informado.
export function diaLocal(instante, timezone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(instante);
}

// Conversões entre "YYYY-MM-DD" e o Date usado nas colunas @db.Date do Prisma.
export const diaParaDate = (dia) => new Date(`${dia}T00:00:00Z`);
export const dateParaDia = (data) => data.toISOString().slice(0, 10);

export function timezoneValido(timezone) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
