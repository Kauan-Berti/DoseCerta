import { Pressable, Text, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import * as PhosphorIcons from "phosphor-react-native";

function IconButton({
  title,
  icon,
  onPress,
  color = "black",
  textColor = "black",
  fullWidth = false,
}) {
  const IconComponent = PhosphorIcons[icon];
  return (
    <View
      style={[styles.buttonContainer, fullWidth && styles.fullWidthContainer]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: color },
          fullWidth && styles.fullWidthButton,
          pressed && styles.pressed,
        ]}
      >
        <View>
          {IconComponent && (
            <IconComponent
              size={24} // Ajusta o tamanho do ícone
              color={textColor || "black"} // Cor do ícone
            />
          )}
        </View>
        {title && (
          <Text style={[styles.text, { color: textColor || "black" }]}>
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
  },
  fullWidthContainer: {
    alignSelf: "stretch", // Faz o botão ocupar toda a largura disponível
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: GlobalStyles.colors.button,
    borderColor: GlobalStyles.colors.border,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  fullWidthButton: {
    justifyContent: "center", // Centraliza o conteúdo horizontalmente
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.8,
  },
});
