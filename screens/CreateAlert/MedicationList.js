import { View, Text, FlatList, StyleSheet } from "react-native";
import { useContext, useState, useEffect } from "react";
import { MedicationsContext } from "../../store/medication-context";
import { fetchMedication } from "../../util/http";
import SelectMedicationCard from "./SelectMedicationCard";
import { GlobalStyles } from "../../constants/colors";
import IconButton from "../../components/IconButton";
import { Alert } from "react-native";

function MedicationList({ onNext }) {
  const medicationsContext = useContext(MedicationsContext);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedMedicationId, setSelectedMedicationId] = useState(null);

  function handleSelectMedication(id) {
    setSelectedMedicationId(id); // Atualiza o ID do medicamento selecionado
  }

  function renderMedicationItem(itemData) {
    const isSelected = itemData.item.id === selectedMedicationId; // Verifica se o item está selecionado

    return (
      <SelectMedicationCard
        isSelected={isSelected}
        onPress={() => handleSelectMedication(itemData.item.id)}
      >
        <Text>{itemData.item.name}</Text>
      </SelectMedicationCard>
    );
  }

  useEffect(() => {
    async function getMedications() {
      setIsFetching(true);
      try {
        const medications = await fetchMedication();
        medicationsContext.setMedications(medications);
      } catch (err) {
        console.log(err);
        Alert.alert("Erro", "Não foi possível carregar os medicamentos.");
      } finally {
        setIsFetching(false);
      }
    }
    getMedications();
  }, []);

  function handleNext() {
    if (selectedMedicationId == null) {
      Alert.alert("Erro", "Por favor, selecione um medicamento.");
      return;
    }

    const selectedMedication = medicationsContext.medications.find(
      (medication) => medication.id === selectedMedicationId
    );

    // Envia os dados do medicamento selecionado para a próxima etapa
    onNext(selectedMedication);
  }

  return (
    <View style={styles.container}>
      {isFetching && (
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Carregando medicamentos...</Text>
        </View>
      )}
      {!isFetching && medicationsContext.medications.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Nenhum medicamento encontrado.</Text>
        </View>
      )}
      {!isFetching && medicationsContext.medications.length > 0 && (
        <>
          <FlatList
            data={medicationsContext.medications}
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
    position: "absolute", // Posiciona o botão de forma fixa
    bottom: 80, // Distância da parte inferior da tela
    right: 20, // Distância da lateral direita
  },
});
