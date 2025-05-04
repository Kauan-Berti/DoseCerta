import { createContext, useState, useEffect } from "react";
import { supabase } from "../util/supabase";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);

  async function authenticate(token) {
    setAuthToken(token);
  }

  async function logout() {
    setAuthToken(null);
    await supabase.auth.signOut();
  }

  useEffect(() => {
    const initSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setAuthToken(data.session.access_token);
      }
    };

    initSession();
  }, []);

  // OPCIONAL: auto refresh se você quiser controle manual
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase.auth.refreshSession();
      if (data?.session) {
        setAuthToken(data.session.access_token);
      } else if (error) {
        console.error("Erro ao renovar token:", error);
        logout();
      }
    }, 55 * 60 * 1000);

    return () => clearInterval(interval);
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
