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
import Alert from "../../models/alert";
import { useState, useEffect } from "react";
import { Alert as ReactAlert } from "react-native";
import RangeCalendar from "../../components/RangeCalendar";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import AlertForm from "./AlertForm";
import Toggle from "../../components/Toggle";

function CreateAlerts({ onNext, treatmentData }) {
  const [alerts, setAlerts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [isContinuous, setIsContinuous] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

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
    setEditingAlert(alert);
    setIsFormVisible(true);
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR");
  }

  function handleSubmitAlert(alertData) {
    if (!alertData.time || !alertData.dose) {
      ReactAlert.alert(
        "Erro",
        "Por favor, preencha todos os campos do alerta."
      );
      return;
    }

    if (editingAlert) {
      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alert.id === editingAlert.id ? { ...alert, ...alertData } : alert
        )
      );
    } else {
      const newAlert = new Alert(
        `${alerts.length + 1}`,
        alertData.time,
        alertData.dose,
        alertData.observations,
        alertData.days
      );
      setAlerts((currentAlerts) => [...currentAlerts, newAlert]);
    }
    setIsFormVisible(false);
  }
 

  function validateAndProceed() {
    if (!isContinuous) {
      if (!dateRange.startDate || !dateRange.endDate) {
        ReactAlert.alert(
          "Erro",
          "Por favor, selecione as datas de início e término do tratamento."
        );
        return;
      }
    }

    if (alerts.length === 0) {
      ReactAlert.alert("Erro", "Por favor, adicione pelo menos um alerta.");
      return;
    }

    const updatedTreatmentData = {
      ...treatmentData,
      alerts,
      treatmentPeriod: {
        startDate: isContinuous ? null : dateRange.startDate,
        endDate: isContinuous ? null : dateRange.endDate,
        isContinuous,
      },
    };

    onNext(updatedTreatmentData);
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
                isEnabledText={"Uso Continuo"}
                isDisabledText={"Uso Continuo"}
              />

              {!isContinuous && (
                <Pressable onPress={() => toggleState(setIsCalendarVisible)}>
                  <Text style={styles.text}>Duração do tratamento</Text>
                  <DoubleLabelBox
                    title={"Data de início"}
                    text={
                      dateRange.startDate
                        ? formatDate(dateRange.startDate)
                        : "Selecionar"
                    }
                  />
                  <DoubleLabelBox
                    title={"Data de término"}
                    text={
                      dateRange.endDate
                        ? formatDate(dateRange.endDate)
                        : "Selecionar"
                    }
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
      />

      <Modal visible={isFormVisible} animationType="slide">
        <AlertForm
          onCancel={() => setIsFormVisible(false)}
          onSubmit={handleSubmitAlert}
          defaultValues={editingAlert}
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
