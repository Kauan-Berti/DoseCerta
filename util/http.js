import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshIdToken } from "./auth";

const BACKEND_URL = "https://expensestracker-24bf7-default-rtdb.firebaseio.com";

// -------------------- Token --------------------
async function getToken() {
  try {
    let token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.warn("Token não encontrado, tentando renovar...");
      token = await refreshIdToken();
      if (!token) throw new Error("Falha ao renovar token");
    }
    return token;
  } catch (error) {
    console.error("Erro ao recuperar token:", error);
    throw new Error("Não foi possível autenticar");
  }
}

// -------------------- Medicamentos --------------------

export async function storeMedication(medicationData) {
  const token = await getToken();

  const { id, ...medicationWithoutId } = medicationData;

  const response = await axios.post(
    `${BACKEND_URL}/medications.json?auth=${token}`,
    medicationWithoutId
  );

  const firebaseId = response.data.name;
  return { id: firebaseId, ...medicationWithoutId };
}

export async function updateMedication(medicationId, medicationData) {
  const token = await getToken();

  try {
    await axios.put(
      `${BACKEND_URL}/medications/${medicationId}.json?auth=${token}`,
      medicationData
    );
  } catch (error) {
    console.error("Erro ao atualizar medicamento:", error);
    throw new Error("Não foi possível atualizar o medicamento.");
  }
}

export async function fetchMedications() {
  try {
    const token = await getToken();
    const response = await axios.get(
      `${BACKEND_URL}/medications.json?auth=${token}`
    );

    return firebaseToArray(response.data);
  } catch (error) {
    console.error("Erro ao buscar medicamentos:", error);
    throw new Error("Não foi possível buscar os medicamentos.");
  }
}
export async function fetchMedicationById(medicationId) {
  const token = await getToken();

  try {
    const response = await axios.get(
      `${BACKEND_URL}/medications/${medicationId}.json?auth=${token}`
    );

    if (!response.data) {
      throw new Error(`Medicamento com ID ${medicationId} não encontrado.`);
    }

    return { id: medicationId, ...response.data };
  } catch (error) {
    console.error(`Erro ao buscar medicamento com ID ${medicationId}:`, error);
    throw new Error("Não foi possível buscar o medicamento.");
  }
}

// -------------------- Tratamentos --------------------

export async function storeTreatment(treatmentData) {
  const token = await getToken();

  if (!treatmentData.medicationId) {
    throw new Error("O campo medicationId é obrigatório.");
  }

  const { id, ...treatmentWithoutId } = treatmentData;

  const response = await axios.post(
    `${BACKEND_URL}/treatments.json?auth=${token}`,
    treatmentWithoutId
  );

  const firebaseId = response.data.name;
  return { id: firebaseId, ...treatmentWithoutId };
}

export async function fetchTreatments() {
  try {
    const token = await getToken();
    const { data } = await axios.get(
      `${BACKEND_URL}/treatments.json?auth=${token}`
    );

    return Object.entries(data || {}).map(([id, treatment]) => ({
      id,
      medicationId:
        treatment.medicationId?.id || treatment.medicationId || null,
      startDate: treatment.startDate || new Date().toISOString().split("T")[0],
      endDate: treatment.endDate || null,
      isContinuous: Boolean(treatment.isContinuous),
      // Inclua aqui outros campos necessários
    }));
  } catch (error) {
    console.error("Erro ao buscar tratamentos:", error);
    throw new Error("Não foi possível buscar os tratamentos.");
  }
}

// -------------------- Alertas --------------------

export async function storeAlert(alertData) {
  const token = await getToken();

  if (!alertData.treatmentId) {
    throw new Error("O campo treatmentId é obrigatório.");
  }

  const { id, ...alertWithoutId } = alertData;

  try {
    const response = await axios.post(
      `${BACKEND_URL}/alerts.json?auth=${token}`,
      alertWithoutId
    );

    const firebaseId = response.data.name;
    return { id: firebaseId, ...alertWithoutId };
  } catch (error) {
    console.error("Erro ao salvar alerta:", error);
    throw new Error("Erro ao salvar alerta no Firebase.");
  }
}
export async function fetchAlerts() {
  const token = await getToken();

  try {
    const response = await axios.get(
      `${BACKEND_URL}/alerts.json?auth=${token}`
    );
    return firebaseToArray(response.data);
  } catch (error) {
    console.error("Erro ao buscar alertas:", error);
    throw new Error("Não foi possível buscar os alertas.");
  }
}

export async function updateAlert(alertId, alertData) {
  const token = await getToken();
  return axios.put(
    `${BACKEND_URL}/alerts/${alertId}.json?auth=${token}`,
    alertData
  );
}

export async function deleteAlert(alertId) {
  const token = await getToken();
  return axios.delete(`${BACKEND_URL}/alerts/${alertId}.json?auth=${token}`);
}

// -------------------- Funções Auxiliares --------------------

function firebaseToArray(firebaseData) {
  if (!firebaseData) return [];
  return Object.keys(firebaseData).map((key) => ({
    id: key,
    ...firebaseData[key],
  }));
}
