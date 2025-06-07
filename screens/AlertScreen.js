import { StyleSheet, FlatList, Text, View } from "react-native";
import { GlobalStyles } from "../constants/colors";
import NavigationHeader from "../components/NavigationHeader";
import AlertCard from "../components/AlertCard";
import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../store/app-context";
import { fetchMedications } from "../services/medicationService";

import { fetchTreatments } from "../services/treatmentService";
import { fetchAlerts } from "../services/alertService";
import {
  storeMedicationLog,
  fetchAllMedicationLogs,
} from "../services/medicationLogService";

import ErrorOverlay from "../components/ui/ErrorOverlay";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import { Alert as RNAlert } from "react-native";
import formatTime from "../util/formatTime";

function AlertScreen() {
  const appContext = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayAlerts, setTodayAlerts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const pagerRef = useRef(null);
  const [confirmedAlerts, setConfirmedAlerts] = useState({});

  const navigation = useNavigation();

  const numberOfPages = 7; // 3 dias antes, o dia atual e 3 depois
  const middleIndex = Math.floor(numberOfPages / 2);
  const currentPageIndex = middleIndex;

  const dates = Array.from({ length: numberOfPages }, (_, i) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (i - middleIndex));
    return date;
  });

  function handlePageSelected(e) {
    const newIndex = e.nativeEvent.position;
    const newDate = dates[newIndex];
    setSelectedDate(newDate);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAlertsForDate(selectedDate);
  }, [selectedDate, appContext.alerts]);

  async function fetchData() {
    setIsFetching(true);
    try {
      const [medications, treatments, alerts, medicationLogs] =
        await Promise.all([
          fetchMedications(),
          fetchTreatments(),
          fetchAlerts(),
          fetchAllMedicationLogs(),
        ]);

      // Limpa o contexto antes de adicionar novos itens
      appContext.medications.forEach((m) => appContext.deleteMedication(m.id));
      appContext.treatments.forEach((t) => appContext.deleteTreatment(t.id));
      appContext.alerts.forEach((a) => appContext.deleteAlert(a.id));

      // Adiciona os novos itens
      medications.forEach(appContext.addMedication);
      treatments.forEach(appContext.addTreatment);
      alerts.forEach(appContext.addAlert);
      appContext.setMedicationLogs(medicationLogs); // <-- salva todos os logs no contexto
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
  useEffect(() => {
    function setConfirmedFromLogs() {
      const selectedDateStr = [
        selectedDate.getFullYear(),
        String(selectedDate.getMonth() + 1).padStart(2, "0"),
        String(selectedDate.getDate()).padStart(2, "0"),
      ].join("-");

      const confirmed = {};

      appContext.medicationLogs.forEach((log) => {
        if (
          log.alert_time &&
          log.treatment_id &&
          log.alert_time.slice(0, 10) === selectedDateStr
        ) {
          const timeKey =
            log.alert_time.length > 5
              ? log.alert_time.slice(11, 16)
              : log.alert_time;
          confirmed[`${log.treatment_id}_${timeKey}`] = true;
        }
      });
      setConfirmedAlerts(confirmed);
    }

    setConfirmedFromLogs();
  }, [selectedDate, appContext.medicationLogs]);

  function changeSelectedDate(days) {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);

      if (pagerRef.current) {
        pagerRef.current.setPage(middleIndex + days);
      }

      return newDate;
    });
  }

  function renderAlertCard({ item, confirmedAlerts, date }) {
    const treatment = appContext.treatments.find(
      (t) => t.id === item.treatmentId
    );

    const medication = appContext.medications.find(
      (m) => m.id === treatment?.medicationId
    );

    const isConfirmed =
      !!confirmedAlerts[
        `${item.treatmentId}_${
          typeof item.time === "string" ? item.time.slice(0, 5) : ""
        }`
      ];

    function handlerConfirm() {
      if (isConfirmed === true) return;

      RNAlert.alert(
        "Confirmar dose",
        "Você deseja confirmar que tomou este medicamento?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            style: "default",
            onPress: async () => {
              console.log("item.time:", item.time);

              const timeKey =
                typeof item.time === "string" ? item.time.slice(0, 5) : "";
              setConfirmedAlerts((prev) => ({
                ...prev,
                [`${item.treatmentId}_${timeKey}`]: true,
              }));

              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(
                2,
                "0"
              );
              const day = String(selectedDate.getDate()).padStart(2, "0");
              const dateStr = `${year}-${month}-${day}`;

              const alertTime =
                typeof item.time === "string" ? item.time : "00:00";
              const alertTimeStamp = `${dateStr}T${
                alertTime.length === 5 ? alertTime + ":00" : alertTime
              }`;
              console.log("alertTimeStamp:", alertTimeStamp);

              try {
                await storeMedicationLog({
                  treatmentId: item.treatmentId,
                  timeTaken: new Date().toISOString(),
                  alertTime: alertTimeStamp,
                  notes: "",
                });
                // Atualiza os logs no contexto para refletir imediatamente na UI
                const updatedLogs = await fetchAllMedicationLogs();
                appContext.setMedicationLogs(updatedLogs);
              } catch (err) {
                console.error("Erro ao registrar log:", err);
              }
            },
          },
        ]
      );
    }

    return (
      <AlertCard
        name={medication?.name || "Medicamento desconhecido"}
        time={formatTime(item.time)}
        dose={item.dose}
        observations={item.observations || "Sem observações"}
        onConfirm={handlerConfirm}
        isSelected={isConfirmed}
      />
    );
  }

  if (error) {
    return <ErrorOverlay message={error} onConfirm={() => setError(null)} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }
  const confirmedAlertsByDate = {};
  dates.forEach((date) => {
    const dateStr = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    confirmedAlertsByDate[dateStr] = {};
    appContext.medicationLogs.forEach((log) => {
      if (
        log.alert_time &&
        log.treatment_id &&
        log.alert_time.slice(0, 10) === dateStr
      ) {
        const timeKey =
          log.alert_time.length > 5
            ? log.alert_time.slice(11, 16)
            : log.alert_time;
        confirmedAlertsByDate[dateStr][`${log.treatment_id}_${timeKey}`] = true;
      }
    });
  });

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={middleIndex}
        onPageSelected={handlePageSelected}
        key={selectedDate.toDateString()}
      >
        {dates.map((date, index) => {
          const dayOfWeek = date
            .toLocaleDateString("pt-BR", { weekday: "short" })
            .toUpperCase()
            .replace("Á", "A")
            .replace(".", "");

          const filteredAlerts = appContext.alerts.filter((alert) => {
            const dayMatch = alert.days
              ?.map((d) => d.toUpperCase())
              .includes(dayOfWeek);
            if (!dayMatch) return false;

            const treatment = appContext.treatments.find(
              (t) => t.id === alert.treatmentId
            );
            if (!treatment) return false;

            const currentDate = date.getTime();
            const startDate = treatment.startDate
              ? new Date(treatment.startDate).getTime()
              : 0;
            const endDate = treatment.endDate
              ? new Date(treatment.endDate).getTime()
              : Infinity;

            return currentDate >= startDate && currentDate <= endDate;
          });

          // Data string para buscar os confirmados deste dia
          const dateStr = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
          ].join("-");

          return (
            <View key={index} style={{ padding: 16 }}>
              <NavigationHeader
                title={date.toLocaleDateString("pt-BR")}
                onBack={() => changeSelectedDate(-1)}
                onNext={() => changeSelectedDate(1)}
              />
              {filteredAlerts.length === 0 ? (
                <Text style={styles.text}>Nenhum alerta para este dia</Text>
              ) : (
                <FlatList
                  data={filteredAlerts}
                  renderItem={({ item }) =>
                    renderAlertCard({
                      item,
                      confirmedAlerts: confirmedAlertsByDate[dateStr] || {},
                      date,
                    })
                  }
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.contentContainer}
                />
              )}
            </View>
          );
        })}
      </PagerView>
    </View>
  );
}

export default AlertScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
    textAlign: "center",
  },
  contentContainer: {
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
    marginBottom: 16,
  },
  titleContainer: {
    paddingTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
