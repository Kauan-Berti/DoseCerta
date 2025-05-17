import { Text, View, StyleSheet } from "react-native";

function TreatmentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TreatmentScreen</Text>
    </View>
  );
}

export default TreatmentScreen;

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
