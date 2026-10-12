// Converte capítulos soltos de um livro em passagens contínuas: [4,5,6,9] → 4–6 e 9.
export function capitulosParaPassagens(livro, capitulos) {
  const ordenados = [...new Set(capitulos)].sort((a, b) => a - b);
  const passagens = [];
  for (const capitulo of ordenados) {
    const ultima = passagens.at(-1);
    if (ultima && capitulo === ultima.capituloFim + 1) {
      ultima.capituloFim = capitulo;
    } else {
      passagens.push({ livro, capituloInicio: capitulo, capituloFim: capitulo });
    }
  }
  return passagens;
}

export function capitulosDoLivro(passagens, livro) {
  const capitulos = [];
  for (const p of passagens) {
    if (p.livro !== livro) continue;
    for (let c = p.capituloInicio; c <= p.capituloFim; c++) capitulos.push(c);
  }
  return capitulos;
}

// Substitui as passagens de um livro pelas novas, mantendo o livro na posição em que já estava.
export function substituirLivro(passagens, livro, capitulos) {
  const novas = capitulosParaPassagens(livro, capitulos);
  const resultado = [];
  let inserido = false;
  for (const p of passagens) {
    if (p.livro !== livro) {
      resultado.push(p);
    } else if (!inserido) {
      resultado.push(...novas);
      inserido = true;
    }
  }
  if (!inserido) resultado.push(...novas);
  return resultado;
}
