import { Alert, View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../IconButton";
import { GlobalStyles } from "../../constants/colors";
import { useState } from "react";
import AuthForm from "./AuthForm";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigator = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigator.replace("Signup");
    } else {
      navigator.replace("Login");
    }
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  }

  return (
    <View style={styles.authContent}>
      <Image
        source={require("../../assets/custom/Logo.png")}
        style={styles.logo}
      />
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <IconButton
          onPress={switchAuthModeHandler}
          title={isLogin ? "Criar conta" : "Já tem uma conta?"}
          textColor="white"
          color={GlobalStyles.colors.button}
        ></IconButton>
      </View>
    </View>
  );
}

export default AuthContent;
const styles = StyleSheet.create({
  authContent: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
  },
  buttons: {
    marginTop: 8,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 125,
    alignSelf: "center",
    resizeMode: "contain",
  },
});
