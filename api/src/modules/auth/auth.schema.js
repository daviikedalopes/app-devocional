import { z } from 'zod';
import { timezoneValido } from '../../shared/datas.js';

export const cadastroSchema = z.object({
  nome: z.string().trim().min(2).max(80),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.]{3,20}$/, 'Use de 3 a 20 caracteres: letras, números, "_" ou "."'),
  email: z.email().trim().toLowerCase(),
  senha: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres').max(72),
  dataNascimento: z.iso.date(),
  timezone: z.string().refine(timezoneValido, 'Fuso horário inválido').optional(),
});

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  senha: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
