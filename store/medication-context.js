import { createContext, useReducer } from "react";
import Medication from "../models/medication";

export const MedicationsContext = createContext({
  medications: [],
  addMedication: ({ id, name, amount, minAmount, form, unit, alerts }) => {},
  setMedication: (medications) => {},
  updateMedication: (id, { name, amount, minAmount, form, unit, alerts }) => {},
  deleteMedication: (id) => {},
});

function medicationReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [
        new Medication(
          action.payload.id,
          action.payload.name,
          action.payload.amount,
          action.payload.minAmount,
          action.payload.form,
          action.payload.unit,
          action.payload.treatmentTime,
          action.payload.treatmentStartDate ||
            new Date().toISOString().split("T")[0],
          action.payload.alerts || []
        ),
        ...state,
      ];
    case "SET":
      const inverted = action.payload.reverse();
      return inverted;
    case "UPDATE":
      const updatableMedicationIndex = state.findIndex(
        (medication) => medication.id === action.payload.id
      );
      const updatableMedication = state[updatableMedicationIndex]; // Corrigido
      const updatedItem = { ...updatableMedication, ...action.payload.data };
      const updatedMedications = [...state];
      updatedMedications[updatableMedicationIndex] = updatedItem;
      return updatedMedications;
    case "DELETE":
      return state.filter((medication) => medication.id !== action.payload);
    default:
      return state;
  }
}

function MedicationsContextProvider({ children }) {
  const initialMedications = [
    {
      id: "1",
      name: "Paracetamol",
      amount: 20,
      minAmount: 5,
      form: "Comprimido",
      unit: "mg",
      alerts: [
        {
          id: "1",
          time: "08:00",
          dose: 1,
          preMeal: "Antes do café",
        },
        {
          id: "2",
          time: "20:00",
          dose: 1,
          preMeal: "Antes do jantar",
        },
      ],
    },
    {
      id: "2",
      name: "Ibuprofeno",
      amount: 15,
      minAmount: 3,
      form: "Cápsula",
      unit: "mg",
      alerts: [{ id: "1", time: "12:00", dose: 1, preMeal: "Após o almoço" }],
    },
    {
      id: "3",
      name: "Amoxicilina",
      amount: 10,
      minAmount: 2,
      form: "Suspensão",
      unit: "ml",
      alerts: [
        { id: "1", time: "07:00", dose: 5, preMeal: "Antes do café" },
        { id: "2", time: "19:00", dose: 5, preMeal: "Antes do jantar" },
      ],
    },
  ];

  const [medicationState, dispatch] = useReducer(medicationReducer, []);

  function addMedication(medicationData) {
    dispatch({ type: "ADD", payload: medicationData });
    console.log(medicationData);
  }
  function setMedications(medications) {
    dispatch({ type: "SET", payload: medications });
  }
  function updateMedication(id, medicationData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: medicationData } });
  }
  function deleteMedication(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  const value = {
    medications: medicationState,
    addMedication: addMedication,
    setMedications: setMedications,
    updateMedication: updateMedication,
    deleteMedication: deleteMedication,
  };

  return (
    <MedicationsContext.Provider value={value}>
      {children}
    </MedicationsContext.Provider>
  );
}

export default MedicationsContextProvider;
