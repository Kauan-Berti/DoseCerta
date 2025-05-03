import { Text, View, StyleSheet, Image } from "react-native";
import { GlobalStyles } from "../constants/colors";
import TreeDotsButton from "./TreeDotsButton";
import ProgressBar from "./ProgressBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function MedicationCard({ item, onPress }) {
  function handlePress() {
    onPress(item);
  }

  const progress = Math.min(
    100,
    Math.max(0, ((item.amount - item.minAmount) / (2 * item.minAmount)) * 100)
  );
  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Image
          source={require("../assets/custom/PillYellowIcon.png")}
          style={styles.image}
        />
        <Text style={styles.title}>{item.name}</Text>
        <TreeDotsButton onPress={handlePress} />
      </View>
      <View style={styles.lineSeparator} />
      <View style={styles.lowerContainer}>
        <ProgressBar progress={progress} height={20} />
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>Estoque: {item.amount}</Text>
          <Text style={styles.amount}>Mínimo: {item.minAmount}</Text>
        </View>
      </View>
    </View>
  );
}

export default MedicationCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.card,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: GlobalStyles.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
  },
  selected: {
    backgroundColor: GlobalStyles.colors.primary,
  },
  textSelected: {
    color: GlobalStyles.colors.background,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  upperContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  lowerContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  lineSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: GlobalStyles.colors.disabled,
    marginVertical: 10,
  },
  amount: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
    marginTop: 10,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
