import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import NavigationHeader from "../../components/NavigationHeader";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import SuccesScreen from "../SuccesScreen";
import CreateAlerts from "./CreateAlerts";
import TreatmentResume from "./TreatmentResume";
import MedicationList from "./MedicationList";

function CreateTreatment() {
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

    return <SuccesScreen text={"Alertas adicionados com sucesso!"} />; // Renderiza a tela de sucesso
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <MedicationList onNext={handleNextStep} />;
      case 2:
        return <CreateAlerts onNext={handleNextStep} />;
      case 3:
        return <TreatmentResume text={"Alertas adicionados com sucesso!"} />;
      default:
        return;
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return "Escolha um medicamento";
      case 2:
        return "Definir alertas";
      case 3:
        return "Resumo";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <NavigationHeader
        title={getTitle()}
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
