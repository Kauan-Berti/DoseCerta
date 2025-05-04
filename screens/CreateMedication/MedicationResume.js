import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import IconButton from "../../components/IconButton";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import Medication from "../../models/medication";
import { useState } from "react";
import { storeMedication, updateMedication } from "../../util/supabase";

function MedicationResume({ onFinish, medicationData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const appContext = useContext(AppContext);

  async function handleSave() {
    setIsSubmitting(true);
    setError(null);

    try {
      // Cria o objeto do medicamento com um ID provisório

      if (medicationData.id !== 0) {
        await updateMedication(medicationData.id, medicationData);
        appContext.updateMedication(medicationData.id, medicationData); // Atualiza no contexto
      } else {
        const savedMedication = await storeMedication(medicationData);
        appContext.addMedication(savedMedication); // Adiciona ao contexto
      }
      onFinish(); // Finaliza o fluxo
    } catch (error) {
      console.error("Erro ao salvar o medicamento:", error);
      setError("Não foi possível salvar o medicamento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/custom/image 1.png")}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{medicationData.name}</Text>
        <DoubleLabelBox title={"Forma"} text={medicationData.form} />
        <DoubleLabelBox title={"Unidade"} text={medicationData.unit} />
        <DoubleLabelBox
          title={"Quantidade em estoque"}
          text={medicationData.amount}
        />
        <DoubleLabelBox
          title={"Quantidade mínima"}
          text={medicationData.minAmount}
        />
        <View style={styles.saveButtonContainer}>
          <IconButton
            color={GlobalStyles.colors.accent}
            textColor="white"
            icon="CheckCircle"
            title="Salvar"
            fullWidth={true}
            onPress={handleSave}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default MedicationResume;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 10,
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.border,
    height: 150,
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    color: GlobalStyles.colors.text,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  squareButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 200,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  saveButtonContainer: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  alertContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
});
