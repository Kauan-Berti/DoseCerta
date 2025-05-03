class MedicationLog {
  constructor(id, treatmentId, timeTaken, notes) {
    this.id = id;
    this.treatmentId = treatmentId;
    this.timeTaken = timeTaken;
    this.notes = notes;
  }
}

export default MedicationLog;
