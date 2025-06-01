import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import IconButton from "../components/IconButton";
import { useState } from "react";
import ResumeCard from "../components/ResumeCard";

function JournalScreen() {
  const [selectedTab, setSelectedTab] = useState("resume");
  function onPressGraphics() {
    setSelectedTab("resume");
    console.log("Resume");
  }
  function onPressResume() {
    setSelectedTab("details");
    console.log("Details");
  }

  return (
    <>
      <View style={styles.topButtonsContainer}>
        <View style={styles.buttonContainer}>
          <IconButton
            title="Resumo"
            color={GlobalStyles.colors.button}
            textColor={GlobalStyles.colors.text}
            fullWidth={true}
            onPress={onPressGraphics}
          ></IconButton>
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            title="Detalhes"
            color={GlobalStyles.colors.button}
            textColor={GlobalStyles.colors.text}
            fullWidth={true}
            onPress={onPressResume}
          ></IconButton>
        </View>
      </View>
      <View style={styles.tabContent}>
        {selectedTab === "resume" && <ResumeCard></ResumeCard>}
        {selectedTab === "details" && (
          <Text style={styles.text}>Conteúdo dos Detalhes</Text>
        )}
      </View>
    </>
  );
}

export default JournalScreen;

const styles = StyleSheet.create({
  topButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12",
    marginHorizontal: "12",
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
    marginTop: 24,
    marginHorizontal: 12,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
