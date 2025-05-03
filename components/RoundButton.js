import { Pressable, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import * as PhosphorIcons from "phosphor-react-native";
import { Children } from "react";

function RoundButton({
  onPress,
  icon,
  size = 24,
  color,
  children,
  backgroundColor,
  borderColor,
}) {
  const IconComponent = PhosphorIcons[icon];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View
        style={[
          styles.button,
          { backgroundColor: backgroundColor || GlobalStyles.colors.button },
          { width: size, height: size, borderRadius: size / 2 },
          { borderColor: borderColor || GlobalStyles.colors.border },
          { borderWidth: 2 },
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        {IconComponent && (
          <IconComponent
            size={size * 0.7} // Ajusta o tamanho do ícone
            color={color} // Cor do ícone
          />
        )}
        {children}
      </View>
    </Pressable>
  );
}

export default RoundButton;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: GlobalStyles.colors.background,
    borderColor: GlobalStyles.colors.border,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressed: {
    opacity: 0.75,
  },
});
