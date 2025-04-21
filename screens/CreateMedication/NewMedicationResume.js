import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import DoubleLabelBox from "../../components/DoubleLabelBox";
import SquareIconButton from "../../components/SquareIconButton";
import Input from "../../components/Input";
import IconButton from "../../components/IconButton";

function NewMedicationResume({ onFinish }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/custom/image 1.png")}
        />
      </View>

      <Text style={styles.title}>Paracetamol 500mg</Text>
      <View style={styles.contentContainer}>
        <View style={styles.squareButtonsContainer}>
          <SquareIconButton
            icon={"SunHorizon"}
            color={GlobalStyles.colors.card}
            textColor="white"
            title={"08:00"}
            size={100}
          />
          <SquareIconButton
            icon={"Pill"}
            color={GlobalStyles.colors.card}
            textColor="white"
            title={"1 Pílula"}
            size={100}
          />
          <SquareIconButton
            icon={"ForkKnife"}
            color={GlobalStyles.colors.card}
            textColor="white"
            title={"Pré-refeição"}
            size={100}
          />
        </View>
        <DoubleLabelBox title={"Periodicidade"} text={"Duas vezes ao dia"} />
        <DoubleLabelBox title={"Duração do tratamento"} text={"7 dias"} />
        <DoubleLabelBox title={"Quantidade em estoque"} text={"10"} />
        <DoubleLabelBox title={"Alarme"} text={"5"} />
        <Input
          label={"Anotação rápida"}
          textInputConfig={{ multiline: true }}
        />
        <View style={styles.saveButtonContainer}>
          <IconButton
            color={GlobalStyles.colors.accent}
            textColor="white"
            icon="CheckCircle"
            title="Salvar"
            fullWidth={true}
            onPress={onFinish}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default NewMedicationResume;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 10,
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.border,
    height: 150,
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
    textAlign: "center",
  },
  squareButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 200,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  saveButtonContainer: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
