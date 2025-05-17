import { View, StyleSheet, Text, FlatList } from "react-native";
import { GlobalStyles } from "../constants/colors";
import { useState, useContext } from "react";
import { AppContext } from "../store/app-context";
import { fetchMedications } from "../util/supabase";
import { useEffect } from "react";
import { Alert } from "react-native";
import MedicationCard from "../components/MedicationCart";
import { useNavigation } from "@react-navigation/native";

function MedicationScreen() {
  const appContext = useContext(AppContext);
  const navigation = useNavigation();
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (appContext.medications.length > 0) {
      return;
    }

    async function fetchMedicationsFromAPI() {
      setIsFetching(true);
      try {
        const medications = await fetchMedications();
        medications.forEach((medication) => {
          appContext.addMedication(medication);
        });
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar os medicamentos.");
      } finally {
        setIsFetching(false);
      }
    }

    fetchMedicationsFromAPI();
  }, [appContext]);

  function handleEdit(medication) {
    navigation.navigate("CreateMedication", { medication });
  }

  function renderMedicationItem({ item }) {
    return <MedicationCard onPress={handleEdit} item={item} />;
  }

  function handleSearch() {
    console.log("Buscando por:", searchQuery);
    // Adicione a lógica de busca aqui
  }

  return (
    <View style={styles.container}>
      {isFetching && (
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Carregando medicamentos...</Text>
        </View>
      )}
      {!isFetching && appContext.medications.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Nenhum medicamento encontrado.</Text>
        </View>
      )}
      {!isFetching && appContext.medications.length > 0 && (
        <>
          <View style={styles.container}>
            <FlatList
              data={appContext.medications}
              keyExtractor={(item) => item.id}
              renderItem={renderMedicationItem}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}
    </View>
  );
}

export default MedicationScreen;
const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 40,
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 18,
    color: GlobalStyles.colors.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
    marginBottom: 16,
  },
  titleContainer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1, // Faz o input ocupar o máximo de espaço possível
    marginRight: 8, // Adiciona espaçamento entre o input e o botão
  },
  searchButton: {
    padding: 8, // Adiciona um pouco de padding ao botão
  },
  contentContainer: {
    paddingBottom: 50,
  },
});
