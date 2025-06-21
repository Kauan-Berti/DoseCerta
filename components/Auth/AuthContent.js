import {
  Alert,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../IconButton";
import { GlobalStyles } from "../../constants/colors";
import { useState } from "react";
import AuthForm from "./AuthForm";

function AuthContent({ isLogin, isPasswordReset, onAuthenticate }) {
  const navigator = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isPasswordReset) {
      navigator.replace("Login");
    } else if (isLogin) {
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.authContent}>
            <Image
              source={require("../../assets/custom/Logo.png")}
              style={styles.logo}
            />

            <AuthForm
              isLogin={isLogin}
              isPasswordReset={isPasswordReset}
              onSubmit={submitHandler}
              credentialsInvalid={credentialsInvalid}
              onPasswordReset={() => navigator.replace("PasswordReset")}
            />

            <View style={styles.buttons}>
              <IconButton
                onPress={switchAuthModeHandler}
                title={
                  isPasswordReset
                    ? "Voltar"
                    : isLogin
                    ? "Criar conta"
                    : "Já tem uma conta?"
                }
                textColor="white"
                color={GlobalStyles.colors.button}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default AuthContent;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  authContent: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
    paddingBottom: 40,
  },
  buttons: {
    marginTop: 34,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 80,
    alignSelf: "center",
    resizeMode: "contain",
  },
});
