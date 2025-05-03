import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import Input from "../../components/Input";
import IconButton from "../../components/IconButton";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import Medication from "../../models/medication";
import { useState } from "react";
import { storeMedication } from "../../util/http";
import { Alert } from "react-native";

function MedicationResume({ onFinish, medicationData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const appContext = useContext(AppContext);

  async function handleSave() {
    setIsSubmitting(true);
    setError(null);

    try {
      // Cria o objeto do medicamento com um ID provisório
      const newMedication = new Medication(
        medicationData.id || Date.now().toString(),
        medicationData.name,
        medicationData.amount,
        medicationData.minAmount,
        medicationData.form,
        medicationData.unit
      );

      // Salva o medicamento no Firebase e obtém o ID gerado
      const savedMedication = await storeMedication(newMedication);

      // Atualiza o ID do medicamento no contexto
      appContext.addMedication(savedMedication); // Adiciona o medicamento com o ID atualizado ao contexto
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

      <Text style={styles.title}>Paracetamol 500mg</Text>
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

        <Input label={"Observações"} textInputConfig={{ multiline: true }} />
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
    fontSize: 20,
    color: GlobalStyles.colors.text,
    textAlign: "center",
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
