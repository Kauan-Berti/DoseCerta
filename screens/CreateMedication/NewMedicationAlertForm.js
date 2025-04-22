import { View, Text, StyleSheet, FlatList, ScrollView ,Modal} from "react-native";
import { GlobalStyles } from "../../constants/colors";
import AlertItem from "../../components/AlertItem";
import IconButton from "../../components/IconButton";
import Alert from "../../models/alert";
import { useState } from "react";
import AlertForm from "./AlertForm";

function NewMedicationAlertForm({ onNext, medicationData }) {
  const [alerts, setAlerts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);

  function handleAddAlert() {
    setEditingAlert(null); // Limpa o estado de edição
    setIsFormVisible(true); // Exibe o formulário para adicionar um novo alerta
  }

  function handleEditAlert(alert) {
    setEditingAlert(alert); // Define o alerta a ser editado
    setIsFormVisible(true); // Exibe o formulário para editar o alerta
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
      Alert.alert("Erro", "Por favor, adicione pelo menos um alerta.");
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
    <>
      <View style={styles.container}>
        <Text style={styles.text}>
          Vamos ajustar os horários e frequência da medicação.
        </Text>

        <View style={styles.contentContainer}>
          <FlatList
            data={alerts}
            renderItem={renderAlertItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainer}
            ListFooterComponent={
              <View style={styles.buttonContainer}>
                <IconButton
                  icon={"PlusCircle"}
                  title={"Adicionar alerta de medicação"}
                  color={GlobalStyles.colors.accent}
                  textColor="white"
                  onPress={handleAddAlert}
                />
              </View>
            }
          />
        </View>
      </View>
      <View style={styles.nextButtonContainer}>
        <IconButton
          title={"Seguir"}
          color={GlobalStyles.colors.primary}
          icon={"ArrowCircleRight"}
          onPress={handleNext}
        />
      </View>

      <Modal visible={isFormVisible} animationType="slide">
        <AlertForm
          onCancel={() => setIsFormVisible(false)} // Fecha o formulário
          onSubmit={handleSubmitAlert} // Salva o alerta
          defaultValues={editingAlert} // Dados pré-carregados para edição
        />
      </Modal>
    </>
  );
}

export default NewMedicationAlertForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 10,
    flex: 1,
    paddingBottom: 100,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 50,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  buttonContainer: {
    paddingVertical: 10,
  },
  nextButtonContainer: {
    position: "absolute", // Posiciona o botão de forma fixa
    bottom: 80, // Distância da parte inferior da tela
    right: 20, // Distância da lateral direita
  },
});
