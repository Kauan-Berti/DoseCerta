import { useState, useContext } from "react";
import { AuthContext } from "../store/auth-context";
import { Alert } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { supabase } from "../util/supabase";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authContext = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        authContext.authenticate(data.session.access_token);
      } else {
        throw new Error("Sessão não encontrada.");
      }
    } catch (error) {
      Alert.alert(
        "Falha na autenticação!",
        error.message ||
          "Não foi possível fazer login. Verifique suas credenciais."
      );
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Acessando seus dados..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
