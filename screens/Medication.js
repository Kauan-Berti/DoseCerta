import { View, StyleSheet } from "react-native";
import NewMedicationForm from "./CreateMedication/NewMedicationForm";
import NewMedicationAlertForm from "./CreateMedication/NewMedicationAlertForm";
import NewMedicationResume from "./CreateMedication/NewMedicationResume";
import { GlobalStyles } from "../constants/colors";
import NavigationHeader from "../components/NavigationHeader";
import { useState } from "react";
import IconButton from "../components/IconButton";
import SuccesScreen from "./CreateMedication/SuccesScreen";
import { useNavigation } from "@react-navigation/native";

function Medication() {
  const [step, setStep] = useState(1); // 1: Medication Form, 2: Alert Form
  const [isSuccess, setIsSuccess] = useState(false); // Para controlar o estado de sucesso
  const navigator = useNavigation(); // Hook para navegação
  const handleNext = () => {
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
        return <NewMedicationForm />;
      case 2:
        return <NewMedicationAlertForm />;
      case 3:
        return <NewMedicationResume onFinish={handleFinish} />;
      default:
        return <NewMedicationForm />;
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

      {step < 3 ? (
        <View style={styles.buttonContainer}>
          <IconButton
            title={"Seguir"}
            color={GlobalStyles.colors.primary}
            icon={"ArrowCircleRight"}
            onPress={handleNext}
          />
        </View>
      ) : null}
    </View>
  );
}

export default Medication;

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

  buttonContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
});
