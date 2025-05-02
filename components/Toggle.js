import { View, Text, Switch, StyleSheet } from "react-native";
import { useState } from "react";
import { GlobalStyles } from "../constants/colors";

function Toggle({ onToggle, isEnabledText, isDisabledText }) {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    onToggle && onToggle(!isEnabled); // Chama o callback ao alternar
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          isEnabled ? styles.enabledText : styles.disabledText,
        ]}
      >
        {isEnabled ? isEnabledText : isDisabledText}
      </Text>
      <Switch
        trackColor={{
          false: GlobalStyles.colors.disabled,
          true: GlobalStyles.colors.lightYellow,
        }} // Cor da trilha
        thumbColor={
          isEnabled ? GlobalStyles.colors.primary : GlobalStyles.colors.primary
        } // Cor do botão
        ios_backgroundColor={GlobalStyles.colors.disabled} // Cor de fundo no iOS
        onValueChange={toggleSwitch} // Função chamada ao alternar
        value={isEnabled} // Estado atual do switch
      />
    </View>
  );
}

export default Toggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: GlobalStyles.colors.card, // Fundo do container
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  enabledText: {
    color: GlobalStyles.colors.text, // Texto quando ativado
  },
  disabledText: {
    color: GlobalStyles.colors.text, // Texto quando desativado
  },
});
