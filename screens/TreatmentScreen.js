import { StyleSheet, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "../constants/colors";
import NavigationHeader from "../components/NavigationHeader";
import AlertCard from "../components/AlertCard";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../store/app-context";
import {
  fetchTreatments,
  fetchMedications,
  fetchAlerts,
} from "../util/supabase";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function TreatmentScreen() {
  const appContext = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayAlerts, setTodayAlerts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAlertsForDate(selectedDate);
  }, [selectedDate, appContext.alerts]);

  async function fetchData() {
    setIsFetching(true);
    try {
      const [medications, treatments, alerts] = await Promise.all([
        fetchMedications(),
        fetchTreatments(),
        fetchAlerts(),
      ]);

      // Limpa o contexto antes de adicionar novos itens
      appContext.medications.forEach((m) => appContext.deleteMedication(m.id));
      appContext.treatments.forEach((t) => appContext.deleteTreatment(t.id));
      appContext.alerts.forEach((a) => appContext.deleteAlert(a.id));

      // Adiciona os novos itens
      medications.forEach(appContext.addMedication);
      treatments.forEach(appContext.addTreatment);
      alerts.forEach(appContext.addAlert);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados.");
    } finally {
      setIsFetching(false);
    }
  }
  function filterAlertsForDate(date) {
    const dayOfWeek = date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .toUpperCase()
      .replace("Á", "A")
      .replace(".", "");

    const filteredAlerts = appContext.alerts.filter((alert) => {
      // Verifica se o alerta é para o dia da semana
      const dayMatch = alert.days
        ?.map((d) => d.toUpperCase())
        .includes(dayOfWeek);

      if (!dayMatch) return false;

      // Encontra o tratamento relacionado
      const treatment = appContext.treatments.find(
        (t) => t.id === alert.treatmentId
      );
      if (!treatment) return false;

      // Verifica se está no intervalo do tratamento
      const currentDate = date.getTime();
      const startDate = treatment.startDate
        ? new Date(treatment.startDate).getTime()
        : 0;
      const endDate = treatment.endDate
        ? new Date(treatment.endDate).getTime()
        : Infinity;

      return currentDate >= startDate && currentDate <= endDate;
    });

    setTodayAlerts(filteredAlerts);
  }

  function changeSelectedDate(days) {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  }

  function renderAlertCard({ item }) {
    const treatment = appContext.treatments.find(
      (t) => t.id === item.treatmentId
    );
    //console.log("Medication ID:", treatment?.medicationId);

    const medication = appContext.medications.find(
      (m) => m.id === treatment?.medicationId
    );
    //console.log("Medication:", medication);

    return (
      <AlertCard
        name={medication?.name || "Medicamento desconhecido"}
        time={item.time}
        dose={item.dose}
        preMeal={item.observations || "Sem observações"}
      />
    );
  }

  if (error) {
    return <ErrorOverlay message={error} onConfirm={() => setError(null)} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Alertas</Text>
      </View>
      <NavigationHeader
        title={selectedDate.toLocaleDateString("pt-BR")}
        onBack={() => changeSelectedDate(-1)}
        onNext={() => changeSelectedDate(1)}
      />
      {todayAlerts.length === 0 ? (
        <Text style={styles.text}>Nenhum alerta para hoje</Text>
      ) : (
        <FlatList
          data={todayAlerts}
          renderItem={renderAlertCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
        />
      )}
    </SafeAreaView>
  );
}

export default TreatmentScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 16,
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
    textAlign: "center",
    marginTop: 20,
  },
  contentContainer: {
    paddingBottom: 100,
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
});
