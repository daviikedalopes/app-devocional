import { describe, expect, it } from 'vitest';
import { criarDevocionalSchema } from '../src/modules/devocional/devocional.schema.js';
import { capitulosDasPassagens } from '../src/modules/devocional/devocional.service.js';

const base = { iniciadoEm: '2026-10-11T07:00:00-03:00' };

describe('capitulosDasPassagens', () => {
  it('expande intervalos e remove repetições', () => {
    const capitulos = capitulosDasPassagens([
      { livro: 'MRK', capituloInicio: 4, capituloFim: 6 },
      { livro: 'MRK', capituloInicio: 6, capituloFim: 6 },
      { livro: 'PSA', capituloInicio: 23, capituloFim: 23 },
    ]);
    expect(capitulos).toEqual([
      { livro: 'MRK', capitulo: 4 },
      { livro: 'MRK', capitulo: 5 },
      { livro: 'MRK', capitulo: 6 },
      { livro: 'PSA', capitulo: 23 },
    ]);
  });
});

describe('criarDevocionalSchema', () => {
  it('aceita um devocional cronometrado com passagens', () => {
    const r = criarDevocionalSchema.safeParse({
      ...base,
      duracaoLeituraSeg: 900,
      duracaoOracaoSeg: 600,
      passagens: [{ livro: 'jhn', capituloInicio: 3, capituloFim: 3, versiculoInicio: 1, versiculoFim: 21 }],
    });
    expect(r.success).toBe(true);
    expect(r.data.passagens[0].livro).toBe('JHN');
    expect(r.data.visivelAmigos).toBe(false);
  });

  it('aceita só passagens, sem tempo (registro manual)', () => {
    const r = criarDevocionalSchema.safeParse({
      ...base,
      manual: true,
      passagens: [{ livro: 'ROM', capituloInicio: 8, capituloFim: 8 }],
    });
    expect(r.success).toBe(true);
  });

  it('recusa registro vazio', () => {
    expect(criarDevocionalSchema.safeParse(base).success).toBe(false);
  });

  it('recusa mais de 4 horas no total', () => {
    const r = criarDevocionalSchema.safeParse({ ...base, duracaoLeituraSeg: 3 * 3600, duracaoOracaoSeg: 2 * 3600 });
    expect(r.success).toBe(false);
  });

  it('recusa capítulo inexistente e intervalo invertido', () => {
    const inexistente = criarDevocionalSchema.safeParse({
      ...base,
      passagens: [{ livro: 'JUD', capituloInicio: 1, capituloFim: 2 }],
    });
    const invertido = criarDevocionalSchema.safeParse({
      ...base,
      passagens: [{ livro: 'GEN', capituloInicio: 5, capituloFim: 3 }],
    });
    expect(inexistente.success).toBe(false);
    expect(invertido.success).toBe(false);
  });
});
