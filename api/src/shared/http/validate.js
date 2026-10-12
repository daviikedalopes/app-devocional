import { requisicaoInvalida } from './errors.js';

// Valida req.body / req.query / req.params com schemas Zod e substitui pelos dados já convertidos.
export const validate = (schemas) => (req, res, next) => {
  for (const parte of ['body', 'query', 'params']) {
    if (!schemas[parte]) continue;
    const resultado = schemas[parte].safeParse(req[parte]);
    if (!resultado.success) {
      const detalhes = resultado.error.issues.map((i) => ({ campo: i.path.join('.'), mensagem: i.message }));
      throw requisicaoInvalida('Dados inválidos', detalhes);
    }
    // Express 5: req.query é somente leitura, por isso guardamos em req.validado.
    req.validado = { ...req.validado, [parte]: resultado.data };
  }
  next();
};
