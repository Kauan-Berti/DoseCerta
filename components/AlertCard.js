import { View, Text, Image, StyleSheet } from "react-native";
import SquareIconButton from "./SquareIconButton";
import { GlobalStyles } from "../constants/colors";
import RoundButton from "./RoundButton";
import TreeDotsButton from "./TreeDotsButton";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import IconButton from "./IconButton";
import { useRef } from "react";
function AlertCard({ name, time, dose, preMeal }) {
  const swipeableRef = useRef(null); // Cria uma referência para o Swipeable

  function handleOpenRightActions() {
    swipeableRef.current?.openRight(); // Abre as ações à direita
  }
  function renderLeftActions() {
    return (
      <View style={[styles.action, styles.leftAction]}>
        <IconButton
          icon="Trash"
          color={GlobalStyles.colors.error}
          textColor="white"
          onPress={() => {}}
          title="Excluir"
        />
      </View>
    );
  }

  function renderRightActions() {
    return (
      <View style={[styles.action, styles.rightAction]}>
        <IconButton
          icon="PencilSimple"
          color={GlobalStyles.colors.accent}
          textColor="white"
          onPress={() => {}}
          title="Editar"
        />
      </View>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions} // Permite swipe para a direita
      renderLeftActions={renderLeftActions} // Bloqueia swipe para a esquerda
      overshootLeft={false}
      overshootRight={false}
    >
      <View style={styles.card}>
        <View style={styles.titlesContainer}>
          <RoundButton
            icon="Bell"
            size={50}
            shadowOffset
            color={GlobalStyles.colors.lightYellow}
            borderColor={GlobalStyles.colors.lightYellow}
          />

          <Text style={styles.title}>{name}</Text>
          <TreeDotsButton onPress={handleOpenRightActions} />
        </View>
        <View style={styles.lineSeparator} />

        <View style={styles.buttonsContainer}>
          <SquareIconButton title={time} icon="SunHorizon" />
          <SquareIconButton title={dose} icon="Pill" />
          <SquareIconButton title={preMeal} icon="ForkKnife" />
        </View>
      </View>
    </Swipeable>
  );
}

export default AlertCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    backgroundColor: GlobalStyles.colors.card,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titlesContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  buttonsContainer: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
  },
  lineSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: GlobalStyles.colors.disabled,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  action: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 6, // Adiciona espaçamento vertical entre as actions
  },
  leftAction: {
    backgroundColor: GlobalStyles.colors.error,
  },
  rightAction: {
    backgroundColor: GlobalStyles.colors.accent,
  },
});
