import { View, Text, Image, StyleSheet } from "react-native";
import SquareIconButton from "./SquareIconButton";
import { GlobalStyles } from "../constants/colors";
import RoundButton from "./RoundButton";
import TreeDotsButton from "./TreeDotsButton";

// This is the default configuration

function AlertCard({ name, time, dose, preMeal }) {
  return (
    <View style={styles.card}>
      <View style={styles.titlesContainer}>
        <RoundButton
          icon="Bell"
          size={50}
          shadowOffset
          color={GlobalStyles.colors.lightYellow}
          borderColor={GlobalStyles.colors.lightYellow}
        />

        <Text style={styles.title}>{name}</Text>
        <TreeDotsButton onPress={() => {}} />
      </View>
      <View style={styles.lineSeparator} />

      <View style={styles.buttonsContainer}>
        <SquareIconButton title={time} icon="SunHorizon" />
        <SquareIconButton title={dose} icon="Pill" />
        <SquareIconButton title={preMeal} icon="ForkKnife" />
      </View>
    </View>
  );
}

export default AlertCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    backgroundColor: GlobalStyles.colors.card,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titlesContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  buttonsContainer: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
  },
  lineSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: GlobalStyles.colors.disabled,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  action: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 6, // Adiciona espaçamento vertical entre as actions
  },
  leftAction: {
    backgroundColor: GlobalStyles.colors.error,
  },
  rightAction: {
    backgroundColor: GlobalStyles.colors.accent,
  },
});
