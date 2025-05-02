import { useState, useContext } from "react";
import { AuthContext } from "../store/auth-context";
import { Alert } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import { login } from "../util/auth";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authContext = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authContext.authenticate(token);
    } catch (error) {
      setIsAuthenticating(false);
      Alert.alert(
        "Authentication failed!",
        "Could not log you in. Please check your credentials or try again later."
      );
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Acessando seus dados..." />;
  }
  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
