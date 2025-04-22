import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = "https://expensestracker-24bf7-default-rtdb.firebaseio.com";

async function getToken() {
  try {
    const token = await AsyncStorage.getItem("authToken");
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
    const token = await getToken(); // Recupera o token
    const response = await axios.get(
      `${BACKEND_URL}/medications.json?auth=${token}`
    ); // Adiciona o token à URL
    const medications = [];

    for (const key in response.data) {
      const medicationData = response.data[key];

      // Transformar alerts em um array, caso seja um objeto
      const alerts = medicationData.alerts
        ? Object.keys(medicationData.alerts).map((alertKey) => ({
            id: alertKey,
            ...medicationData.alerts[alertKey],
          }))
        : []; // Garante que alerts seja um array

      const medicationObj = {
        id: key,
        name: medicationData.name || "",
        amount: medicationData.amount || 0,
        minAmount: medicationData.minAmount || 0,
        form: medicationData.form || "",
        unit: medicationData.unit || "",
        treatmentTime: medicationData.treatmentTime || 0,
        treatmentStartDate: medicationData.treatmentStartDate || "",
        alerts: alerts,
      };

      medications.push(medicationObj);
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
