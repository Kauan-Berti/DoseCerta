import { createContext, useReducer } from "react";
import Medication from "../models/medication";
import Treatment from "../models/treatment";
import Alert from "../models/alert";

// Criação do contexto
export const AppContext = createContext({
  medications: [],
  treatments: [],
  alerts: [],
  categories: [],
  sensations: [],
  journals: [],
  sensationsJournals: [],
  medicationLogs: [],
  addCategory: (categoryData) => {},
  addSensation: (sensationData) => {},
  updateSensation: (id, sensationData) => {},
  deleteSensation: (id) => {},
  addJournal: (journalData) => {},
  updateJournal: (id, journalData) => {},
  deleteJournal: (id) => {},
  addSensationJournal: (sensationJournalData) => {},
  updateSensationJournal: (id, sensationJournalData) => {},
  deleteSensationJournal: (id) => {},
  addMedication: (medicationData) => {},
  updateMedication: (id, medicationData) => {},
  deleteMedication: (id) => {},
  addTreatment: (treatmentData) => {},
  updateTreatment: (id, treatmentData) => {},
  deleteTreatment: (id) => {},
  addAlert: (alertData) => {},
  updateAlert: (id, alertData) => {},
  deleteAlert: (id) => {},
  addMedicationLog: (medicationLogData) => {},
  updateMedicationLog: (id, medicationLogData) => {},
  deleteMedicationLog: (id) => {},
});

// Reducer para gerenciar o estado
function appReducer(state, action) {
  switch (action.type) {
    // Medicamentos
    case "ADD_MEDICATION":
      return {
        ...state,
        medications: [
          ...state.medications.filter((m) => m.id !== action.payload.id),
          new Medication(
            action.payload.id,
            action.payload.name,
            action.payload.amount,
            action.payload.minAmount,
            action.payload.form,
            action.payload.unit
          ),
        ],
      };

    case "UPDATE_MEDICATION":
      return {
        ...state,
        medications: state.medications.map((medication) =>
          medication.id === action.payload.id
            ? { ...medication, ...action.payload.data }
            : medication
        ),
      };

    case "DELETE_MEDICATION":
      return {
        ...state,
        medications: state.medications.filter(
          (medication) => medication.id !== action.payload
        ),
      };

    // Tratamentos
    case "ADD_TREATMENT":
      return {
        ...state,
        treatments: [
          ...state.treatments.filter((t) => t.id !== action.payload.id),
          new Treatment(
            action.payload.id,
            action.payload.medicationId,
            action.payload.startDate,
            action.payload.endDate,
            action.payload.isContinuous
          ),
        ],
      };

    case "UPDATE_TREATMENT":
      return {
        ...state,
        treatments: state.treatments.map((treatment) =>
          treatment.id === action.payload.id
            ? { ...treatment, ...action.payload.data }
            : treatment
        ),
      };

    case "DELETE_TREATMENT":
      return {
        ...state,
        treatments: state.treatments.filter(
          (treatment) => treatment.id !== action.payload
        ),
      };

    // Alertas
    case "ADD_ALERT":
      return {
        ...state,
        alerts: [
          ...state.alerts.filter((a) => a.id !== action.payload.id),
          new Alert(
            action.payload.id,
            action.payload.time,
            action.payload.dose,
            action.payload.observations,
            action.payload.days || [],
            action.payload.treatmentId
          ),
        ],
      };

    case "UPDATE_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload.id
            ? { ...alert, ...action.payload.data }
            : alert
        ),
      };

    case "DELETE_ALERT":
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };

    // Categorias
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [
          ...state.categories.filter((c) => c.id !== action.payload.id),
          action.payload,
        ],
      };

    // Sintomas
    case "ADD_SENSATION":
      return {
        ...state,
        sensations: [
          ...state.sensations.filter((s) => s.id !== action.payload.id),
          action.payload,
        ],
      };

    case "UPDATE_SENSATION":
      return {
        ...state,
        sensations: state.sensations.map((sensation) =>
          sensation.id === action.payload.id
            ? { ...sensation, ...action.payload.data }
            : sensation
        ),
      };

    case "DELETE_SENSATION":
      return {
        ...state,
        sensations: state.sensations.filter(
          (sensation) => sensation.id !== action.payload
        ),
      };

    // Diarios
    case "ADD_JOURNAL":
      return {
        ...state,
        journals: [
          ...state.journals.filter((j) => j.id !== action.payload.id),
          action.payload,
        ],
      };

    case "UPDATE_JOURNAL":
      return {
        ...state,
        journals: state.journals.map((journal) =>
          journal.id === action.payload.id
            ? { ...journal, ...action.payload.data }
            : journal
        ),
      };

    case "DELETE_JOURNAL":
      return {
        ...state,
        journals: state.journals.filter(
          (journal) => journal.id !== action.payload
        ),
      };

    // Sensações em Diários
    case "ADD_SENSATION_JOURNAL":
      return {
        ...state,
        sensationsJournals: [
          ...state.sensationsJournals.filter(
            (sj) => sj.id !== action.payload.id
          ),
          action.payload,
        ],
      };

    case "UPDATE_SENSATION_JOURNAL":
      return {
        ...state,
        sensationsJournals: state.sensationsJournals.map((sensationJournal) =>
          sensationJournal.id === action.payload.id
            ? { ...sensationJournal, ...action.payload.data }
            : sensationJournal
        ),
      };

    case "DELETE_SENSATION_JOURNAL":
      return {
        ...state,
        sensationsJournals: state.sensationsJournals.filter(
          (sensationJournal) => sensationJournal.id !== action.payload
        ),
      };

    // Logs de Medicamentos
    case "ADD_MEDICATION_LOG":
      return {
        ...state,
        medicationLogs: [
          ...state.medicationLogs.filter((ml) => ml.id !== action.payload.id),
          action.payload,
        ],
      };

    case "UPDATE_MEDICATION_LOG":
      return {
        ...state,
        medicationLogs: state.medicationLogs.map((medicationLog) =>
          medicationLog.id === action.payload.id
            ? { ...medicationLog, ...action.payload.data }
            : medicationLog
        ),
      };

    case "DELETE_MEDICATION_LOG":
      return {
        ...state,
        medicationLogs: state.medicationLogs.filter(
          (medicationLog) => medicationLog.id !== action.payload
        ),
      };

    default:
      return state;
  }
}

