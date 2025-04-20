import { Text, View, StyleSheet } from "react-native";

function Config() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Config</Text>
    </View>
  );
}

export default Config;

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
