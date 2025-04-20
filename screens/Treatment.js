import { Text, View, StyleSheet } from "react-native";

function Treatment() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Treatment</Text>
    </View>
  );
}

export default Treatment;

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
