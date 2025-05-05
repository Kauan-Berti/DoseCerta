import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import { GlobalStyles } from "../../constants/colors";
import IconButton from "../../components/IconButton";
import Medication from "../../models/medication";
import { Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

function MedicationForm({ onNext, initialValues }) {
  const [formData, setFormData] = useState(
    initialValues ||
      new Medication(
        0,
        "", // Nome do medicamento
        "", // Forma farmacêutica
        "", // Unidade de medida
        0, // Quantidade em estoque
        0 // Quantidade mínima
      ) // Usa os valores iniciais ou cria um novo medicamento
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

          <Text style={styles.label}>Forma farmacêutica</Text>
          <Picker
            selectedValue={formData.form}
            onValueChange={(itemValue) => handleInputChange("form", itemValue)}
            style={[styles.picker, styles.input]} // Aplica estilos consistentes
            dropdownIconColor={GlobalStyles.colors.text} // Cor do ícone de dropdown
            mode="dropdown"
          >
            <Picker.Item label="Selecione uma forma" value="" />
            <Picker.Item label="Comprimido" value="Comprimido" />
            <Picker.Item label="Pomada" value="Pomada" />
            <Picker.Item label="Xarope" value="Xarope" />
            <Picker.Item label="Injeção" value="Injeção" />
          </Picker>
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
              value: formData.amount?.toString() ?? "",
              onChangeText: (text) => handleInputChange("amount", text),
            }}
          />
          <Input
            label="Quantidade mínima"
            textInputConfig={{
              autoCapitalize: "sentences",
              autoCorrect: false,
              maxLength: 10,
              value: formData.minAmount?.toString() ?? "",
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
  label: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
    marginBottom: 8,
    fontWeight: "bold",
  },
  picker: {
    backgroundColor: GlobalStyles.colors.card, // Fundo consistente com o app
    borderRadius: 8, // Bordas arredondadas
    marginBottom: 16, // Espaçamento inferior
    borderWidth: 1, // Borda fina
    borderColor: GlobalStyles.colors.border, // Cor da borda
    color: GlobalStyles.colors.text, // Cor do texto
    paddingHorizontal: 10, // Espaçamento interno
    height: 50, // Altura consistente com os inputs
  },
  input: {
    fontSize: 16, // Tamanho do texto consistente
    color: GlobalStyles.colors.text, // Cor do texto
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.textSecondary,
    marginBottom: 4,
    fontWeight: "bold",
  },
});
