import { View, Text, TextInput, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";

function AuthInput({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        placeholder={label}
        placeholderTextColor={GlobalStyles.colors.disabledText}
      />
    </View>
  );
}

export default AuthInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.border,
    borderRadius: 8,
  },
  label: {
    color: "white",
    marginBottom: 4,
  },
  labelInvalid: {
    color: GlobalStyles.colors.inputErrorBackground,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 4,
    fontSize: 16,
    color: "white",
  },
  inputInvalid: {
    backgroundColor: GlobalStyles.colors.inputErrorBackground,
    placeholderTextColor: "white",
  },
});
