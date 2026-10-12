import { z } from 'zod';
import { timezoneValido } from '../../shared/datas.js';

export const atualizarPerfilSchema = z
  .object({
    nome: z.string().trim().min(2).max(80),
    bio: z.string().trim().max(160).nullable(),
    igreja: z.string().trim().max(80).nullable(),
    perfilPrivado: z.boolean(),
    timezone: z.string().refine(timezoneValido, 'Fuso horário inválido'),
    horarioLembrete: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use o formato HH:mm')
      .nullable(),
  })
  .partial()
  .strict();
