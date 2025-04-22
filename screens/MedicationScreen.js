import { View, StyleSheet } from "react-native";
import NewMedicationForm from "./CreateMedication/NewMedicationForm";
import NewMedicationAlertForm from "./CreateMedication/NewMedicationAlertForm";
import NewMedicationResume from "./CreateMedication/NewMedicationResume";
import { GlobalStyles } from "../constants/colors";
import NavigationHeader from "../components/NavigationHeader";
import { useEffect, useState } from "react";
import SuccesScreen from "./CreateMedication/SuccesScreen";
import { useNavigation } from "@react-navigation/native";
import Medication from "../models/medication";

function MedicationScreen() {
  const [step, setStep] = useState(1); // 1: Medication Form, 2: Alert Form
  const [isSuccess, setIsSuccess] = useState(false); // Para controlar o estado de sucesso

  const [medicationData, setMedicationData] = useState({
    id: "",
    name: "",
    amount: "",
    minAmount: "",
    form: "",
    unit: "",
    treatmentTime: "",
    treatmentStartDate: "",
    alerts: [],
  });

  const navigator = useNavigation(); // Hook para navegação

  function handleNextStep(data) {
    if (step === 1) {
      setMedicationData(data); // Salva os dados do medicamento
    } else if (step === 2) {
      setMedicationData((currentData) => ({ ...currentData, ...data })); // Adiciona os alertas
    }
    setStep((prevStep) => prevStep + 1); // Avança para o próximo passo
  }

  const handleNext = (data) => {
    setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : prevStep)); // Avança até o último step
  };
  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep)); // Volta até o primeiro step
  };

  function handleFinish() {
    setIsSuccess(true); // Define o estado de sucesso como verdadeiro
  }

  if (isSuccess) {
    setTimeout(() => {
      setIsSuccess(false);
      navigator.navigate("Treatment"); // Reseta o estado de sucesso após 2 segundos
    }, 2000);

    return <SuccesScreen text={"Medicamento adicionado com sucesso!"} />; // Renderiza a tela de sucesso
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <NewMedicationForm onNext={handleNextStep} />;
      case 2:
        return <NewMedicationAlertForm onNext={handleNextStep} medicationData={medicationData}/>;
      case 3:
        return <NewMedicationResume  onFinish={handleFinish} medicationData={medicationData} />;
      default:
        return <NewMedicationForm onNext={handleNextStep} />;
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return "Dados do medicamento";
      case 2:
        return "Ajustar Lembretes";
      case 3:
        return "Resumo do medicamento";
      default:
        return "Dados do medicamento";
    }
  };

  return (
    <View style={styles.container}>
      <NavigationHeader
        title={getTitle()}
        onNext={handleNext}
        onBack={handleBack}
      />
      {renderStep()}
    </View>
  );
}

export default MedicationScreen;

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
