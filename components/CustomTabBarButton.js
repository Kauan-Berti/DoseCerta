import { Pressable, StyleSheet, View, Modal, Text } from "react-native";
import { GlobalStyles } from "../constants/colors";
import { useState } from "react";
import RoundButton from "./RoundButton";
import { useNavigation } from "@react-navigation/native";

function CustomTabBarButton({ children, onPress }) {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  function toggleModal() {
    setIsModalVisible((prevState) => !prevState);
  }

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.pressed : null,
          ]}
          onPress={toggleModal}
          android_ripple={{ color: "black" }}
        >
          {children}
        </Pressable>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleModal}>
          <View style={styles.semicircleContainer}>
            {[
              { icon: "Scroll", screen: "CreateDiary" },
              { icon: "Bell", screen: "CreateTreatment" },
              { icon: "Pill", screen: "CreateMedication" },
              { icon: "Sparkle", screen: "CreateSensation" },
            ].map((btn, idx, arr) => {
              // Distribui os botões em um arco de 180°
              const angle = Math.PI * (idx / (arr.length - 1)); // 0, PI/3, 2PI/3, PI
              const radius = 110; // ajuste o raio conforme necessário
              const btnSize = 80; // novo tamanho do botão

              const x = Math.cos(angle - Math.PI) * radius;
              const y = Math.sin(angle - Math.PI) * radius;

              return (
                <View
                  key={btn.icon}
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 0,
                    transform: [
                      { translateX: x - btnSize / 2 },
                      { translateY: y },
                    ],
                  }}
                >
                  <RoundButton
                    backgroundColor={GlobalStyles.colors.primary}
                    size={70}
                    icon={btn.icon}
                    color={GlobalStyles.colors.button}
                    onPress={() => {
                      toggleModal();
                      navigation.navigate("Add", { screen: btn.screen });
                    }}
                  />
                </View>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
export default CustomTabBarButton;

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.button,
    backgroundColor: GlobalStyles.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    overflow: "hidden",

  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  pressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    borderColor: GlobalStyles.colors.text,
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
    marginBottom: 100,
  },
  modalTitle: {
    fontSize: 18,
    color: GlobalStyles.colors.text,
    marginBottom: 20,
    fontWeight: "bold",
  },
  semicircleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 100, // ajuste conforme a altura do seu tab bar
    height: 300, // ajuste conforme o raio
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
