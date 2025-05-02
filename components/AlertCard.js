import { View, Text, Image, StyleSheet } from "react-native";
import SquareIconButton from "./SquareIconButton";
import { GlobalStyles } from "../constants/colors";
import { Bell } from "phosphor-react-native";
import RoundButton from "./RoundButton";

function AlertCard({ name, time, dose, preMeal }) {
  return (
    <View style={styles.card}>
      <View style={styles.titlesContainer}>
        <RoundButton
          icon="Bell"
          size={40}
          shadowOffset
          color={GlobalStyles.colors.primary}
          borderColor={GlobalStyles.colors.primary}
        />

        <Text style={styles.text}>{name}</Text>
        <SquareIconButton
          icon="ArrowCircleRight"
          size={30}
          color={GlobalStyles.colors.buttonSecondary}
        />
      </View>
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
    marginHorizontal: 10,
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
    marginHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  buttonsContainer: {
    marginTop: 10,
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
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
});
