import { createContext } from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
  tryAutoLogin: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [didTryAutoLogin, setDidTryAutoLogin] = useState(false);

  function authenticate(token) {
    setAuthToken(token);
    AsyncStorage.setItem("authToken", token).catch((err) => {
      console.error("Error storing token:", err);
    });
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem("authToken").catch((err) => {
      console.error("Error removing token:", err);
    });
  }

  function tryAutoLogin() {
    setDidTryAutoLogin(true);
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
    tryAutoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthContextProvider;
