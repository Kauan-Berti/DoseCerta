import { View, Text } from "react-native";
import { GlobalStyles } from "../constants/colors";
import RoundButton from "./RoundButton";

function NavigationHeader({ title, onBack, onNext }) {
  return (
    <View style={styles.headerContainer}>
      {onBack && (
        <RoundButton
          icon="ArrowLeft"
          onPress={onBack}
          color={GlobalStyles.colors.lightYellow}
          size={30}
        />
      )}
      {!onBack && <View style={{ width: 30 }} />}
      <Text style={styles.headerText}>{title}</Text>
      {!onNext && <View style={{ width: 30 }} />}
      {onNext && (
        <RoundButton
          icon="ArrowRight"
          onPress={onNext}
          color={GlobalStyles.colors.lightYellow}
          size={30}
        />
      )}
    </View>
  );
}

export default NavigationHeader;

const styles = {
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: GlobalStyles.colors.card,
  },
  headerText: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
  },
};
