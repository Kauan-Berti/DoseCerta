import { View, StyleSheet, Text, ScrollView } from "react-native";
import Input from "../../components/Input";
import { GlobalStyles } from "../../constants/colors";
import IconButton from "../../components/IconButton";

function NewMedicationForm() {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.text}>
          Vamos adicionar as informações da sua medicação
        </Text>
        <Input
          label="Nome do Medicamento"
          textInputConfig={{
            placeholder: "Digite o nome do medicamento",
            autoCapitalize: "sentences",
            autoCorrect: false,
            maxLength: 50,
          }}
        />
        <Input
          label="Forma farmacêutica"
          textInputConfig={{
            placeholder: "(Comprimido, pomada, etc..)",
            autoCapitalize: "sentences",
            autoCorrect: false,
            maxLength: 30,
          }}
        />
        <Input
          label="Un. de medida"
          textInputConfig={{
            placeholder: "(ml, mg, etc..)",
            autoCapitalize: "sentences",
            autoCorrect: false,
            maxLength: 10,
          }}
        />
        <Input
          label="Quantidade em estoque"
          textInputConfig={{
            autoCapitalize: "sentences",
            autoCorrect: false,
            maxLength: 10,
          }}
        />
        <Input
          label="Quantidade mínima"
          textInputConfig={{
            autoCapitalize: "sentences",
            autoCorrect: false,
            maxLength: 10,
          }}
        />

        <Input
          label="Duração do tratamento"
          textInputConfig={{
            autoCapitalize: "sentences",
            autoCorrect: false,
            maxLength: 10,
          }}
        />
      </View>
    </ScrollView>
  );
}

export default NewMedicationForm;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
  },
  container: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
    paddingTop: 10,
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
});
