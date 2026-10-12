import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { criarApp } from '../src/app.js';

const app = criarApp();

describe('API (rotas que não usam o banco)', () => {
  it('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /leitura/livros lista os 66 livros', async () => {
    const res = await request(app).get('/leitura/livros');
    expect(res.status).toBe(200);
    expect(res.body.totalCapitulos).toBe(1189);
    expect(res.body.livros[0]).toMatchObject({ id: 'GEN', nome: 'Gênesis', capitulos: 50 });
  });

  it('rotas protegidas exigem token', async () => {
    const res = await request(app).get('/usuarios/me');
    expect(res.status).toBe(401);
  });

  it('cadastro valida os dados de entrada', async () => {
    const res = await request(app).post('/auth/cadastro').send({ email: 'invalido', senha: '123' });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe('Dados inválidos');
  });

  it('rota inexistente retorna 404', async () => {
    const res = await request(app).get('/nao-existe');
    expect(res.status).toBe(404);
  });
});
