import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import Input from "../../components/Input";
import { GlobalStyles } from "../../constants/colors";
import { useState } from "react";
import IconButton from "../../components/IconButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import DayOfWeek from "../../components/DayOfWeek";

function AlertForm({
  onCancel,
  onSubmit,
  defaultValues,
  treatmentId,
  onRemove,
}) {
  const [inputs, setInputs] = useState({
    time: { value: defaultValues?.time || "", isValid: true },
    dose: { value: defaultValues?.dose || "", isValid: true },
    observations: { value: defaultValues?.observations || "", isValid: true },
    days: { value: defaultValues?.days || [], isValid: true },
  });

  const [showTimePicker, setShowTimePicker] = useState(false);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => ({
      ...currentInputs,
      [inputIdentifier]: { value: enteredValue, isValid: true },
    }));
  }

  function handleTimeChange(event, selectedTime) {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      inputChangedHandler("time", formattedTime);
    }
  }

  function handleDaysChange(selectedDays) {
    setInputs((currentInputs) => ({
      ...currentInputs,
      days: { value: selectedDays, isValid: selectedDays.length > 0 },
    }));
  }

  function validateForm() {
    const timeIsValid = inputs.time.value.trim().length > 0;
    const doseIsValid = inputs.dose.value.trim().length > 0;
    const daysIsValid = inputs.days.value.length > 0;

    setInputs((currentInputs) => ({
      ...currentInputs,
      time: { value: currentInputs.time.value, isValid: timeIsValid },
      dose: { value: currentInputs.dose.value, isValid: doseIsValid },
      days: { value: currentInputs.days.value, isValid: daysIsValid },
    }));

    return timeIsValid && doseIsValid && daysIsValid;
  }

  function submitHandler() {
    if (!validateForm()) {
      return;
    }

    const alertData = {
      id: defaultValues?.id || `temp-${Date.now()}`, // Gera um ID temporário se não existir
      time: inputs.time.value,
      dose: inputs.dose.value,
      observations: inputs.observations.value,
      days: inputs.days.value,
      treatmentId, // Inclui o ID do tratamento associado
    };

    onSubmit(alertData);
  }

  function handleRemove() {
    if (defaultValues?.id) {
      onRemove(defaultValues.id);
    }
  }

  const formIsInvalid =
    !inputs.time.isValid || !inputs.dose.isValid || !inputs.days.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>
        {defaultValues?.id ? "Editar Alerta" : "Novo Alerta"}
      </Text>

      {/* Horário */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Horário</Text>
        <Pressable
          style={({ pressed }) => [
            styles.timePickerButton,
            pressed && styles.timePickerButtonPressed,
          ]}
          onPress={() => setShowTimePicker(true)}
          accessibilityLabel="Selecionar horário"
          accessibilityHint="Abre o seletor de horário"
        >
          <Text style={styles.timePickerButtonText}>
            {inputs.time.value || "Selecionar Horário"}
          </Text>
        </Pressable>

        {showTimePicker && (
          <DateTimePicker
            value={
              inputs.time.value
                ? new Date(`1970-01-01T${inputs.time.value}:00`)
                : new Date()
            }
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
      </View>

      {/* Dose */}
      <Input
        label="Dose"
        invalid={!inputs.dose.isValid}
        textInputConfig={{
          placeholder: "1",
          maxLength: 10,
          onChangeText: inputChangedHandler.bind(this, "dose"),
          value: inputs.dose.value,
        }}
        keyboardType="numeric"
      />

      {/* Dias da Semana */}
      <View style={styles.inputGroup}>
        <DayOfWeek
          style={styles.dayOfWeek}
          onDaysChange={handleDaysChange}
          defaultValues={inputs.days.value} // Passa os dias selecionados como defaultValues
        />
      </View>

      {/* Observações */}
      <Input
        label="Observações"
        textInputConfig={{
          multiline: true,
          placeholder: "Antes do café",
          onChangeText: inputChangedHandler.bind(this, "observations"),
          value: inputs.observations.value,
        }}
      />

      {/* Mensagem de Erro */}
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Por favor, preencha todos os campos obrigatórios.
        </Text>
      )}

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <IconButton
            onPress={onCancel}
            title="Cancelar"
            color={GlobalStyles.colors.primary}
            icon="XCircle"
          />
          <IconButton
            onPress={submitHandler}
            title="Salvar"
            color={GlobalStyles.colors.accent}
            icon="CheckCircle"
          />
        </View>
        {defaultValues?.id && (
          <IconButton
            onPress={handleRemove}
            title="Remover"
            color={GlobalStyles.colors.error}
            icon="Trash"
          />
        )}
      </View>
    </View>
  );
}

export default AlertForm;

const styles = StyleSheet.create({
  form: {
    padding: 24,
    backgroundColor: GlobalStyles.colors.background,
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    color: GlobalStyles.colors.text,
    fontWeight: "bold",
    marginVertical: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: GlobalStyles.colors.textSecondary,
    marginBottom: 8,
  },
  timePickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: GlobalStyles.colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  timePickerButtonPressed: {
    backgroundColor: GlobalStyles.colors.accent,
  },
  timePickerButtonText: {
    color: GlobalStyles.colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    gap: 16,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error,
    marginVertical: 8,
  },
  dayOfWeek: {
    height: 50,
    marginVertical: 8,
  },
});
