import { StatusBar } from "expo-status-bar";
import TreatmentScreen from "./screens/TreatmentScreen";
import LoginScreen from "./screens/LoginScreen";
import Config from "./screens/Config";
import Journal from "./screens/Journal";
import Stock from "./screens/Stock";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { useContext, useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "./constants/colors";
import {
  CalendarDots,
  DotsThreeCircle,
  Hospital,
  Plus,
  Pill,
} from "phosphor-react-native";
import CustomTabBarButton from "./components/CustomTabBarButton";
import AppContextProvider from "./store/app-context";
import SignupScreen from "./screens/SignupScreen";
import { DefaultTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CreateMedication from "./screens/CreateMedication/CreateMedication";
import CreateTreatment from "./screens/CreateAlert/CreateTreatment";
import CreateJournal from "./screens/CreateJournal/CreateJournal";
import { refreshIdToken } from "./util/auth";
import MedicationScreen from "./screens/MedicationScreen";

SplashScreen.preventAutoHideAsync(); //Aplicar quando o login estiver pronto

const BottomTabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthenticatedStack() {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: GlobalStyles.colors.primary,
          borderTopWidth: 0,
          position: "absolute",
          height: 60,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: GlobalStyles.colors.card,
        tabBarInactiveTintColor: GlobalStyles.colors.background,
      }}
    >
      <BottomTabs.Screen
        name="Treatment"
        component={TreatmentScreen}
        options={{
          title: "Alertas",
          tabBarIcon: ({ color, size }) => {
            return <Pill color={color} size={size} />;
          },
        }}
      />
      <BottomTabs.Screen
        name="Journal"
        component={Journal}
        options={{
          title: "Histórico",
          tabBarIcon: ({ color, size }) => {
            return <CalendarDots color={color} size={size} />;
          },
        }}
      />
      <BottomTabs.Screen
        name="Add"
        component={AddStack}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Plus color={color} size={size * 1.5} />;
          },
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarLabel: () => null,
        }}
      />
      <BottomTabs.Screen
        name="Medications"
        component={MedicationScreen}
        options={{
          title: "Medicamentos",
          tabBarIcon: ({ color, size }) => {
            return <Hospital color={color} size={size} />;
          },
        }}
      />
      <BottomTabs.Screen
        name="Config"
        component={Config}
        options={{
          title: "Mais",
          tabBarIcon: ({ color, size }) => {
            return <DotsThreeCircle color={color} size={size} />;
          },
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: GlobalStyles.colors.background },
        animation: "default",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AddStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: GlobalStyles.colors.background },
        animation: "default",
      }}
    >
      <Stack.Screen name="CreateJournal" component={CreateJournal} />
      <Stack.Screen name="CreateMedication" component={CreateMedication} />
      <Stack.Screen name="CreateTreatment" component={CreateTreatment} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authContext = useContext(AuthContext);
  return (
    <NavigationContainer
      screenOptions={{ detachPreviousScreen: false }}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: GlobalStyles.colors.background,
        },
      }}
    >
      {!authContext.isAuthenticated && <AuthStack />}
      {authContext.isAuthenticated && <AuthenticatedStack />}
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
    async function hideSplash() {
      if (!isTryingLogin) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [isTryingLogin]);

  if (isTryingLogin) {
    return null;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
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
