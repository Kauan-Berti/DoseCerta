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
        <Pressable
          style={styles.modalOverlay}
          onPress={toggleModal} // Fecha o modal ao clicar fora
        >
          <View style={styles.modalContent}>
            <RoundButton
              backgroundColor={GlobalStyles.colors.primary}
              size={100}
              icon="Notebook"
              color={GlobalStyles.colors.button}
              onPress={() => {
                toggleModal();
                navigation.navigate("Add", {
                  screen: "CreateJournal",
                });
              }}
            />
            <RoundButton
              backgroundColor={GlobalStyles.colors.primary}
              size={100}
              icon="Bell"
              color={GlobalStyles.colors.button}
              onPress={() => {
                toggleModal();
                navigation.navigate("Add", {
                  screen: "CreateTreatment",
                });
              }}
            />
            <RoundButton
              size={100}
              icon="Pill"
              color={GlobalStyles.colors.button}
              backgroundColor={GlobalStyles.colors.primary}
              onPress={() => {
                toggleModal();
                navigation.navigate("Add", {
                  screen: "CreateMedication",
                });
              }}
            />
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
});
