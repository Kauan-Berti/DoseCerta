import { Text, View, StyleSheet } from "react-native";

function CreateUserScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CreateUserScreen</Text>
    </View>
  );
}

export default CreateUserScreen;

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
