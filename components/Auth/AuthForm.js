import { useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import AuthInput from "./AuthInput";
import IconButton from "../IconButton";
import { GlobalStyles } from "../../constants/colors";

function AuthForm({
  isLogin,
  isPasswordReset,
  onSubmit,
  credentialsInvalid,
  onPasswordReset,
}) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [enteredToken, setEnteredToken] = useState("");

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
      token: enteredToken,
    });
  }

  function recoveryPassword() {}
  return (
    <View style={styles.form}>
      <View>
        {isPasswordReset ? (
          <>
            <AuthInput
              label="Token"
              onUpdateValue={setEnteredToken}
              value={enteredToken}
            />
            <AuthInput
              label="Nova Senha"
              secure
              onUpdateValue={setEnteredPassword}
              value={enteredPassword}
              isInvalid={passwordIsInvalid}
            />
            <AuthInput
              label="Confirmação de Senha"
              secure
              onUpdateValue={setEnteredConfirmPassword}
              value={enteredConfirmPassword}
              isInvalid={passwordsDontMatch}
            />
          </>
        ) : (
          <>
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
                onUpdateValue={updateInputValueHandler.bind(
                  this,
                  "confirmEmail"
                )}
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
            {isLogin && (
              <IconButton
                title={"Recuperar senha"}
                color={GlobalStyles.colors.background}
                textColor={GlobalStyles.colors.text}
                size={24}
                onPress={onPasswordReset}
              />
            )}
          </>
        )}
      </View>

      <View style={styles.buttons}>
        <IconButton
          title={
            isPasswordReset
              ? "Redefinir Senha"
              : isLogin
              ? "Entrar"
              : "Criar Conta"
          }
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
