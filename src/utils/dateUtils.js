// utils/dateUtils.js
// Funções auxiliares para manipulação de datas (formato YYYY-MM-DD)
// Usadas para calcular streak, dia atual, e agendar treinos

// Retorna a data atual no formato YYYY-MM-DD
export function today() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Retorna o índice do dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
export function todayDayIndex() {
  return new Date().getDay();
}
