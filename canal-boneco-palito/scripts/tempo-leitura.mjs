// Padrão de tempo de leitura por página dupla: 3s de base (olhar a ilustração e a
// página assentar) + 0,35s por palavra, o que dá cerca de 170 palavras por minuto.
// Só contam as palavras da história; direitos autorais, ISBN, ficha catalográfica,
// selo FSC, editora, redes sociais e créditos de tradução ficam de fora.
export function tempoDeLeitura(palavras) {
  if (palavras <= 0) return 4; // só ilustração
  if (palavras <= 8) return 6;
  if (palavras <= 16) return 8;
  if (palavras <= 25) return 11;
  if (palavras <= 35) return 14;
  if (palavras <= 50) return 18;
  if (palavras <= 70) return 23;
  return 23 + Math.ceil(0.35 * (palavras - 70));
}
