import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import NavigationHeader from "../../components/NavigationHeader";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MedicationForm from "./MedicationForm";
import MedicationResume from "./MedicationResume";
import SuccesScreen from "../SuccesScreen";

function CreateMedication({ route }) {
  const [step, setStep] = useState(1); // 1: Medication Form, 2: Alert Form
  const [isSuccess, setIsSuccess] = useState(false); // Para controlar o estado de sucesso

  const existingMedication = route?.params?.medication || null; // Dados do medicamento existente

  const [medicationData, setMedicationData] = useState(
    existingMedication || {
      id: "",
      name: "",
      amount: "",
      minAmount: "",
      form: "",
      unit: "",
    }
  );

  const navigator = useNavigation(); // Hook para navegação

  function handleNextStep(data) {
    setMedicationData((currentData) => ({ ...currentData, ...data })); // Atualiza os dados do medicamento
    setStep((prevStep) => prevStep + 1); // Avança para o próximo passo
  }

  function handleBack() {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep)); // Volta para o passo anterior
  }

  function handleFinish() {
    setStep(1); // Reseta o passo para 1
    setIsSuccess(true); // Define o estado de sucesso como verdadeiro
  }

  if (isSuccess) {
    setTimeout(() => {
      setIsSuccess(false);
      navigator.popToTop(); // Reseta o estado de sucesso após 2 segundos
    }, 2000);

    return <SuccesScreen text={"Medicamento salvo com sucesso!"} />; // Renderiza a tela de sucesso
  }
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <MedicationForm
            onNext={handleNextStep}
            initialValues={medicationData} // Passa os valores iniciais para edição
          />
        );
      case 2:
        return (
          <MedicationResume
            onFinish={handleFinish}
            medicationData={medicationData} // Passa os dados para o resumo
          />
        );
      default:
        return null;
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
        onBack={step > 1 ? handleBack : null} // Habilita o botão de voltar apenas no segundo passo
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
