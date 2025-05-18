function formatTime(date) {
  if (!date) return "";
  if (typeof date === "string") {
    // Se for no formato "HH:mm:ss" ou "HH:mm", retorna só "HH:mm"
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(date)) {
      return date.slice(0, 5);
    }
  }
  const d = typeof date === "string" ? new Date(`1970-01-01T${date}`) : date;
  if (isNaN(d.getTime())) return date; // fallback para string inválida
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default formatTime;