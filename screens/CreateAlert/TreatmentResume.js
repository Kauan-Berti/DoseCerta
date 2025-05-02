import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import IconButton from "../../components/IconButton";
import { useContext } from "react";
import { MedicationsContext } from "../../store/medication-context";
import Medication from "../../models/medication";
import { useState } from "react";
import { storeMedication } from "../../util/http";

function TreatmentResume({ onFinish, treatmentData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const medicationContext = useContext(MedicationsContext);

  async function handleSave() {
    const newMedication = new Medication(
      treatmentData.medication.id || Date.now().toString(),
      treatmentData.medication.name,
      treatmentData.medication.amount,
      treatmentData.medication.minAmount,
      treatmentData.medication.form,
      treatmentData.medication.unit,
      treatmentData.alerts.length > 0 ? treatmentData.alerts : [] // Se não houver alertas, envia um array vazio
    );

    setIsSubmitting(true);
    try {
      const id = await storeMedication(newMedication);
      medicationContext.addMedication({ ...newMedication, id: id });
    } catch (error) {
      setError("Não foi possível salvar o tratamento.");
    } finally {
      setIsSubmitting(false);
    }

    onFinish();
  }

  function renderAlertItem({ item }) {
    return (
      <View style={styles.alertContainer}>
        <Text style={styles.text}>
          Horário: {item.time} - Dose: {item.dose}
        </Text>
        {item.observations && (
          <Text style={styles.text}>Observações: {item.observations}</Text>
        )}
        {item.days && (
          <Text style={styles.text}>Dias: {item.days.join(", ")}</Text>
        )}
      </View>
    );
  }

  const headerComponent = (
    <>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/custom/image 1.png")}
        />
      </View>

      <Text style={styles.title}>{treatmentData.medication.name}</Text>
      {treatmentData.treatmentPeriod.isContinuous ? (
        <View style={styles.continuousContainer}>
          <Text style={styles.continuousText}>
            Este é um tratamento contínuo.
          </Text>
        </View>
      ) : (
        <>
          <DoubleLabelBox
            title={"Data de Início"}
            text={treatmentData.treatmentPeriod.startDate || "Não especificado"}
          />
          <DoubleLabelBox
            title={"Data de Término"}
            text={treatmentData.treatmentPeriod.endDate || "Não especificado"}
          />
        </>
      )}
      <DoubleLabelBox
        title={"Quantidade em estoque"}
        text={`${treatmentData.medication.amount} ${treatmentData.medication.form}(s)`}
      />
      <DoubleLabelBox
        title={"Quantidade mínima"}
        text={`${treatmentData.medication.minAmount} ${treatmentData.medication.form}(s)`}
      />

      <Text style={styles.subtitle}>Alertas Criados:</Text>
    </>
  );

  const footerComponent = (
    <>
      <View style={styles.saveButtonContainer}>
        <IconButton
          color={GlobalStyles.colors.accent}
          textColor="white"
          icon="CheckCircle"
          title={isSubmitting ? "Salvando..." : "Salvar"}
          fullWidth={true}
          onPress={handleSave}
          disabled={isSubmitting}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );

  return (
    <FlatList
      data={treatmentData.alerts}
      keyExtractor={(item) => item.id}
      renderItem={renderAlertItem}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

export default TreatmentResume;

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
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: GlobalStyles.colors.text,
    fontWeight: "bold",
    marginVertical: 10,
  },
  contentContainer: {
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
    flexDirection: "column",
    marginVertical: 5,
    padding: 10,
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.border,
  },
  continuousContainer: {
    padding: 10,
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.border,
    marginBottom: 10,
  },
  continuousText: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
    textAlign: "center",
  },
  errorText: {
    color: GlobalStyles.colors.error,
    textAlign: "center",
    marginTop: 10,
  },
});
