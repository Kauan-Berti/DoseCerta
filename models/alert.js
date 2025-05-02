class Alert {
  constructor(id, time, dose, observations, days) {
    this.id = id;
    this.time = time; // Horário do alerta
    this.dose = dose; // Dose do medicamento
    this.observations = observations; // Observações adicionais (opcional)
    this.days = days; // Informação sobre pré-refeição
  }
}

export default Alert;
