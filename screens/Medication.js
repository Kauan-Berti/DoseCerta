import { Text, View, StyleSheet } from "react-native";

function Medication() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Medication</Text>
    </View>
  );
}

export default Medication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
});
