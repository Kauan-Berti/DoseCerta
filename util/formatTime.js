function formatTime(date) {
  if (!date) return "";
  if (typeof date === "string" && /^\d{2}:\d{2}:\d{2}$/.test(date)) {
    // Se for no formato "HH:mm:ss", retorna só "HH:mm"
    return date.slice(0, 5);
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default formatTime;