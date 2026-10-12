// "MM:SS" ou "H:MM:SS".
export function formatarCronometro(ms) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mmss = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return h > 0 ? `${h}:${mmss}` : mmss;
}

// "45 min", "1 h 05 min", "menos de 1 min".
export function formatarDuracao(segundos) {
  const minutos = Math.round(segundos / 60);
  if (minutos < 1) return segundos > 0 ? 'menos de 1 min' : '0 min';
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h > 0 ? `${h} h ${String(m).padStart(2, '0')} min` : `${m} min`;
}

// "Marcos 4–5", "Salmos 23", "João 3:1–21".
export function formatarPassagem(p, livrosPorId) {
  const nome = livrosPorId?.get(p.livro)?.nome ?? p.livro;
  if (p.capituloInicio !== p.capituloFim) return `${nome} ${p.capituloInicio}–${p.capituloFim}`;
  if (p.versiculoInicio) {
    const fim = p.versiculoFim && p.versiculoFim !== p.versiculoInicio ? `–${p.versiculoFim}` : '';
    return `${nome} ${p.capituloInicio}:${p.versiculoInicio}${fim}`;
  }
  return `${nome} ${p.capituloInicio}`;
}

// "hoje", "ontem" ou "seg., 06/10".
export function formatarDia(dia, hoje = new Date()) {
  const [ano, mes, d] = dia.split('-').map(Number);
  const data = new Date(ano, mes - 1, d);
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const diff = Math.round((base - data) / 86_400_000);
  if (diff === 0) return 'hoje';
  if (diff === 1) return 'ontem';
  return data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

export const semAcentos = (texto) =>
  texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
