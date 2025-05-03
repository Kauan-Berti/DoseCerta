import { View, Text, StyleSheet, Pressable } from "react-native";
import { GlobalStyles } from "../constants/colors";
import RoundButton from "./RoundButton";

function AlertItem({ time, dose, days, observations, id, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Horário:</Text>
          <Text style={styles.value}>{time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Dose:</Text>
          <Text style={styles.value}>{dose}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Dias:</Text>
          <Text style={styles.value}>{days.join(", ")}</Text>
        </View>
        {observations && (
          <View style={styles.row}>
            <Text style={styles.label}>Observações:</Text>
            <Text style={styles.value}>{observations}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default AlertItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: GlobalStyles.colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: GlobalStyles.colors.text,
  },
  pressed: {
    opacity: 0.8,
  },
});
