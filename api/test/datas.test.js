import { describe, expect, it } from 'vitest';
import { diaLocal, idadeEm, timezoneValido } from '../src/shared/datas.js';

describe('datas', () => {
  it('calcula a idade considerando o aniversário', () => {
    const ref = new Date('2026-10-11T12:00:00Z');
    expect(idadeEm('2013-10-11', ref)).toBe(13);
    expect(idadeEm('2013-10-12', ref)).toBe(12);
  });

  it('calcula o dia local no fuso do usuário', () => {
    const instante = new Date('2026-10-11T01:30:00Z'); // 22:30 do dia 10 em São Paulo
    expect(diaLocal(instante, 'America/Sao_Paulo')).toBe('2026-10-10');
    expect(diaLocal(instante, 'Europe/Lisbon')).toBe('2026-10-11');
  });

  it('valida fusos horários', () => {
    expect(timezoneValido('America/Sao_Paulo')).toBe(true);
    expect(timezoneValido('Lua/Base')).toBe(false);
  });
});
