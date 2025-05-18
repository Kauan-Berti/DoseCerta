import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalStyles } from "../../constants/colors";
import MedicationList from "./MedicationList";
import CreateAlerts from "./CreateAlerts";
import TreatmentResume from "./TreatmentResume";
import SuccesScreen from "../SuccesScreen";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-context";
import { useRoute } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

function MedicationListScreen({ navigation, route }) {
  const { treatment, medication, alerts } = route.params || {};

  return (
    <MedicationList
      treatment={treatment}
      medication={medication}
      alerts={alerts}
      onNext={(selectedMedication) =>
        navigation.navigate("CreateAlerts", {
          treatment,
          medication: selectedMedication,
          alerts,
        })
      }
    />
  );
}

function CreateAlertsScreen({ navigation, route }) {
  const { treatment, medication, alerts } = route.params || {};

  return (
    <CreateAlerts
      treatment={treatment}
      alerts={alerts}
      onNext={(updatedData) =>
        navigation.navigate("TreatmentResume", {
          treatment: updatedData.treatment,
          medication: medication,
          alerts: updatedData.alerts,
        })
      }
    />
  );
}

function TreatmentResumeScreen({ navigation, route }) {
  const { treatment, alerts, medication } = route.params;

  function handleFinish() {
    navigation.navigate("SuccesScreen");
  }

  return (
    <TreatmentResume
      onFinish={handleFinish}
      treatment={treatment}
      alerts={alerts}
      medication={medication}
    />
  );
}

function SuccesScreenWrapper({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "TreatmentScreen", params: { refresh: Date.now() } }],
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SuccesScreen
      text={"Tratamento salvo com sucesso!"}
      onFinish={() =>
        navigation.reset({
          index: 0,
          routes: [
            { name: "TreatmentScreen", params: { refresh: Date.now() } },
          ],
        })
      }
    />
  );
}

export default function CreateTreatment() {
  const route = useRoute();
  const { treatment, medication, alerts } = route.params || {};

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: GlobalStyles.colors.background },
      }}
    >
      <Stack.Screen
        name="MedicationList"
        component={MedicationListScreen}
        initialParams={{ treatment, medication, alerts }}
      />
      <Stack.Screen
        name="CreateAlerts"
        component={CreateAlertsScreen}
        initialParams={{
          treatment,
          medication,
          alerts,
        }}
      />
      <Stack.Screen
        name="TreatmentResume"
        component={TreatmentResumeScreen}
        initialParams={{
          treatment,
          medication,
          alerts,
        }}
      />
      <Stack.Screen name="SuccesScreen" component={SuccesScreenWrapper} />
    </Stack.Navigator>
  );
}
