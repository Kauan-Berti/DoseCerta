import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = "https://expensestracker-24bf7-default-rtdb.firebaseio.com";

async function getToken() {
  try {
    let token = await AsyncStorage.getItem("authToken");
    if (!token) {
      token = await refreshIdToken(); // Renova o token se não estiver disponível
    }
    return token;
  } catch (error) {
    console.error("Erro ao recuperar o token:", error);
    throw new Error("Não foi possível recuperar o token.");
  }
}

export async function storeMedication(medicationData) {
  const token = await getToken(); // Recupera o token
  const response = await axios.post(
    `${BACKEND_URL}/medications.json?auth=${token}`, // Adiciona o token à URL
    medicationData
  );
  const id = response.data.name;
  return id;
}

export async function fetchMedication() {
  try {
    const token = await getToken(); // Garante que o token é válido
    const response = await axios.get(
      `${BACKEND_URL}/medications.json?auth=${token}`
    );
    const medications = [];

    for (const key in response.data) {
      const medicationData = response.data[key];
      const alerts = medicationData.alerts
        ? Object.keys(medicationData.alerts).map((alertKey) => ({
            id: alertKey,
            ...medicationData.alerts[alertKey],
          }))
        : [];
      medications.push({ id: key, ...medicationData, alerts });
    }

    return medications;
  } catch (error) {
    console.error("Erro ao buscar medicamentos:", error);
    throw new Error("Não foi possível buscar os medicamentos.");
  }
}

export async function updateMedication(id, expenseData) {
  const token = await getToken(); // Recupera o token
  return axios.put(
    `${BACKEND_URL}/medications/${id}.json?auth=${token}`, // Adiciona o token à URL
    medicationData
  );
}

export async function deleteMedication(id) {
  const token = await getToken(); // Recupera o token
  return axios.delete(`${BACKEND_URL}/medications/${id}.json?auth=${token}`); // Adiciona o token à URL
}
