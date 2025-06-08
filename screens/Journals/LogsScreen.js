import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import MedicationLogCard from "../../components/MedicationLogCard";
import { fetchMedicationLogsInRange } from "../../services/medicationLogService";
import { fetchTreatments } from "../../services/treatmentService";
import { fetchMedications } from "../../services/medicationService";
import { fetchAlerts } from "../../services/alertService";

function LogsScreen({ selectedTab }) {
  const [isFetching, setIsFetching] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [medicationLogs, setMedicationLogs] = useState([]);

  // Buscar tratamentos ao montar
  useEffect(() => {
    if (selectedTab !== "treatments") return;
    async function fetchTreatmentsFromAPI() {
      try {
        setIsFetching(true);
        const treatmentsData = await fetchTreatments();
        setTreatments(treatmentsData);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os tratamentos.");
      } finally {
        setIsFetching(false);
      }
    }
    fetchTreatmentsFromAPI();
  }, [selectedTab]);

  // Buscar medicamentos quando tratamentos carregarem
  useEffect(() => {
    if (treatments.length === 0) return;
    async function fetchMedicationsFromAPI() {
      try {
        setIsFetching(true);
        const medicationsData = await fetchMedications();
        setMedications(
          medicationsData.map((m) => ({
            id: m.id,
            name: m.name,
          }))
        );
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os medicamentos.");
      } finally {
        setIsFetching(false);
      }
    }
    fetchMedicationsFromAPI();
  }, [treatments]);

  // Buscar medicamentos quando tratamentos carregarem
  useEffect(() => {
    if (medications.length === 0) return;
    async function fetchAlertsFromAPI() {
      try {
        setIsFetching(true);
        const alertsData = await fetchAlerts();
        setAlerts(alertsData);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os alertas.");
      } finally {
        setIsFetching(false);
      }
    }
    fetchAlertsFromAPI();
  }, [medications]);

  // Buscar logs quando medicamentos carregarem
  useEffect(() => {
    if (medications.length === 0) return;
    async function fetchLogs() {
      try {
        setIsFetching(true);
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        const logsPromises = treatments.map(async (treatment) => {
          const logs = await fetchMedicationLogsInRange(
            treatment.id,
            sevenDaysAgo,
            today
          );
          return {
            treatmentId: treatment,
            alerts: alerts.filter((a) => a.treatmentId == treatment.id),
            medication:
              medications.find((m) => m.id == treatment.medicationId)?.name ||
              "",
            logs,
          };
        });

        const logsByTreatment = await Promise.all(logsPromises);
        setMedicationLogs(logsByTreatment);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os logs.");
      } finally {
        setIsFetching(false);
      }
    }
    fetchLogs();
  }, [alerts]);

  // Função para verificar se o tratamento está ativo
  function isTreatmentActive(treatment) {
    const today = new Date();
    const start = new Date(treatment.startDate);
    const end = treatment.endDate ? new Date(treatment.endDate) : null;
    return treatment.isContinuous || (start <= today && (!end || today <= end));
  }

  const activeMedicationLogs = medicationLogs.filter((ml) =>
    isTreatmentActive(ml.treatmentId)
  );

  return (
    <View style={styles.tabContent}>
      {activeMedicationLogs.length === 0 && (
        <Text style={styles.text}>Nenhum tratamento ativo.</Text>
      )}
      <FlatList
        data={activeMedicationLogs}
        keyExtractor={(item) => item.treatmentId.id}
        renderItem={({ item }) => {
          return (
            <MedicationLogCard
              treatment={item.treatmentId}
              medication={item.medication}
              alerts={item.alerts}
              logs={item.logs}
            />
          );
        }}
        ListFooterComponent={<View style={{ height: 200 }} />} // ajuste a altura conforme o tamanho do seu BottomNavigation
      />
    </View>
  );
}

export default LogsScreen;

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
});
