import { Pressable, StyleSheet } from "react-native";
import { DotsThreeVertical } from "phosphor-react-native";
import { GlobalStyles } from "../constants/colors";
import RoundButton from "./RoundButton";

function TreeDotsButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <RoundButton
        icon="ArrowRight"
        onPress={() => {}}
        color={GlobalStyles.colors.background}
        backgroundColor={GlobalStyles.colors.lightYellow}
        size={30}
      />
    </Pressable>
  );
}

export default TreeDotsButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    padding: 12,
  },
  pressed: {
    opacity: 0.75,
  },
});
