import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import AlertItem from "../../components/AlertItem";
import IconButton from "../../components/IconButton";

function NewMedicationAlertForm() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Vamos ajustar os horários e frequência da medicação.
      </Text>

      <View style={styles.contentContainer}>
        <FlatList
          data={[
            { id: "1" },
            { id: "2" },
            { id: "3" },
            { id: "4" },
            { id: "5" },
          ]}
          renderItem={({ item }) => <AlertItem />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          ListFooterComponent={
            <View style={styles.buttonContainer}>
              <IconButton
                icon={"PlusCircle"}
                title={"Adicionar alerta de medicação"}
                color={GlobalStyles.colors.accent}
                textColor="white"
              />
            </View>
          }
        />
      </View>
    </View>
  );
}

export default NewMedicationAlertForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 10,
    flex: 1,
    paddingBottom: 100,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 50,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  buttonContainer: {
    paddingVertical: 10,
  },
});
