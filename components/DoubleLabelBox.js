import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
function DoubleLabelBox({ title, text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.labeTitle}>{title}</Text>
      <Text style={styles.labelText}>{text}</Text>
    </View>
  );
}
export default DoubleLabelBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.border,
  },
  labeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
  },
  labelText: {
    fontSize: 18,
    color: GlobalStyles.colors.textSecondary,
  },
});
