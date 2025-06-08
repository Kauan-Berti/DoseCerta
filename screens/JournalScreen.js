import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import IconButton from "../components/IconButton";
import { useState } from "react";
import LogsScreen from "./Journals/LogsScreen";

function JournalScreen() {
  const [selectedTab, setSelectedTab] = useState("treatments");

  function onPressGraphics() {
    setSelectedTab("sensations");
  }
  function onPressTreatments() {
    setSelectedTab("treatments");
  }
  function onPressDiary() {
    setSelectedTab("diary");
  }

  return (
    <>
      <View style={styles.topButtonsContainer}>
        <View style={styles.buttonContainer}>
          <IconButton
            title="Tratamentos"
            color={
              selectedTab == "treatments"
                ? GlobalStyles.colors.primary
                : GlobalStyles.colors.card
            }
            textColor={
              selectedTab == "treatments"
                ? GlobalStyles.colors.card
                : GlobalStyles.colors.text
            }
            fullWidth={true}
            onPress={onPressTreatments}
          ></IconButton>
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            title="Sensações"
            color={
              selectedTab == "sensations"
                ? GlobalStyles.colors.primary
                : GlobalStyles.colors.card
            }
            textColor={
              selectedTab == "sensations"
                ? GlobalStyles.colors.card
                : GlobalStyles.colors.text
            }
            fullWidth={true}
            onPress={onPressGraphics}
          ></IconButton>
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            title="Diários"
            color={
              selectedTab == "diary"
                ? GlobalStyles.colors.primary
                : GlobalStyles.colors.card
            }
            textColor={
              selectedTab == "diary"
                ? GlobalStyles.colors.card
                : GlobalStyles.colors.text
            }
            fullWidth={true}
            onPress={onPressDiary}
          ></IconButton>
        </View>
      </View>
      <View style={styles.tabContent}>
        {selectedTab === "sensations" && (
          <Text style={styles.text}>Conteudo de Sensações</Text>
        )}
        {selectedTab === "treatments" && (
          <LogsScreen selectedTab={selectedTab} />
        )}
        {selectedTab === "diary" && (
          <Text style={styles.text}>Conteudo de Diários</Text>
        )}
      </View>
    </>
  );
}

export default JournalScreen;

const styles = StyleSheet.create({
  topButtonsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 12,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
  },
  buttonContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    marginTop: 8,
    marginHorizontal: 12,
  },
});