// Provedor do contexto
function AppContextProvider({ children }) {
  const initialState = {
    medications: [],
    treatments: [],
    alerts: [],
    categories: [],
    sensations: [],
    journals: [],
    sensationsJournals: [],
    medicationLogs: [],
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Funções para Medicamentos
  function addMedication(medicationData) {
    dispatch({ type: "ADD_MEDICATION", payload: medicationData });
  }

  function updateMedication(id, medicationData) {
    dispatch({
      type: "UPDATE_MEDICATION",
      payload: { id, data: medicationData },
    });
  }

  function deleteMedication(id) {
    dispatch({ type: "DELETE_MEDICATION", payload: id });
  }

  // Funções para Tratamentos
  function addTreatment(treatmentData) {
    dispatch({ type: "ADD_TREATMENT", payload: treatmentData });
  }

  function updateTreatment(id, treatmentData) {
    dispatch({
      type: "UPDATE_TREATMENT",
      payload: { id, data: treatmentData },
    });
  }

  function deleteTreatment(id) {
    dispatch({ type: "DELETE_TREATMENT", payload: id });
  }

  // Funções para Alertas
  function addAlert(alertData) {
    dispatch({ type: "ADD_ALERT", payload: alertData });
  }

  function updateAlert(id, alertData) {
    dispatch({ type: "UPDATE_ALERT", payload: { id, data: alertData } });
  }

  function deleteAlert(id) {
    dispatch({ type: "DELETE_ALERT", payload: id });
  }

  function addCategory(categoryData) {
    dispatch({ type: "ADD_CATEGORY", payload: categoryData });
  }

  function addSensation(sensationData) {
    dispatch({ type: "ADD_SENSATION", payload: sensationData });
  }

  function updateSensation(id, sensationData) {
    dispatch({
      type: "UPDATE_SENSATION",
      payload: { id, data: sensationData },
    });
  }

  function deleteSensation(id) {
    dispatch({ type: "DELETE_SENSATION", payload: id });
  }

  function addJournal(journalData) {
    dispatch({ type: "ADD_JOURNAL", payload: journalData });
  }

  function updateJournal(id, journalData) {
    dispatch({
      type: "UPDATE_JOURNAL",
      payload: { id, data: journalData },
    });
  }

  function deleteJournal(id) {
    dispatch({ type: "DELETE_JOURNAL", payload: id });
  }

  function addSensationJournal(sensationJournalData) {
    dispatch({ type: "ADD_SENSATION_JOURNAL", payload: sensationJournalData });
  }

  function updateSensationJournal(id, sensationJournalData) {
    dispatch({
      type: "UPDATE_SENSATION_JOURNAL",
      payload: { id, data: sensationJournalData },
    });
  }

  function deleteSensationJournal(id) {
    dispatch({ type: "DELETE_SENSATION_JOURNAL", payload: id });
  }

  function addMedicationLog(medicationLogData) {
    dispatch({ type: "ADD_MEDICATION_LOG", payload: medicationLogData });
  }

  function updateMedicationLog(id, medicationLogData) {
    dispatch({
      type: "UPDATE_MEDICATION_LOG",
      payload: { id, data: medicationLogData },
    });
  }

  function deleteMedicationLog(id) {
    dispatch({ type: "DELETE_MEDICATION_LOG", payload: id });
  }

  const value = {
    medications: state.medications,
    treatments: state.treatments,
    alerts: state.alerts,
    categories: state.categories,
    sensations: state.sensations,
    journals: state.journals,
    sensationsJournals: state.sensationsJournals,
    medicationLogs: state.medicationLogs,
    addMedication,
    updateMedication,
    deleteMedication,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    addAlert,
    updateAlert,
    deleteAlert,
    addCategory,
    addSensation,
    updateSensation,
    deleteSensation,
    addJournal,
    updateJournal,
    deleteJournal,
    addSensationJournal,
    updateSensationJournal,
    deleteSensationJournal,
    addMedicationLog,
    updateMedicationLog,
    deleteMedicationLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
