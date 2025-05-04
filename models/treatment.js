class Treatment {
  constructor(
    id,
    medicationId, // Objeto do medicamento
    startDate,
    endDate,
    isContinuous
  ) {
    this.id = id; // ID do tratamento
    this.medicationId = medicationId; // Objeto do medicamento
    this.startDate = startDate; // Data de início do tratamento
    this.endDate = endDate; // Data de término do tratamento
    this.isContinuous = isContinuous; // Indica se o tratamento é contínuo
  }
}

export default Treatment;
