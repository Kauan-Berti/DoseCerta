import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import NavigationHeader from "../../components/NavigationHeader";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SuccesScreen from "../SuccesScreen";
import CreateAlerts from "./CreateAlerts";
import TreatmentResume from "./TreatmentResume";
import MedicationList from "./MedicationList";
import Treatment from "../../models/treatment";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";

function CreateTreatment() {
  const appContext = useContext(AppContext);
  const [step, setStep] = useState(1); // 1: Medication Form, 2: Alert Form
  const [isSuccess, setIsSuccess] = useState(false); // Para controlar o estado de sucesso
  const [treatment, setTreatment] = useState(
    new Treatment(
      Date.now().toString(), // ID único para o tratamento
      null, // ID do Medicamento selecionado
      null, // Data de início
      null, // Data de término
      false // Não contínuo por padrão
    )
  );
  const [alerts, setAlerts] = useState([]); // Gerencia os alertas separadamente

  const navigator = useNavigation(); // Hook para navegação

  function handleNextStep(updatedData) {
    switch (step) {
      case 1:
        setTreatment((prev) => ({
          ...prev,
          medication: updatedData.medication,
          medicationId: updatedData.medicationId,
        }));
        break;
      case 2:
        setAlerts(updatedData.alerts);
        setTreatment((prev) => ({
          ...prev,
          startDate: updatedData.treatment.startDate || prev.startDate,
          endDate: updatedData.treatment.endDate || prev.endDate,
          isContinuous: updatedData.treatment.isContinuous || prev.isContinuous,
        }));

        break;
      default:
        break;
    }

    setStep((prevStep) => prevStep + 1); // Avança para a próxima etapa
  }

  function handleBack() {
    setStep((prevStep) => Math.max(prevStep - 1, 1)); // Volta até o primeiro passo
  }

  async function handleFinish() {
    try {
      // Salva o tratamento no contexto
      appContext.addTreatment(treatment);

      // Salva os alertas no contexto com o treatmentId associado
      alerts.forEach((alert) => {
        appContext.addAlert({ ...alert, treatmentId: treatment.id });
      });

      setIsSuccess(true); // Define o estado de sucesso como verdadeiro
      setTimeout(() => {
        setIsSuccess(false);
        navigator.navigate("Treatment"); // Reseta o estado de sucesso após 2 segundos
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar tratamento ou alertas:", error);
    }
  }

  function renderStep() {
    if (isSuccess) {
      return <SuccesScreen text={"Tratamento criado com sucesso!"} />;
    }

    switch (step) {
      case 1:
        return (
          <MedicationList
            selectedMedication={treatment.medication}
            onNext={(selectedMedication) =>
              handleNextStep({
                medication: selectedMedication,
                medicationId: selectedMedication.id,
              })
            }
          />
        );
      case 2:
        return (
          <CreateAlerts
            onNext={(updatedData) =>
              handleNextStep({
                alerts: updatedData.alerts,
                treatment: updatedData.treatment,
              })
            }
            treatment={treatment}
            alerts={alerts}
          />
        );
      case 3:
        return (
          <TreatmentResume
            onFinish={handleFinish}
            treatment={treatment}
            alerts={alerts}
          />
        );
      default:
        return null;
    }
  }

  const titleMap = {
    1: "Escolha um medicamento",
    2: "Definir alertas",
    3: "Resumo",
  };

  return (
    <View style={styles.container}>
      <NavigationHeader
        title={titleMap[step] || ""}
        onBack={step > 1 ? handleBack : null} // Desabilita o botão de voltar no primeiro passo
      />
      {renderStep()}
    </View>
  );
}

export default CreateTreatment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingTop: 50,
    paddingHorizontal: 16,
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
  },
});
