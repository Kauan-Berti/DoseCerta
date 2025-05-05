import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import NavigationHeader from "../../components/NavigationHeader";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import SuccesScreen from "../SuccesScreen";
import CreateAlerts from "./CreateAlerts";
import TreatmentResume from "./TreatmentResume";
import MedicationList from "./MedicationList";
import Treatment from "../../models/treatment";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";

function CreateTreatment() {
  const appContext = useContext(AppContext);
  const route = useRoute();
  const navigator = useNavigation();

  const existingTreatment = route.params?.treatment || null;

  const [step, setStep] = useState(1); // 1: Medication Form, 2: Alert Form
  const [isSuccess, setIsSuccess] = useState(false); // Para controlar o estado de sucesso
  const [treatment, setTreatment] = useState(
    route.params?.treatment ||
      new Treatment(
        "temp-", // ID único para o tratamento
        null, // ID do Medicamento selecionado
        null, // Data de início
        null, // Data de término
        false // Não contínuo por padrão
      )
  );
  const [alerts, setAlerts] = useState(route.params?.alerts || []); // Alertas associados
  const [medication, setMedication] = useState(
    route.params?.medication || null
  );

  useState(() => {
    console.log("Medicamento :", medication);
  }, [medication]);

  function handleNextStep(updatedData) {
    switch (step) {
      case 1:
        setMedication(updatedData.medication);
        break;
      case 2:
        setAlerts(updatedData.alerts);
        setTreatment(updatedData.treatment);

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
      if (existingTreatment) {
        // Atualiza o tratamento existente
        appContext.updateTreatment(treatment.id, treatment);

        // Atualiza os alertas no contexto
        alerts.forEach((alert) => {
          if (alert.id.startsWith("temp-")) {
            appContext.addAlert({ ...alert, treatmentId: treatment.id });
          } else {
            appContext.updateAlert(alert.id, alert);
          }
        });
      } else {
        // Cria um novo tratamento
        appContext.addTreatment(treatment);

        // Salva os alertas no contexto com o treatmentId associado
        alerts.forEach((alert) => {
          appContext.addAlert({ ...alert, treatmentId: treatment.id });
        });
      }

      setIsSuccess(true); // Define o estado de sucesso como verdadeiro
      setTimeout(() => {
        setIsSuccess(false);
        if (existingTreatment) {
          navigator.navigate("TreatmentList", { refresh: true }); // Reseta o estado de sucesso após 2 segundos
        } else {
          navigator.navigate("Treatment", { refresh: true }); // Reseta o estado de sucesso após 2 segundos
        }
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar tratamento ou alertas:", error);
    }
  }

  function renderStep() {
    if (isSuccess) {
      return <SuccesScreen text={"Tratamento salvo com sucesso!"} />;
    }

    switch (step) {
      case 1:
        return (
          <MedicationList
            medicationId={treatment.medicationId}
            onNext={(selectedMedication) =>
              handleNextStep({
                medication: selectedMedication,
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
            medication={medication}
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
