import { describe, expect, it } from 'vitest';
import { LIVROS, TOTAL_CAPITULOS, capituloValido } from '../src/shared/biblia/livros.js';

describe('dados da Bíblia', () => {
  it('tem 66 livros: 39 no AT e 27 no NT', () => {
    expect(LIVROS).toHaveLength(66);
    expect(LIVROS.filter((l) => l.testamento === 'AT')).toHaveLength(39);
    expect(LIVROS.filter((l) => l.testamento === 'NT')).toHaveLength(27);
  });

  it('soma 1.189 capítulos (929 no AT, 260 no NT)', () => {
    const soma = (t) => LIVROS.filter((l) => l.testamento === t).reduce((s, l) => s + l.capitulos, 0);
    expect(TOTAL_CAPITULOS).toBe(1189);
    expect(soma('AT')).toBe(929);
    expect(soma('NT')).toBe(260);
  });

  it('não repete códigos', () => {
    expect(new Set(LIVROS.map((l) => l.id)).size).toBe(66);
  });

  it('valida capítulos', () => {
    expect(capituloValido('PSA', 150)).toBe(true);
    expect(capituloValido('PSA', 151)).toBe(false);
    expect(capituloValido('OBA', 0)).toBe(false);
    expect(capituloValido('XXX', 1)).toBe(false);
  });
});
