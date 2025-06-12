import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import Input from "../../components/Input";
import IconButton from "../../components/IconButton";
import Medication from "../../models/medication";
import { GlobalStyles } from "../../constants/colors";
import {
  Pill,
  Syringe,
  Drop,
  TestTube,
  PlusCircle,
  ArchiveBox,
  WarningCircle,
  ArrowCircleRight,
  ListMagnifyingGlass,
} from "phosphor-react-native";

const FORMS = [
  {
    label: "Comprimido",
    value: "Comprimido",
    icon: <Pill size={20} color={GlobalStyles.colors.primary} />,
  },
  {
    label: "Pomada",
    value: "Pomada",
    icon: <Drop size={20} color={GlobalStyles.colors.primary} />,
  },
  {
    label: "Xarope",
    value: "Xarope",
    icon: <TestTube size={20} color={GlobalStyles.colors.primary} />,
  },
  {
    label: "Injeção",
    value: "Injeção",
    icon: <Syringe size={20} color={GlobalStyles.colors.primary} />,
  },
  {
    label: "Outro",
    value: "Outro",
    icon: <PlusCircle size={20} color={GlobalStyles.colors.primary} />,
  },
];

const UNIT_BY_FORM = {
  Comprimido: "mg",
  Pomada: "g",
  Xarope: "ml",
  Injeção: "ml",
};

function MedicationForm({ onNext, initialValues }) {
  const [formData, setFormData] = useState(
    initialValues || new Medication(0, "", "", "", 0, 0)
  );
  const [showFormModal, setShowFormModal] = useState(false);

  function handleInputChange(inputIdentifier, enteredValue) {
    setFormData((currentData) => ({
      ...currentData,
      [inputIdentifier]: enteredValue,
    }));
  }

  function handleFormSelect(formValue) {
    setShowFormModal(false);
    let unit = UNIT_BY_FORM[formValue] || "";
    setFormData((currentData) => ({
      ...currentData,
      form: formValue,
      unit: formValue === "Outro" ? "" : unit,
    }));
  }

  function handleNext() {
    const { name, form, unit, amount, minAmount } = formData;
    if (!name || !form || !unit || !amount || !minAmount) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    onNext(formData);
  }

  const isUnitEditable = formData.form === "Outro" || !formData.form;

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
          <TouchableOpacity
            style={styles.formSelector}
            onPress={() => setShowFormModal(true)}
          >
            {FORMS.find((f) => f.value === formData.form)?.icon || (
              <ListMagnifyingGlass
                size={20}
                color={GlobalStyles.colors.primary}
              />
            )}
            <Text style={styles.formSelectorText}>
              {formData.form
                ? FORMS.find((f) => f.value === formData.form)?.label
                : "Selecione uma forma"}
            </Text>
          </TouchableOpacity>
          {/* Modal de seleção de forma farmacêutica */}
          <Modal
            visible={showFormModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowFormModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Escolha a forma farmacêutica
                </Text>
                {FORMS.map((form) => (
                  <TouchableOpacity
                    key={form.value}
                    style={styles.modalOption}
                    onPress={() => handleFormSelect(form.value)}
                  >
                    {form.icon}
                    <Text style={styles.modalOptionText}>{form.label}</Text>
                  </TouchableOpacity>
                ))}
                <IconButton
                  title="Cancelar"
                  color={GlobalStyles.colors.background}
                  textColor={GlobalStyles.colors.primary}
                  icon="X"
                  onPress={() => setShowFormModal(false)}
                  style={styles.modalCancelButton}
                />
              </View>
            </View>
          </Modal>
          <Input
            label="Un. de medida"
            textInputConfig={{
              placeholder: "(ml, mg, etc..)",
              autoCapitalize: "sentences",
              autoCorrect: false,
              maxLength: 10,
              value: formData.unit,
              onChangeText: (text) => handleInputChange("unit", text),
              editable: isUnitEditable,
            }}
          />
          <Input
            label="Quantidade em estoque"
            textInputConfig={{
              keyboardType: "numeric",
              maxLength: 10,
              value: formData.amount?.toString() ?? "",
              onChangeText: (text) => handleInputChange("amount", text),
            }}
          />
          <Input
            label="Quantidade mínima"
            textInputConfig={{
              keyboardType: "numeric",
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
          icon="ArrowCircleRight"
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
    paddingBottom: 100,
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: GlobalStyles.colors.text,
    marginBottom: 8,
    fontWeight: "bold",
    marginTop: 8,
  },
  formSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.border,
    padding: 12,
    marginBottom: 16,
    marginTop: 2,
  },
  formSelectorText: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "stretch",
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary,
    marginBottom: 18,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: GlobalStyles.colors.text,
  },
  modalCancelButton: {
    marginTop: 18,
    alignSelf: "center",
  },
  nextButtonContainer: {
    marginTop: 12,
    marginBottom: 40, // espaço para a bottom tab
    alignItems: "flex-end",
    paddingRight: 8,
    backgroundColor: "transparent",
    borderWidth: 0,
    alignSelf: "flex-end", // <-- Adicione esta linha
  },
});
