import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import NavigationHeader from "../../components/NavigationHeader";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SuccesScreen from "../SuccesScreen";
import CreateAlerts from "./CreateAlerts";
import TreatmentResume from "./TreatmentResume";
import MedicationList from "./MedicationList";

function CreateTreatment() {
  const [step, setStep] = useState(1); // 1: Medication Form, 2: Alert Form
  const [isSuccess, setIsSuccess] = useState(false); // Para controlar o estado de sucesso
  const [treatmentData, setTreatmentData] = useState({
    medication: {
      id: "",
      name: "",
      amount: "",
      minAmount: "",
      form: "",
      unit: "",
    },
    alerts: [],
    treatmentPeriod: {
      startDate: null,
      endDate: null,
      isContinuous: false,
    },
  });

  const navigator = useNavigation(); // Hook para navegação

  function handleNextStep(data) {
    setTreatmentData((currentData) => ({ ...currentData, ...data })); // Atualiza os dados do medicamento ou alertas
    setStep((prevStep) => prevStep + 1); // Avança para o próximo passo
  }

  function handleBack() {
    setStep((prevStep) => Math.max(prevStep - 1, 1)); // Volta até o primeiro passo
  }

  function handleFinish() {
    setIsSuccess(true); // Define o estado de sucesso como verdadeiro
    setTimeout(() => {
      setIsSuccess(false);
      navigator.navigate("Treatment"); // Reseta o estado de sucesso após 2 segundos
    }, 2000);
  }

  function renderStep() {
    if (isSuccess) {
      return <SuccesScreen text={"Alertas adicionados com sucesso!"} />;
    }

    switch (step) {
      case 1:
        return (
          <MedicationList
            onNext={(selectedMedication) =>
              handleNextStep({ medication: selectedMedication })
            }
          />
        );
      case 2:
        return (
          <CreateAlerts
            onNext={(updatedData) => handleNextStep(updatedData)}
            treatmentData={treatmentData}
          />
        );
      case 3:
        return (
          <TreatmentResume
            onFinish={handleFinish}
            treatmentData={treatmentData}
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
