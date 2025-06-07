import { View, Text, StyleSheet, Image, FlatList, Alert } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import IconButton from "../../components/IconButton";
import { useEffect, useContext, useState } from "react";
import { AppContext } from "../../store/app-context";
import {
  storeTreatment,
  storeAlert,
  updateTreatment,
  updateAlert,
  deleteAlert,
} from "../../services/treatmentService";

function TreatmentResume({ onFinish, treatment, alerts, medication, origin }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const appContext = useContext(AppContext);
  function formatDate(dateString) {
    if (!dateString) return "Selecionar";
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR");
  }

  useEffect(() => {
    console.log("Tratamento:", treatment);
    console.log("Alertas:", alerts);
    console.log("Medicamento:", medication);
  }, [treatment, alerts, medication]);

  async function handleSave() {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validação do tratamento
      if (!medication) {
        throw new Error("O medicamento não foi selecionado.");
      }

      let savedTreatment;
      let isNew = !treatment.id || treatment.id.startsWith("temp-");

      if (isNew) {
        // Criação de um novo tratamento
        savedTreatment = await storeTreatment({
          medicationId: medication.id,
          startDate: treatment.startDate || null,
          endDate: treatment.endDate || null,
          isContinuous: treatment.isContinuous,
        });

        appContext.addTreatment({
          id: savedTreatment.id,
          medicationId: medication.id,
          startDate: treatment.startDate,
          endDate: treatment.endDate,
          isContinuous: treatment.isContinuous,
        });
      } else {
        // Atualização de um tratamento existente
        if (!treatment.id) throw new Error("ID do tratamento não encontrado.");

        savedTreatment = await updateTreatment(treatment.id, {
          medicationId: medication.id,
          startDate: treatment.startDate,
          endDate: treatment.endDate,
          isContinuous: treatment.isContinuous,
        });

        appContext.updateTreatment(treatment.id, {
          id: savedTreatment.id,
          medicationId: medication.id,
          startDate: treatment.startDate,
          endDate: treatment.endDate,
          isContinuous: treatment.isContinuous,
        });
      }

      // Identificar alertas removidos
      const treatmentIdForAlerts = isNew ? savedTreatment.id : treatment.id;

      const existingAlerts = appContext.alerts.filter(
        (alert) => alert.treatmentId === treatment.id
      );
      const removedAlerts = existingAlerts.filter(
        (existingAlert) =>
          !alerts.some((alert) => alert.id === existingAlert.id)
      );

      // Excluir alertas removidos
      for (const alert of removedAlerts) {
        await deleteAlert(alert.id); // Remove do backend
        appContext.deleteAlert(alert.id); // Remove do contexto
      }

      // Validação e salvamento dos alertas
      for (const alert of alerts) {
        if (!alert.time || !alert.dose || !alert.days?.length) {
          throw new Error("Os dados do alerta estão incompletos.");
        }

        if (!alert.id || alert.id.startsWith("temp-")) {
          // Criação de um novo alerta
          const { id, ...alertWithoutId } = alert;
          alertWithoutId.treatmentId = savedTreatment.id;

          const savedAlert = await storeAlert(alertWithoutId);
          // Atualize o contexto com o alerta salvo (incluindo o id real do backend)
          appContext.addAlert({
            ...alertWithoutId,
            id: savedAlert.id,
          });
        } else {
          // Atualização de um alerta existente
          await updateAlert(alert.id, {
            time: alert.time,
            dose: alert.dose,
            days: alert.days,
            observations: alert.observations,
            treatmentId: savedTreatment.id,
          });
          appContext.updateAlert(alert.id, {
            time: alert.time,
            dose: alert.dose,
            days: alert.days,
            observations: alert.observations,
            treatmentId: savedTreatment.id,
          });
        }
      }
      onFinish(origin); // Finaliza o fluxo
    } catch (err) {
      console.error("Erro ao salvar o tratamento:", err);
      setError(err.message || "Não foi possível salvar o tratamento.");
    } finally {
      setIsSubmitting(false);
    }
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

      <Text style={styles.title}>{medication.name}</Text>
      {treatment.isContinuous ? (
        <View style={styles.continuousContainer}>
          <Text style={styles.continuousText}>
            Este é um tratamento contínuo.
          </Text>
        </View>
      ) : (
        <>
          <DoubleLabelBox
            title={"Data de Início"}
            text={formatDate(treatment.startDate) || "Não especificado"}
          />
          <DoubleLabelBox
            title={"Data de Término"}
            text={formatDate(treatment.endDate) || "Não especificado"}
          />
        </>
      )}
      <DoubleLabelBox
        title={"Quantidade em estoque"}
        text={`${medication?.amount} ${medication?.form}(s)`}
      />
      <DoubleLabelBox
        title={"Quantidade mínima"}
        text={`${medication?.minAmount} ${medication?.form}(s)`}
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
      data={alerts}
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
