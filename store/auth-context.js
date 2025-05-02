import { createContext } from "react";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshIdToken } from "../util/auth";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
  tryAutoLogin: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();

  async function authenticate(token) {
    setAuthToken(token);
    await AsyncStorage.setItem("authToken", token);
  }

  async function autoRefreshToken() {
    try {
      const newToken = await refreshIdToken();
      setAuthToken(newToken);
    } catch (error) {
      console.error("Erro ao renovar o token:", error);
      logout(); // Faz logout se o refresh falhar
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      autoRefreshToken(); // Renova o token automaticamente
    }, 55 * 60 * 1000); // Renova 5 minutos antes de expirar (55 minutos)

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem("authToken");
    AsyncStorage.removeItem("refreshToken");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      autoRefreshToken(); // Renova o token automaticamente
    }, 55 * 60 * 1000); // Renova 5 minutos antes de expirar (55 minutos)

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthContextProvider;
