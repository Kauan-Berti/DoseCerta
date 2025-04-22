import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import SquareIconButton from "../../components/SquareIconButton";
import Input from "../../components/Input";
import IconButton from "../../components/IconButton";
import { useContext } from "react";
import { MedicationsContext } from "../../store/medication-context";
import Medication from "../../models/medication";
import { useState } from "react";
import { storeMedication } from "../../util/http";

function NewMedicationResume({ onFinish, medicationData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const medicationContext = useContext(MedicationsContext);

  async function handleSave() {
    const newMedication = new Medication(
      medicationData.id || Date.now().toString(),
      medicationData.name,
      medicationData.amount,
      medicationData.minAmount,
      medicationData.form,
      medicationData.unit,
      medicationData.treatmentTime,
      medicationData.treatmentStartDate,
      medicationData.alerts
    );

    setIsSubmitting(true);
    try {
      const id = await storeMedication(newMedication);
      medicationContext.addMedication({ ...newMedication, id: id });
    } catch (error) {
      setError("Não foi possível salvar o medicamento.");
    } finally {
      setIsSubmitting(false);
    }

    onFinish();
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
        <DoubleLabelBox
          title={"Duração do tratamento"}
          text={`${medicationData.treatmentTime} dias`}
        />
        <DoubleLabelBox
          title={"Data de início"}
          text={medicationData.treatmentStartDate}
        />

        <Text style={styles.subtitle}>Alertas</Text>

        {medicationData.alerts?.map((alert) => (
          <View key={alert.id} style={styles.alertContainer}>
            <SquareIconButton title={alert.time} icon="SunHorizon" />
            <SquareIconButton title={alert.dose} icon="Pill" />
            <SquareIconButton title={alert.preMeal} icon="ForkKnife" />
          </View>
        ))}

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

export default NewMedicationResume;

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
