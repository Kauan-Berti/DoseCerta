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
    <>
      {label && <Text style={styles.label}>{label}</Text>}
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
    </>
  );
}

export default AuthInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 4,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.border,
    borderRadius: 8,
  },
  label: {
    color: GlobalStyles.colors.disabledText,
    fontSize: 14,
  },
  labelInvalid: {
    color: GlobalStyles.colors.inputErrorBackground,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: "transparent",
    borderRadius: 4,
    fontSize: 18,
    color: "white",
  },
  inputInvalid: {
    backgroundColor: GlobalStyles.colors.inputErrorBackground,
    placeholderTextColor: "white",
  },
});
