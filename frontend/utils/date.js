export function ajustarFusoBrasil(dataString) {
  const data = new Date(dataString);
  // Ajusta para GMT-3 (Brasília)
  return new Date(data.getTime() - 3 * 60 * 60 * 1000);
}