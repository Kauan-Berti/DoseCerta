class Medication {
  constructor(
    id,
    name,
    amount,
    minAmount,
    form,
    unit,
    treatmentTime,
    treatmentStartDate,
    alerts = []
  ) {
    this.id = id; // ID do medicamento
    this.name = name; // Nome do medicamento
    this.amount = amount; // Quantidade do medicamento
    this.minAmount = minAmount; // Quantidade mínima do medicamento
    this.form = form; // Forma do medicamento (comprimido, cápsula, etc.)
    this.unit = unit; // Unidade de medida do medicamento
    this.treatmentTime = treatmentTime; // Duração do tratamento
    this.treatmentStartDate = treatmentStartDate; // Data de início do tratamento
    this.alerts = alerts; // Lista de alertas vinculados ao medicamento
  }
}

export default Medication;
