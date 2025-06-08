import { Text, View, StyleSheet } from "react-native";

function CreateSensation() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CreateSensation</Text>
    </View>
  );
}

export default CreateSensation;

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
