import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalStyles } from "../../constants/colors";
import MedicationList from "./MedicationList";
import CreateAlerts from "./CreateAlerts";
import TreatmentResume from "./TreatmentResume";
import SuccesScreen from "../SuccesScreen";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();

function MedicationListScreen({ navigation, route }) {
  const { treatment, medication, alerts, origin } = route.params || {};

  return (
    <MedicationList
      treatment={treatment}
      medication={medication}
      alerts={alerts}
      onNext={(selectedMedication) =>
        navigation.navigate("CreateAlerts", {
          treatment: treatment || {},
          medication: selectedMedication,
          alerts,
          origin,
        })
      }
    />
  );
}

function CreateAlertsScreen({ navigation, route }) {
  const { treatment, medication, alerts, origin } = route.params || {};

  return (
    <CreateAlerts
      treatment={treatment}
      alerts={alerts}
      onNext={(updatedData) =>
        navigation.navigate("TreatmentResume", {
          treatment: updatedData.treatment,
          medication: medication,
          alerts: updatedData.alerts,
          origin,
        })
      }
    />
  );
}

function TreatmentResumeScreen({ navigation, route }) {
  const { treatment, alerts, medication, origin } = route.params;

  function handleFinish() {
    navigation.navigate("SuccesScreen", { origin });
  }

  return (
    <TreatmentResume
      onFinish={handleFinish}
      treatment={treatment}
      alerts={alerts}
      medication={medication}
      origin={origin}
    />
  );
}

function SuccesScreenWrapper({ navigation, route }) {
  const origin = route.params?.origin;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (origin === "add") {
        // Volta para a aba de tratamentos
        navigation.getParent()?.navigate("Treatment");
      } else {
        // Volta para a tela de listagem de tratamentos
        navigation.getParent()?.navigate("TreatmentScreen");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation, origin]);

  return (
    <SuccesScreen
      text={"Tratamento salvo com sucesso!"}
      onFinish={() => {
        if (origin === "add") {
          navigation.getParent()?.navigate("Treatment");
        } else {
          navigation.getParent()?.navigate("TreatmentScreen");
        }
      }}
    />
  );
}

export default function CreateTreatment() {
  const route = useRoute();
  const { treatment, medication, alerts, origin = "add" } = route.params || {};

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
        initialParams={{ treatment, medication, alerts, origin }}
      />
      <Stack.Screen
        name="CreateAlerts"
        component={CreateAlertsScreen}
        initialParams={{
          treatment,
          medication,
          alerts,
          origin,
        }}
      />
      <Stack.Screen
        name="TreatmentResume"
        component={TreatmentResumeScreen}
        initialParams={{
          treatment,
          medication,
          alerts,
          origin,
        }}
      />
      <Stack.Screen name="SuccesScreen" component={SuccesScreenWrapper} />
    </Stack.Navigator>
  );
}
