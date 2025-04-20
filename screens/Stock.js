import { Text, View, StyleSheet } from "react-native";

function Stock() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stock</Text>
    </View>
  );
}

export default Stock;

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
