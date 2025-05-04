import { useState, useContext } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AuthContent from "../components/Auth/AuthContent";
import { supabase } from "../util/supabase";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authContext = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);

    try {
      // 1. Criação de conta
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const user = data.user;
      let session = data.session;

      // 2. Inserção do perfil se usuário foi criado
      if (user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            created_at: new Date().toISOString(),
          },
        ]);
        if (profileError) throw profileError;
      }

      // 3. Se ainda não há sessão (verificação de e-mail), tentar login manual
      if (!session) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (signInError) throw signInError;
        session = signInData.session;
      }

      if (!session?.access_token) {
        throw new Error("Sessão inválida ou token não encontrado.");
      }

      // 4. Autenticar no contexto
      await authContext.authenticate(session.access_token);
    } catch (error) {
      console.error("Erro no signupHandler:", error);
      Alert.alert(
        "Erro no cadastro!",
        error.message || "Não foi possível criar sua conta."
      );
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Criando sua conta..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
