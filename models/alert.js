class Alert {
  constructor(id, time, dose, preMeal) {
    this.id = id;
    this.time = time; // Horário do alerta
    this.dose = dose; // Dose do medicamento
    this.preMeal = preMeal; // Informação sobre pré-refeição
  }
}

export default Alert;
