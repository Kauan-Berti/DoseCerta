import { View, Text, StyleSheet, Pressable } from "react-native";
import { GlobalStyles } from "../constants/colors";

function AlertItem() {
  return (
    <View style={styles.container}>
      <Text style={styles.itemLabel}>Alerta 1</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Horário da dose</Text>
        <Pressable style={styles.buttonText}>
          <Text style={styles.buttonText}>08:00</Text>
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dose</Text>
        <Pressable style={styles.buttonText}>
          <Text style={styles.buttonText}>1 comprimido</Text>
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quando tomar</Text>
        <Pressable>
          <Text style={styles.buttonText}>Antes do almoço</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default AlertItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
  },
  inputContainer: {
    marginVertical: 8,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemLabel: {
    fontSize: 12,
    color: GlobalStyles.colors.textSecondary,
    marginBottom: 4,
    fontWeight: "bold",
  },
  label: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 12,
    color: GlobalStyles.colors.lightYellow,
    fontWeight: "bold",
  },
});
