import { View, Text, StyleSheet } from "react-native";
import Input from "../../components/Input";
import { GlobalStyles } from "../../constants/colors";
import { useState } from "react";
import IconButton from "../../components/IconButton";

function AlertForm({ onCancel, onSubmit, defaultValues, isEditing }) {
  const [inputs, setInputs] = useState({
    time: { value: defaultValues ? defaultValues.time : "", isValid: true },
    dose: { value: defaultValues ? defaultValues.dose : "", isValid: true },
    preMeal: {
      value: defaultValues ? defaultValues.preMeal : "",
      isValid: true,
    },
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });

  }

  function submitHandler() {
    const alertData = {
      time: inputs.time.value,
      dose: inputs.dose.value,
      preMeal: inputs.preMeal.value,
    };

    const timeIsValid = alertData.time.trim().length > 0;
    const doseIsValid = alertData.dose.trim().length > 0;
    const preMealIsValid = alertData.preMeal.trim().length > 0;

    if (!timeIsValid || !doseIsValid || !preMealIsValid) {
      setInputs((currentInputs) => {
        return {
          time: { value: currentInputs.time.value, isValid: timeIsValid },
          dose: { value: currentInputs.dose.value, isValid: doseIsValid },
          preMeal: {
            value: currentInputs.preMeal.value,
            isValid: preMealIsValid,
          },
        };
      });
      return;
    }
    onSubmit(alertData); // Envia os dados do alerta para o próximo passo
  }

  const formIsInvalid =
    !inputs.time.isValid || !inputs.dose.isValid || !inputs.preMeal.isValid;

  return (
    <View style={styles.form}>
      <View>
        <Text style={styles.title}>
          {isEditing ? "Novo Alerta" : "Editar Alerta"}
        </Text>
        <Input
          label={"Horário"}
          invalid={!inputs.time.isValid}
          textInputConfig={{
            onChangeText: inputChangedHandler.bind(this, "time"),
            value: inputs.time.value,
            placeholder: "08:00",
          }}
        />
        <Input
          label={"Dose"}
          invalid={!inputs.dose.isValid}
          textInputConfig={{
            placeholder: "1",
            maxLength: 10,
            onChangeText: inputChangedHandler.bind(this, "dose"),
            value: inputs.dose.value,
          }}
        />

        <Input
          label={"Pré-refeição"}
          invalid={!inputs.preMeal.isValid}
          textInputConfig={{
            multiline: true,
            placeholder: "Antes do café",
            onChangeText: inputChangedHandler.bind(this, "preMeal"),
            value: inputs.preMeal.value,
          }}
        />
        {formIsInvalid ? (
          <Text style={styles.errorText}> Invalid input values </Text>
        ) : null}
      </View>
      <View style={styles.buttonsContainer}>
        <IconButton
          onPress={onCancel}
          title={"Cancelar"}
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
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 24,
    textAlign: "center",
  },
  input: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 6,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  text: {
    color: GlobalStyles.colors.text,
    fontSize: 24,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error,
    margin: 8,
  },
});
