import { View, StyleSheet, Text } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import IconButton from "../IconButton";

function ErrorOverlay({ message, onConfirm }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>An error occurred!</Text>
      <Text style={[styles.text, styles.message]}>{message}</Text>
      <IconButton
        onPress={onConfirm}
        title={"Okay"}
        color={GlobalStyles.colors.primary}
      />
    </View>
  );
}

export default ErrorOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.background,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
