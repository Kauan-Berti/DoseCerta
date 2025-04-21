import { View, Text } from "react-native";
import { GlobalStyles } from "../constants/colors";
import RoundButton from "./RoundButton";

function NavigationHeader({ title, onBack, onNext }) {
  return (
    <View style={styles.headerContainer}>
      <RoundButton
        icon="ArrowLeft"
        onClick={onBack}
        color={GlobalStyles.colors.lightYellow}
      />
      <Text style={styles.headerText}>{title}</Text>
      <RoundButton
        icon="ArrowRight"
        onClick={onNext}
        color={GlobalStyles.colors.lightYellow}
      />
    </View>
  );
}

export default NavigationHeader;

const styles = {
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
  },
};
