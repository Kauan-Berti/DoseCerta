import { StatusBar } from "expo-status-bar";
import AlertScreen from "./screens/AlertScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { useContext, useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "./constants/colors";
import {
  UserGear,
  CalendarDots,
  Hospital,
  Plus,
  Pill,
  Bell,
} from "phosphor-react-native";
import CustomTabBarButton from "./components/CustomTabBarButton";
import AppContextProvider from "./store/app-context";
import SignupScreen from "./screens/SignupScreen";
import { DefaultTheme, useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CreateMedication from "./screens/CreateMedication/CreateMedication";
import CreateTreatment from "./screens/CreateAlert/CreateTreatment";
import { refreshIdToken } from "./services/authService";
import MedicationScreen from "./screens/MedicationScreen";
import TreatmentScreen from "./screens/TreatmentScreen";
import { TouchableOpacity } from "react-native";
import JournalScreen from "./screens/JournalScreen";
import CreateDiary from "./screens/CreateDiary";
import CreateSensation from "./screens/CreateSensation";

SplashScreen.preventAutoHideAsync(); //Aplicar quando o login estiver pronto

const BottomTabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthenticatedStack() {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: GlobalStyles.colors.primary,
          height: 88,
        },
        tabBarStyle: {
          backgroundColor: GlobalStyles.colors.primary,
          borderTopWidth: 0,
          position: "absolute",
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarActiveTintColor: GlobalStyles.colors.card,
        tabBarInactiveTintColor: GlobalStyles.colors.background,
        tabBarShowLabel: false,
        headerRight: () => <ProfileHeaderButton />,
      }}
    >
      <BottomTabs.Screen
        name="Alerts"
        component={AlertScreen}
        options={{
          title: "Alertas",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => {
            return (
              <Bell color={color} size={size * 1.5} style={{ marginTop: 16 }} />
            );
          },
        }}
      />
      <BottomTabs.Screen
        name="Treatment"
        component={TreatmentStack}
        options={{
          title: "Tratamentos",
          headerTitle: "Tratamentos",
          tabBarIcon: ({ color, size }) => {
            return (
              <Hospital
                color={color}
                size={size * 1.5}
                style={{ marginTop: 16 }}
              />
            );
          },
        }}
      />
      <BottomTabs.Screen
        name="Add"
        component={AddStack}
        options={{
          headerShown: false, // <-- Adicione esta linha!
          tabBarIcon: ({ color, size }) => {
            return <Plus color={color} size={size * 2} />;
          },
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <BottomTabs.Screen
        name="Medications"
        component={MedicationStack}
        options={{
          title: "Medicamentos",
          tabBarIcon: ({ color, size }) => {
            return (
              <Pill color={color} size={size * 1.5} style={{ marginTop: 16 }} />
            );
          },
        }}
      />
      <BottomTabs.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: "Histórico",
          tabBarIcon: ({ color, size }) => {
            return (
              <CalendarDots
                color={color}
                size={size * 1.5}
                style={{ marginTop: 16 }}
              />
            );
          },
        }}
      />
    </BottomTabs.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: GlobalStyles.colors.background },
      }}
    >
      <Stack.Screen name="Tabs" component={AuthenticatedStack} />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: "Perfil",
          headerStyle: {
            backgroundColor: GlobalStyles.colors.primary,
            height: 80,
            borderBottomWidth: 0,
          },
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: GlobalStyles.colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function ProfileHeaderButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={() => navigation.navigate("ProfileScreen")}
    >
      <UserGear color={GlobalStyles.colors.card} size={28} />
    </TouchableOpacity>
  );
}

function AddStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: GlobalStyles.colors.primary,
          height: 88,
        },
        headerTintColor: GlobalStyles.colors.card, // cor do texto/ícone
        contentStyle: { backgroundColor: GlobalStyles.colors.background },
      }}
    >
      <Stack.Screen
        name="CreateMedication"
        component={CreateMedication}
        options={{ title: "Novo Medicamento" }}
      />
      <Stack.Screen
        name="CreateTreatment"
        component={CreateTreatment}
        options={{ title: "Novo Tratamento" }}
      />
      <Stack.Screen
        name="CreateDiary"
        component={CreateDiary}
        options={{ title: "Novo Diário" }}
      />
      <Stack.Screen
        name="CreateSensation"
        component={CreateSensation}
        options={{ title: "Nova Sensação" }}
      />
    </Stack.Navigator>
  );
}

function TreatmentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: GlobalStyles.colors.background },
      }}
    >
      <Stack.Screen name="TreatmentScreen" component={TreatmentScreen} />
      <Stack.Screen name="CreateTreatment" component={CreateTreatment} />
    </Stack.Navigator>
  );
}
function MedicationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: GlobalStyles.colors.background },
      }}
    >
      <Stack.Screen name="MedicationScreen" component={MedicationScreen} />
      <Stack.Screen name="CreateMedication" component={CreateMedication} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authContext = useContext(AuthContext);
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: GlobalStyles.colors.background,
        },
      }}
    >
      {!authContext.isAuthenticated && <AuthStack />}
      {authContext.isAuthenticated && <MainStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    async function fetchAuthToken() {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) {
          const newToken = await refreshIdToken(); // Renova o token ao iniciar
          authContext.authenticate(newToken);
        } else {
          // Se não houver token, você pode garantir que a autenticação seja tratada
          console.log("Nenhum token armazenado.");
        }
      } catch (error) {
        console.error("Erro ao buscar ou renovar o token:", error);
      } finally {
        setIsTryingLogin(false);
      }
    }
    fetchAuthToken();
  }, []);

  useEffect(() => {
    if (!isTryingLogin) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [isTryingLogin]);

  if (isTryingLogin) {
    return null;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: GlobalStyles.colors.background }}
      >
        <AuthContextProvider>
          <AppContextProvider>
            <Root />
          </AppContextProvider>
        </AuthContextProvider>
      </GestureHandlerRootView>
    </>
  );
}
