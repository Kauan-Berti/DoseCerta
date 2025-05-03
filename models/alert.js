class Alert {
  constructor(
    id,
    time,
    dose,
    observations = "",
    days = [],
    treatmentId = null
  ) {
    this.id = id; // ID do alerta
    this.time = time; // Horário do alerta
    this.dose = dose; // Dose do medicamento
    this.observations = observations; // Observações adicionais
    this.days = days; // Dias da semana
    this.treatmentId = treatmentId; // ID do tratamento associado (opcional)
  }
}

export default Alert;
