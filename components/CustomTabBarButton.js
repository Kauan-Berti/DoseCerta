import { Pressable, StyleSheet, View } from "react-native";
import { GlobalStyles } from "../constants/colors";

function CustomTabBarButton({ children, onPress }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.pressed : null,
        ]}
        onPress={onPress}
        android_ripple={{ color: "black" }} // Cor do efeito ripple no Android
      >
        {children}
      </Pressable>
    </View>
  );
}
export default CustomTabBarButton;

const styles = StyleSheet.create({
  container: {
    width: 70, // Largura do botão
    height: 70, // Altura do botão
    borderRadius: 35, // Torna o botão redondo
    borderWidth: 2, // Largura da borda
    borderColor: GlobalStyles.colors.button, // Cor da borda
    backgroundColor: GlobalStyles.colors.primary, // Cor de fundo do botão
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20, // Faz o botão ultrapassar a tabBar
    overflow: "hidden", // Esconde o que ultrapassa a borda do botão
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  pressed: {
    //backgroundColor: GlobalStyles.colors.button, // Cor de fundo quando pressionado
  },
});
