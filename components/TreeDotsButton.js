import { Pressable, StyleSheet } from "react-native";
import { DotsThreeVertical } from "phosphor-react-native";
import { GlobalStyles } from "../constants/colors";

function TreeDotsButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <DotsThreeVertical color={GlobalStyles.colors.primary} size={24} />
    </Pressable>
  );
}

export default TreeDotsButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  pressed: {
    opacity: 0.75,
  },
});
