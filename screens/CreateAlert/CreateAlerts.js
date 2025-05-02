import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { GlobalStyles } from "../../constants/colors";
import AlertItem from "../../components/AlertItem";
import IconButton from "../../components/IconButton";
import Alert from "../../models/alert";
import { useState } from "react";
import { Alert as ReactAlert } from "react-native";
import RoundButton from "../../components/RoundButton";
import RangeCalendar from "../../components/RangeCalendar";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import AlertForm from "./AlertForm";

function CreateAlerts({ onNext, medicationData }) {
  const [alerts, setAlerts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);

  const [startDate, setStartDate] = useState(null); // Data de início
  const [endDate, setEndDate] = useState(null); // Data de término
  const [selectingEndDate, setSelectingEndDate] = useState(false); // Estado para controlar a seleção da data de término
  function handleDayPress(day) {
    if (!selectingEndDate) {
      // Seleciona a data de início
      setStartDate(day.dateString);
      setEndDate(null); // Reseta a data de término ao selecionar uma nova data de início
      setSelectingEndDate(true); // Alterna para a seleção da data de término
    } else {
      // Seleciona a data de término
      setEndDate(day.dateString);
      setSelectingEndDate(false);
      setIsCalendarVisible(false);
    }
  }

  // Marca as datas selecionadas e o intervalo
  const markedDates = {};
  if (startDate) {
    markedDates[startDate] = {
      startingDay: true,
      color: GlobalStyles.colors.primary,
      textColor: GlobalStyles.colors.background,
    };
  }
  if (endDate) {
    markedDates[endDate] = {
      endingDay: true,
      color: GlobalStyles.colors.primary,
      textColor: GlobalStyles.colors.background,
    };

    // Marca o intervalo entre as datas
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split("T")[0];
      if (dateString !== startDate && dateString !== endDate) {
        markedDates[dateString] = {
          color: GlobalStyles.colors.primary,
          textColor: GlobalStyles.colors.background,
        };
      }
      currentDate.setDate(currentDate.getDate() + 1); // Incrementa o dia
    }
  }

  function handleAddAlert() {
    setEditingAlert(null); // Limpa o estado de edição
    setIsFormVisible(true); // Exibe o formulário para adicionar um novo alerta
  }

  function handleEditAlert(alert) {
    setEditingAlert(alert); // Define o alerta a ser editado
    setIsFormVisible(true); // Exibe o formulário para editar o alerta
  }

  function handleCalendarToggle() {
    console.log("Calendar toggled"); // Log para depuração
    setIsCalendarVisible((prev) => !prev); // Alterna a visibilidade do calendário
  }

  function formatDate(dateString) {
    const date = new Date(dateString); // Converte a string para um objeto Date
    return date.toLocaleDateString("pt-BR"); // Formata no estilo dd/MM/aaaa
  }

  function handleSubmitAlert(alertData) {
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
        alertData.preMeal
      );
      setAlerts((currentAlerts) => [...currentAlerts, newAlert]);
    }
    setIsFormVisible(false); // Fecha o formulário após adicionar ou editar o alerta
  }

  function handleNext() {
    if (alerts.length === 0) {
      ReactAlert.alert("Erro", "Por favor, adicione pelo menos um alerta.");
      return;
    }

    // Envia os dados do medicamento e os alertas para a próxima etapa
    onNext({ ...medicationData, alerts });
  }

  function renderAlertItem({ item }) {
    return (
      <AlertItem
        time={item.time}
        dose={item.dose}
        preMeal={item.preMeal}
        id={item.id}
        onPress={() => handleEditAlert(item)} // Passa o alerta para edição
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
              <IconButton
                title="Uso contínuo"
                icon="Check"
                color={GlobalStyles.colors.primary}
                onPress={handleCalendarToggle}
              />
              <Text style={styles.text}>Duração do tratamento</Text>
              <DoubleLabelBox
                title={"Data de início"}
                text={startDate ? formatDate(startDate) : ""}
              />
              <DoubleLabelBox
                title={"Data de término"}
                text={endDate ? formatDate(endDate) : ""}
              />
              <Text style={styles.text}>Dias da Semana</Text>
              <View style={styles.weekDaysButtonContainer}>
                <RoundButton size={40} color="white">
                  <Text style={styles.text}>D</Text>
                </RoundButton>
                <RoundButton size={40} color="white">
                  <Text style={styles.text}>S</Text>
                </RoundButton>
                <RoundButton size={40} color="white">
                  <Text style={styles.text}>T</Text>
                </RoundButton>
                <RoundButton size={40} color="white">
                  <Text style={styles.text}>Q</Text>
                </RoundButton>
                <RoundButton size={40} color="white">
                  <Text style={styles.text}>Q</Text>
                </RoundButton>
                <RoundButton size={40} color="white">
                  <Text style={styles.text}>S</Text>
                </RoundButton>
                <RoundButton size={40} color="white">
                  <Text style={styles.text}>S</Text>
                </RoundButton>
              </View>
            </View>
          }
          ListFooterComponent={
            <View style={styles.buttonContainer}>
              <IconButton
                icon={"PlusCircle"}
                title={"Novo alerta"}
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
          onPress={handleNext}
        />
      </View>
      <RangeCalendar
        isVisible={isCalendarVisible}
        onClose={handleCalendarToggle}
        onDayPress={handleDayPress} // Passa a função de seleção de data
        markedDates={markedDates}
      />

      <Modal visible={isFormVisible} animationType="slide">
        <AlertForm
          onCancel={() => setIsFormVisible(false)} // Fecha o formulário
          onSubmit={handleSubmitAlert} // Salva o alerta
          defaultValues={editingAlert} // Dados pré-carregados para edição
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
  weekDaysButtonContainer: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nextButtonContainer: {
    position: "absolute", // Posiciona o botão de forma fixa
    bottom: 80, // Distância da parte inferior da tela
    right: 20, // Distância da lateral direita
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semi-transparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: GlobalStyles.colors.card, // Fundo do conteúdo da modal
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
});
