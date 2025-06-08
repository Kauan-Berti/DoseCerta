import { TextInput, View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";

function Input({ label, style, textInputConfig, invalid, keyboardType }) {
  const inputStyles = [styles.input];

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push(styles.invalidInput); // Adiciona o estilo de invalidez
  }

  return (
    <View style={[styles.inputContainer, style]}>
      {label && (
        <Text style={[styles.label, invalid && styles.invalidLabel]}>
          {label}
        </Text>
      )}

      <TextInput
        style={StyleSheet.flatten([...inputStyles, style])} // aplica também o style vindo da prop
        {...textInputConfig}
        placeholderTextColor={GlobalStyles.colors.disabledText}
        keyboardType={keyboardType || "default"}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.textSecondary,
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: GlobalStyles.colors.card,
    color: GlobalStyles.colors.text,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    borderColor: GlobalStyles.colors.border,
    borderWidth: 2,
    width: "100%",
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  invalidLabel: {
    color: GlobalStyles.colors.error, // Cor do texto do label inválido
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.inputErrorBackground, // Cor de fundo para inputs inválidos
    borderColor: GlobalStyles.colors.error, // Adiciona uma borda vermelha para inputs inválidos
  },
});
