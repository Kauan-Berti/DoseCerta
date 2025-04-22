import { useState } from "react";
import { StyleSheet, View } from "react-native";
import AuthInput from "./AuthInput";
import IconButton from "../IconButton";
import { GlobalStyles } from "../../constants/colors";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }
  return (
    <View style={styles.form}>
      <View>
        <AuthInput
          label="E-mail"
          keyboardType="email-address"
          onUpdateValue={updateInputValueHandler.bind(this, "email")}
          value={enteredEmail}
          isInvalid={emailIsInvalid}
        />
        {!isLogin && (
          <AuthInput
            label="Confirmação de E-mail"
            keyboardType="email-address"
            onUpdateValue={updateInputValueHandler.bind(this, "confirmEmail")}
            value={enteredConfirmEmail}
            isInvalid={emailsDontMatch}
          />
        )}
        <AuthInput
          label="Senha"
          secure
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        {!isLogin && (
          <AuthInput
            label="Confirmação de Senha"
            secure
            onUpdateValue={updateInputValueHandler.bind(
              this,
              "confirmPassword"
            )}
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
      </View>
      <View style={styles.buttons}>
        <IconButton
          title={isLogin ? "Entrar" : "Criar Conta"}
          color={GlobalStyles.colors.primary}
          size={24}
          onPress={submitHandler}
        />
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 48,
    padding: 16,
    backgroundColor: GlobalStyles.colors.background,
    borderRadius: 8,
    justifyContent: "space-between",
    height: 300,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
