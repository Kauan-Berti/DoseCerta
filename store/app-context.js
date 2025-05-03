import { createContext, useReducer } from "react";
import Medication from "../models/medication";
import Treatment from "../models/treatment";
import Alert from "../models/alert";

// Criação do contexto
export const AppContext = createContext({
  medications: [],
  treatments: [],
  alerts: [],
  addMedication: (medicationData) => {},
  updateMedication: (id, medicationData) => {},
  deleteMedication: (id) => {},
  addTreatment: (treatmentData) => {},
  updateTreatment: (id, treatmentData) => {},
  deleteTreatment: (id) => {},
  addAlert: (alertData) => {},
  updateAlert: (id, alertData) => {},
  deleteAlert: (id) => {},
});

// Reducer para gerenciar o estado
function appReducer(state, action) {
  switch (action.type) {
    // Medicamentos
    case "ADD_MEDICATION":
      return {
        ...state,
        medications: [
          ...state.medications.filter((m) => m.id !== action.payload.id), // Evita duplicatas
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
          ...state.treatments.filter((t) => t.id !== action.payload.id), // Evita duplicatas
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
          ...state.alerts.filter((a) => a.id !== action.payload.id), // Evita duplicatas
          new Alert(
            action.payload.id,
            action.payload.time,
            action.payload.dose,
            action.payload.observations,
            action.payload.days || [],
            action.payload.treatmentId // Adiciona o tratamento relacionado
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

  const value = {
    medications: state.medications,
    treatments: state.treatments,
    alerts: state.alerts,
    addMedication,
    updateMedication,
    deleteMedication,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    addAlert,
    updateAlert,
    deleteAlert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
