import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import NavigationHeader from "../../components/NavigationHeader";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MedicationForm from "./MedicationForm";
import MedicationResume from "./MedicationResume";
import SuccesScreen from "../SuccesScreen";

function CreateMedication() {
  const [step, setStep] = useState(1); // 1: Medication Form, 2: Alert Form
  const [isSuccess, setIsSuccess] = useState(false); // Para controlar o estado de sucesso

  const [medicationData, setMedicationData] = useState({
    id: "",
    name: "",
    amount: "",
    minAmount: "",
    form: "",
    unit: "",
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
        return <MedicationForm onNext={handleNextStep} />;
      case 2:
        return (
          <MedicationResume
            onFinish={handleFinish}
            medicationData={medicationData}
          />
        );
      default:
        return;
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return "Dados do medicamento";
      case 2:
        return "Resumo";
      default:
        return "";
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

export default CreateMedication;

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
