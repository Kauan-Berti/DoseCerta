import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { GlobalStyles } from "../../constants/colors";
import AlertItem from "../../components/AlertItem";
import IconButton from "../../components/IconButton";
import { useState } from "react";
import { Alert as ReactAlert } from "react-native";
import RangeCalendar from "../../components/RangeCalendar";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import AlertForm from "./AlertForm";
import Toggle from "../../components/Toggle";
import { useEffect } from "react";

function CreateAlerts({ onNext, treatment = {}, alerts: initialAlerts }) {
  const [alerts, setAlerts] = useState(initialAlerts || []); // Gerencia os alertas localmente
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [isContinuous, setIsContinuous] = useState(
    treatment?.isContinuous || false
  );

  const [dateRange, setDateRange] = useState({
    startDate: treatment?.startDate || null,
    endDate: treatment?.endDate || null,
  });

  useEffect(() => {
    //console.log("Tratamento:", treatment);
    //console.log("Alertas:", alerts);
  }, [treatment, alerts]);

  useEffect(() => {
    if (
      treatment &&
      typeof treatment === "object" &&
      "isContinuous" in treatment
    ) {
      treatment.isContinuous = isContinuous;
    }
  }, [isContinuous, treatment]);

  function toggleState(setState) {
    setState((prev) => !prev);
  }

  function handleDateRangeSelected(range) {
    setDateRange(range);
  }

  function handleAddAlert() {
    setEditingAlert(null);
    setIsFormVisible(true);
  }

  function handleEditAlert(alert) {
    const normalizedAlert = {
      ...alert,
      time:
        typeof alert.time === "string" && alert.time.length >= 5
          ? alert.time.slice(0, 5)
          : alert.time,
    };
    setEditingAlert(normalizedAlert);
    setIsFormVisible(true);
  }

  function formatDate(dateString) {
    if (!dateString) return "Não especificado";
    try {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("pt-BR");
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return "Data inválida";
    }
  }

  function handleSubmitAlert(alertData) {
    const normalizedAlertData = {
      ...alertData,
      time:
        typeof alertData.time === "string" && alertData.time.length >= 5
          ? alertData.time.slice(0, 5)
          : alertData.time,
    };
    ReactAlert.alert("Erro", "Por favor, preencha todos os campos do alerta.");

    setAlerts((currentAlerts) => {
      const alertExists = currentAlerts.some(
        (alert) => alert.id === alertData.id
      );

      if (alertExists) {
        // Atualiza o alerta existente
        return currentAlerts.map((alert) =>
          alert.id === alertData.id ? { ...alert, ...alertData } : alert
        );
      } else {
        // Adiciona um novo alerta com o ID do tratamento associado
        return [
          ...currentAlerts,
          { ...alertData, id: `temp-${Date.now()}`, treatmentId: treatment.id },
        ];
      }
    });

    setIsFormVisible(false);
  }

  function handleDeleteAlert(alertId) {
    console.log("ID do alerta a ser removido:", alertId);
    setAlerts((currentAlerts) => {
      const updatedAlerts = currentAlerts.filter(
        (alert) => alert.id !== alertId
      );
      console.log("Alertas atualizados:", updatedAlerts);
      return updatedAlerts;
    });
    setIsFormVisible(false);
  }

  function validateAndProceed() {
    if (!isContinuous && (!dateRange.startDate || !dateRange.endDate)) {
      ReactAlert.alert(
        "Erro",
        "Por favor, selecione as datas de início e término do tratamento."
      );
      return;
    }

    if (alerts.length === 0) {
      ReactAlert.alert("Erro", "Por favor, adicione pelo menos um alerta.");
      return;
    }

    const updatedTreatment = {
      ...treatment,
      startDate: isContinuous ? null : dateRange.startDate,
      endDate: isContinuous ? null : dateRange.endDate,
      isContinuous: isContinuous,
    };

    //console.log("Tratamento:", updatedTreatment);
    //console.log("Alertas:", alerts);
    onNext({ treatment: updatedTreatment, alerts: alerts });
  }

  function renderAlertItem({ item }) {
    return (
      <AlertItem
        time={item.time}
        dose={item.dose}
        observations={item.observations}
        id={item.id}
        days={item.days}
        onPress={() => handleEditAlert(item)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={
            <View style={styles.componentsContainer}>
              <Text style={styles.titleText}>
                Vamos ajustar os horários e frequência da medicação.
              </Text>
              <Toggle
                onToggle={() => toggleState(setIsContinuous)}
                isEnabledText={"Uso Contínuo"}
                isDisabledText={"Uso Contínuo"}
                initalState={isContinuous}
              />

              {!isContinuous && (
                <Pressable onPress={() => toggleState(setIsCalendarVisible)}>
                  <Text style={styles.text}>Duração do tratamento</Text>
                  <DoubleLabelBox
                    title={"Data de início"}
                    text={formatDate(dateRange.startDate)}
                  />
                  <DoubleLabelBox
                    title={"Data de término"}
                    text={formatDate(dateRange.endDate)}
                  />
                </Pressable>
              )}
            </View>
          }
          ListFooterComponent={
            <View style={styles.buttonContainer}>
              <IconButton
                icon={"PlusCircle"}
                title={"Adicionar Horário"}
                color={GlobalStyles.colors.accent}
                textColor="white"
                onPress={handleAddAlert}
              />
            </View>
          }
        />
      </View>
      <View style={styles.nextButtonContainer}>
        <IconButton
          title={"Seguir"}
          color={GlobalStyles.colors.primary}
          icon={"ArrowCircleRight"}
          onPress={validateAndProceed}
        />
      </View>
      <RangeCalendar
        isVisible={isCalendarVisible}
        onClose={() => toggleState(setIsCalendarVisible)}
        onDateRangeSelected={handleDateRangeSelected}
        initalValues={dateRange}
      />

      <Modal visible={isFormVisible} animationType="slide">
        <AlertForm
          onCancel={() => setIsFormVisible(false)}
          onSubmit={handleSubmitAlert}
          defaultValues={editingAlert}
          onRemove={handleDeleteAlert}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
}

export default CreateAlerts;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 10,
    flex: 1,
    marginBottom: 30,
  },
  contentContainer: {
    paddingBottom: 150,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  buttonContainer: {
    paddingVertical: 10,
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
  titleText: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  componentsContainer: {
    gap: 10,
  },
});
