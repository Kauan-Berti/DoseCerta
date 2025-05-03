import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import Input from "../../components/Input";
import { useState } from "react";
import { GlobalStyles } from "../../constants/colors";
import IconButton from "../../components/IconButton";
import Medication from "../../models/medication";
import { Platform } from "react-native";

function MedicationForm({ onNext, initialValues }) {
  const [formData, setFormData] = useState(
    initialValues || new Medication() // Usa os valores iniciais ou cria um novo medicamento
  );

  function handleInputChange(inputIdentifier, enteredValue) {
    setFormData((currentData) => ({
      ...currentData,
      [inputIdentifier]: enteredValue,
    }));
  }

  function handleNext() {
    // Validação simples
    const { name, form, unit, amount, minAmount } = formData;
    if (!name || !form || !unit || !amount || !minAmount) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Avança para a próxima etapa
    onNext(formData);
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.text}>
            {initialValues.id != 0
              ? "Editar Medicamento"
              : "Adicionar Medicamento"}
          </Text>
          <Input
            label="Nome do Medicamento"
            textInputConfig={{
              placeholder: "Digite o nome do medicamento",
              autoCapitalize: "sentences",
              autoCorrect: false,
              maxLength: 50,
              value: formData.name,
              onChangeText: (text) => handleInputChange("name", text),
            }}
          />
          <Input
            label="Forma farmacêutica"
            textInputConfig={{
              placeholder: "(Comprimido, pomada, etc..)",
              autoCapitalize: "sentences",
              autoCorrect: false,
              maxLength: 30,
              value: formData.form,
              onChangeText: (text) => handleInputChange("form", text),
            }}
          />
          <Input
            label="Un. de medida"
            textInputConfig={{
              placeholder: "(ml, mg, etc..)",
              autoCapitalize: "sentences",
              autoCorrect: false,
              maxLength: 10,
              value: formData.unit,
              onChangeText: (text) => handleInputChange("unit", text),
            }}
          />
          <Input
            label="Quantidade em estoque"
            textInputConfig={{
              autoCapitalize: "sentences",
              autoCorrect: false,
              maxLength: 10,
              value: formData.amount,
              onChangeText: (text) => handleInputChange("amount", text),
            }}
          />
          <Input
            label="Quantidade mínima"
            textInputConfig={{
              autoCapitalize: "sentences",
              autoCorrect: false,
              maxLength: 10,
              value: formData.minAmount,
              onChangeText: (text) => handleInputChange("minAmount", text),
            }}
          />
        </View>
      </ScrollView>
      <View style={styles.nextButtonContainer}>
        <IconButton
          title={"Próximo"}
          color={GlobalStyles.colors.primary}
          icon={"ArrowCircleRight"}
          onPress={handleNext}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

export default MedicationForm;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
    paddingBottom: 60,
  },
  container: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
    paddingTop: 10,
    paddingBottom: 150,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
  },
  inputsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    maxWidth: "100%",
  },
  nextButtonContainer: {
    position: "absolute", // Posiciona o botão de forma fixa
    bottom: 80, // Distância da parte inferior da tela
    right: 20, // Distância da lateral direita
  },
});
