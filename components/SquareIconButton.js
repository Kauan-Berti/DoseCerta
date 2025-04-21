import { Pressable, Text, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import * as PhosphorIcons from "phosphor-react-native";

function SquareIconButton({ title, icon, onPress, size = 80, color }) {
  const IconComponent = PhosphorIcons[icon];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, backgroundColor: color },
        pressed && styles.pressed,
      ]}
    >
      <View>
        {IconComponent && (
          <IconComponent
            size={title ? size / 2.5 : size / 1.5} // Ajusta o tamanho do ícone
            color="#fff" // Cor do ícone
          />
        )}
      </View>
      {title && <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

export default SquareIconButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: GlobalStyles.colors.button,
    borderColor: GlobalStyles.colors.border,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});
