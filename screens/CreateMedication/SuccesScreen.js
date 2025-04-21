import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import { CheckCircle } from "phosphor-react-native";

function SuccesScreen({ text }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <CheckCircle size={200} color={"white"} />
      </View>

      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

export default SuccesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: GlobalStyles.colors.accent,
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
    textAlign: "center",
    marginTop: 10,
  },
});
