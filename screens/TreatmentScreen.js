import { Text, View, StyleSheet } from "react-native";
import TreatmentCard from "../components/TreatmentCard";
import { FlatList } from "react-native-gesture-handler";
import { useContext, useEffect, useState, useLayoutEffect } from "react";
import { AppContext } from "../store/app-context";
import { useNavigation } from "@react-navigation/native";

function TreatmentScreen() {
  const appContext = useContext(AppContext);

  const [treatmentList, setTreatmentList] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const treatmentIds = appContext.treatments.map((treatment) => treatment.id);
    setTreatmentList(treatmentIds);
  }, [appContext.treatments]);

  function RenderTreatmentCard({ item }) {
    function onPressEdit() {
      console.log("treatmentId", item);
      const treatment = appContext.treatments.find(
        (treatment) => treatment.id === item
      );
      const medication = appContext.medications.find(
        (medication) => medication.id === treatment.medicationId
      );
      const alerts = appContext.alerts.filter(
        (alert) => alert.treatmentId === item
      );
      navigation.navigate("CreateTreatment", {
        treatment: treatment,
        medication: medication,
        alerts: alerts,
      });
    }
    return <TreatmentCard treatmentId={item} onEdit={onPressEdit} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={treatmentList}
        renderItem={RenderTreatmentCard}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

export default TreatmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
});
