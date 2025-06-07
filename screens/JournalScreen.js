import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import IconButton from "../components/IconButton";
import { useEffect, useState, useContext, useRef } from "react";
import { Alert } from "react-native";

import ResumeCard from "../components/ResumeCard";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../store/app-context";
import { fetchMedicationLogsInRange, fetchTreatments } from "../util/supabase";

function JournalScreen() {
  //Puxar registros de doses
  const appContext = useContext(AppContext);

  const [isFetching, setIsFetching] = useState(false);
  const [selectedTab, setSelectedTab] = useState("medications");

  useEffect(() => {
    
    async function fetchTreatmentsFromAPI() {
      try {
        const treatments = await fetchTreatments();
        treatments.forEach((treatment) => {
          appContext.addTreatment(treatment);
        });
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar os tratamentos.");
      }
    }

    async function fetchMedicationLogsFromAPI() {
      setIsFetching(true);
      try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        const logs = await fetchMedicationLogsInRange(
          treatmentId,
          sevenDaysAgo,
          today
        );
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possivel carregar registro de doses");
      } finally {
        setIsFetching(false);
      }
    }
    fetchMedicationLogsFromAPI();
  }, [appContext]);

  function onPressGraphics() {
    setSelectedTab("sensations");
    console.log("Sensações");
  }
  function onPressResume() {
    setSelectedTab("medications");
    console.log("Medicamentos");
  }

  return (
    <>
      <View style={styles.topButtonsContainer}>
        <View style={styles.buttonContainer}>
          <IconButton
            title="Sensações"
            color={GlobalStyles.colors.button}
            textColor={GlobalStyles.colors.text}
            fullWidth={true}
            onPress={onPressGraphics}
          ></IconButton>
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            title="Medicamentos"
            color={GlobalStyles.colors.button}
            textColor={GlobalStyles.colors.text}
            fullWidth={true}
            onPress={onPressResume}
          ></IconButton>
        </View>
      </View>
      <View style={styles.tabContent}>
        {selectedTab === "sensations" && (
          <Text style={styles.text}>Conteudo de Sensações</Text>
        )}
        {selectedTab === "medications" && <ResumeCard></ResumeCard>}
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
