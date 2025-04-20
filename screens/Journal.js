import { Text, View, StyleSheet } from "react-native";

function Journal() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Journal</Text>
    </View>
  );
}

export default Journal;

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
