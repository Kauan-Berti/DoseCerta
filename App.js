import { StatusBar } from "expo-status-bar";
import Treatment from "./screens/Treatment";
import LoginScreen from "./screens/LoginScreen";
import CreateUserScreen from "./screens/CreateUserScreen";
import Config from "./screens/Config";
import Journal from "./screens/Journal";
import Stock from "./screens/Stock";
import CreateJournalEntry from "./screens/CreateJournalEntry";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { useContext, useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync(); //Aplicar quando o login estiver pronto

const BottomTabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthenticatedStack() {
  return (
    <BottomTabs.Navigator screenOptions={{ headerShown: false }}>
      <BottomTabs.Screen
        name="Treatment"
        component={Treatment}
        options={{ title: "Tratamento" }}
      />
      <BottomTabs.Screen
        name="Journal"
        component={Journal}
        options={{ title: "Histórico" }}
      />
      <BottomTabs.Screen
        name="CreateJournalEntry"
        component={CreateJournalEntry}
        options={{ title: "Novo Registro" }}
      />
      <BottomTabs.Screen
        name="Stock"
        component={Stock}
        options={{ title: "Estoque" }}
      />
      <BottomTabs.Screen
        name="Config"
        component={Config}
        options={{ title: "Mais" }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateUser" component={CreateUserScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authContext = useContext(AuthContext);

  return (
    <NavigationContainer>
      {
        /* {!authContext.isAuthenticated && <AuthStack />}
      {authContext.isAuthenticated && <AuthenticatedStack />} */
        <AuthenticatedStack /> //TODO: Descomentar a linha acima e comentar esta linha para usar a autenticação
      }
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
          authContext.authenticate(storedToken);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
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
      <StatusBar style="dark" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
