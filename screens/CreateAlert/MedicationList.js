import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-context";
import { fetchMedications } from "../../services/medicationService";
import SelectMedicationCard from "./SelectMedicationCard";
import { GlobalStyles } from "../../constants/colors";
import IconButton from "../../components/IconButton";

function MedicationList({ medication, onNext }) {
  const appContext = useContext(AppContext);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState(
    medication ? medication.id : null
  );

  useEffect(() => {
    //console.log("Medicamento selecionado:", medicationId);
  }, [medication]);

  useEffect(() => {
    if (appContext.medications.length > 0) {
      return;
    }

    async function fetchMedicationsFromAPI() {
      setIsFetching(true);
      try {
        const medications = await fetchMedications();
        medications.forEach((medication) => {
          appContext.addMedication(medication);
        });
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar os medicamentos.");
      } finally {
        setIsFetching(false);
      }
    }

    fetchMedicationsFromAPI();
  }, [appContext]);

  function handleSelectMedication(id) {
    setSelectedMedicationId(id);
  }

  function handleNext() {
    if (!selectedMedicationId) {
      Alert.alert("Erro", "Por favor, selecione um medicamento.");
      return;
    }

    const selectedMedication = appContext.medications.find(
      (medication) => medication.id === selectedMedicationId
    );

    if (!selectedMedication) {
      Alert.alert("Erro", "O medicamento selecionado não foi encontrado.");
      return;
    }

    onNext(selectedMedication);
  }

  function renderMedicationItem({ item }) {
    const isSelected = item.id === selectedMedicationId;

    return (
      <SelectMedicationCard
        isSelected={isSelected}
        onPress={() => handleSelectMedication(item.id)}
      >
        <Text>{item.name}</Text>
      </SelectMedicationCard>
    );
  }

  return (
    <View style={styles.container}>
      {isFetching && (
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Carregando medicamentos...</Text>
        </View>
      )}
      {!isFetching && appContext.medications.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Nenhum medicamento encontrado.</Text>
        </View>
      )}
      {!isFetching && appContext.medications.length > 0 && (
        <>
          <FlatList
            data={appContext.medications}
            keyExtractor={(item) => item.id}
            renderItem={renderMedicationItem}
          />

          <View style={styles.nextButtonContainer}>
            <IconButton
              title={"Seguir"}
              color={GlobalStyles.colors.primary}
              icon={"ArrowCircleRight"}
              onPress={handleNext}
            />
          </View>
        </>
      )}
    </View>
  );
}

export default MedicationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
  },
  text: {
    fontSize: 18,
    color: GlobalStyles.colors.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
});
