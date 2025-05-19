import { StyleSheet, FlatList, Text, View } from "react-native";
import { GlobalStyles } from "../constants/colors";
import NavigationHeader from "../components/NavigationHeader";
import AlertCard from "../components/AlertCard";
import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../store/app-context";
import {
  fetchTreatments,
  fetchMedications,
  fetchAlerts,
  storeMedicationLog,
  fetchMedicationLogsForDate,
} from "../util/supabase";
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

  useEffect(() => {
    async function fetchLogsAndSetConfirmed() {
      try {
        let allLogs = [];
        for (const treatment of appContext.treatments) {
          const logs = await fetchMedicationLogsForDate(
            treatment.id,
            selectedDate
          );
          allLogs = allLogs.concat(logs);
        }

        const selectedDateStr = [
          selectedDate.getFullYear(),
          String(selectedDate.getMonth() + 1).padStart(2, "0"),
          String(selectedDate.getDate()).padStart(2, "0"),
        ].join("-");

        const confirmed = {};

        allLogs.forEach((log) => {
          if (
            log.alert_time &&
            log.treatment_id &&
            log.alert_time.slice(0, 10) === selectedDateStr // <-- só confirma se for do dia certo!
          ) {
            const timeKey =
              log.alert_time.length > 5
                ? log.alert_time.slice(11, 16)
                : log.alert_time;
            confirmed[`${log.treatment_id}_${timeKey}`] = true;
          }
        });
        console.log("Confirmed alerts:", confirmed);
        setConfirmedAlerts(confirmed);
      } catch (err) {
        console.error("Erro ao buscar logs de confirmação:", err);
      }
    }

    fetchLogsAndSetConfirmed();
  }, [selectedDate, appContext.treatments]);

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

      if (pagerRef.current) {
        pagerRef.current.setPage(middleIndex + days);
      }

      return newDate;
    });
  }

  function renderAlertCard({ item }) {
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
            onPress: () => {
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

              storeMedicationLog({
                treatmentId: item.treatmentId,
                timeTaken: new Date().toISOString(),
                alertTime: alertTimeStamp,
                notes: "",
              }).catch((err) => {
                console.error("Erro ao registrar log:", err);
              });
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
                  renderItem={renderAlertCard}
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
