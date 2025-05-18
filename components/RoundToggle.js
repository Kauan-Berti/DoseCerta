import RoundButton from "./RoundButton";
import { Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";

function RoundToggle({ text, onPress, isSelected, size = 40 }) {
  function handlePress() {
    onPress();
  }

  return (
    <RoundButton
      size={size}
      backgroundColor={
        isSelected ? GlobalStyles.colors.primary : GlobalStyles.colors.button
      }
      onPress={handlePress}
    >
      <Text style={isSelected ? styles.selectedText : styles.text}>{text}</Text>
    </RoundButton>
  );
}

export default RoundToggle;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: GlobalStyles.colors.textSecondary, // Cor do texto quando não selecionado
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: GlobalStyles.colors.background, // Cor do texto quando selecionado
  },
});
