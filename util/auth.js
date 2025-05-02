import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "AIzaSyCbU_YqmUbjmkF5sRF-hR994UcgZs51c4c";

async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;
  const refreshToken = response.data.refreshToken;

  await AsyncStorage.setItem("authToken", token);
  await AsyncStorage.setItem("refreshToken", refreshToken);

  return token;
}

export function createUser(email, password) {
  return authenticate("signUp", email, password);
}
export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

export async function refreshIdToken() {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Refresh token não encontrado.");
    }

    const url = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;
    const response = await axios.post(url, {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    const newIdToken = response.data.id_token;
    const newRefreshToken = response.data.refresh_token;

    // Atualiza o idToken e o refreshToken no AsyncStorage
    await AsyncStorage.setItem("authToken", newIdToken);
    await AsyncStorage.setItem("refreshToken", newRefreshToken);

    return newIdToken;
  } catch (error) {
    console.error("Erro ao renovar o token:", error);
    throw new Error("Não foi possível renovar o token.");
  }
}
