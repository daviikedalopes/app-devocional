import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://teste:teste@localhost:5432/teste',
      JWT_SECRET: 'segredo-de-teste-com-pelo-menos-32-caracteres',
    },
  },
});
