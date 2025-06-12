import { useState } from "react";
import { Alert } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function PasswordResetScreen() {
  const [isLoading, setIsLoading] = useState(false);

  async function passwordResetHandler({ token, password, confirmPassword }) {
    if (!token || !password || !confirmPassword) {
      Alert.alert("Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("As senhas não coincidem.");
      return;
    }
    setIsLoading(true);
    try {
      //await resetPasswordWithToken(token, password);
      Alert.alert("Senha redefinida com sucesso!");
    } catch (error) {
      Alert.alert(
        "Erro ao redefinir senha",
        error.message || "Tente novamente."
      );
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return <LoadingOverlay message="Redefinindo senha..." />;
  }

  return <AuthContent isPasswordReset onAuthenticate={passwordResetHandler} />;
}

export default PasswordResetScreen;
