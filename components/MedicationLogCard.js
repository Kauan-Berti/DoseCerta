import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import RoundToggle from "./RoundToggle";
import IconButton from "./IconButton";
import RoundButton from "./RoundButton";
import TreatmentDetailsModal from "../screens/Journals/TreatmentDetailsModal";
import { useState } from "react";

const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

function getLast7DaysStatus(logs, alertDays, alerts, treatment) {
  const days = [];
  const today = new Date();
  const TOLERANCE_HOURS = 1;
  const startDate = treatment?.startDate ? new Date(treatment.startDate) : null;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const abbr = weekDays[d.getDay()];

    // Se o dia é anterior ao início do tratamento, status = "noNeed"
    if (startDate && d < startDate) {
      days.push({ day: abbr, status: "noNeed" });
      continue;
    }

    // Verifica se algum alerta possui esse dia
    const alertsForDay = (alerts || []).filter((alert) =>
      alert.days.includes(abbr)
    );

    // console.log("\n==============================");
    // console.log("Horário local do sistema:", new Date().toString());
    // console.log("Horário UTC:", new Date().toISOString());
    // console.log(`Dia: ${abbr} (${d.toLocaleDateString()})`);
    //console.log(`Alertas para o dia (${alertsForDay.length}):`);
    // alertsForDay.forEach((alert, idx) => {
    //   console.log(`  [${idx + 1}] ${alert.time} (${alert.days.join(",")})`);
    // });

    if (!alertsForDay.length) {
      // console.log("Nenhum alerta para esse dia, status: noNeed");
      // console.log("==============================\n");
      days.push({ day: abbr, status: "noNeed" });
      continue;
    }

    let allAlertsOk = true;

    alertsForDay.forEach((alert, idx) => {
      console.log(`--- ALERTA [${idx + 1}] ---`);
      console.log(`  Horário: ${alert.time} (${alert.days.join(",")})`);

      const log = logs.find((log) => {
        // Monta a data/hora do alerta para o dia em questão
        const [alertHour, alertMin, alertSec] = alert.time
          .split(":")
          .map(Number);
        const alertDate = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          alertHour,
          alertMin,
          alertSec || 0,
          0
        );

        // Data/hora do log.alert_time (também UTC, mas só usamos para log)
        const logAlertDate = new Date(log.alert_time);

        // Compara se são exatamente o mesmo dia e horário
        return alertDate.getTime() === logAlertDate.getTime();
      });

      if (log) {
        const logDateLocal = log.time_taken.endsWith("Z")
          ? new Date(log.time_taken)
          : new Date(log.time_taken + "Z");
        console.log(logDateLocal.toString()); // mostra no horário local
        console.log(logDateLocal.toISOString()); // mostra sempre em UTC

        console.log(
          `    -> Log encontrado: ${logDateLocal} (alert_time: ${log.alert_time})`
        );

        const [alertHour, alertMin, alertSec] = alert.time
          .split(":")
          .map(Number);
        const alertDate = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          alertHour,
          alertMin,
          alertSec || 0,
          0
        );

        const diffMs = Math.abs(logDateLocal.getTime() - alertDate.getTime());
        const diffH = diffMs / (1000 * 60 * 60);

        console.log(`    Horário do alerta: ${alertDate.toLocaleString()}`);
        console.log(`    Horário do log:    ${logDateLocal.toLocaleString()}`);
        console.log(`    Diferença:         ${diffH.toFixed(2)}h`);

        if (diffH > TOLERANCE_HOURS) {
          allAlertsOk = false;
          console.log(
            `    -> Fora do intervalo de tolerância (${TOLERANCE_HOURS}h)`
          );
        } else {
          console.log(`    -> Dentro do intervalo de tolerância`);
        }
      } else {
        console.log(`    -> Nenhum log encontrado para esse alerta`);
        allAlertsOk = false;
        return;
      }
    });

    console.log(`Status final do dia ${abbr}: ${allAlertsOk ? "ok" : "notOk"}`);
    console.log("==============================\n");
    days.push({ day: abbr, status: allAlertsOk ? "ok" : "notOk" });
  }
  return days;
}

function MedicationLogCard({ treatment, medication, alerts, logs }) {
  const [modalVisible, setModalVisible] = useState(false);
  const alertDays = Array.isArray(alerts)
    ? Array.from(new Set(alerts.flatMap((a) => a.days)))
    : alerts?.days || [];

  const last7DaysStatus = getLast7DaysStatus(
    logs,
    alertDays,
    Array.isArray(alerts) ? alerts : [alerts],
    treatment
  );

  function renderDayItem({ item }) {
    let bgColor = GlobalStyles.colors.primary;
    if (item.status === "noNeed") bgColor = "#444";
    if (item.status === "ok") bgColor = GlobalStyles.colors.accent;
    if (item.status === "notOk") bgColor = GlobalStyles.colors.error;
    return (
      <View style={styles.dayItem}>
        <View style={styles.dayItemText}>
          <Text style={styles.text}>{item.day}</Text>
        </View>
        <View>
          <RoundToggle
            size={30}
            icon={"CheckCircle"}
            isSelected={item.status === "ok" || item.status === "notOk"}
            selectedBackgroundColor={
              item.status === "notOk" ? GlobalStyles.colors.error : null
            }
          ></RoundToggle>
        </View>
      </View>
    );
  }

  function openDetailsModal() {
    setModalVisible(true);
  }

  //const last7Days = weekDays();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.title}> {medication}</Text>
          <RoundButton
            icon="ArrowRight"
            size={28}
            color={GlobalStyles.colors.card}
            borderColor={GlobalStyles.colors.lightYellow}
            backgroundColor={GlobalStyles.colors.lightYellow}
            onPress={openDetailsModal}
          />
        </View>
        <View style={styles.lineSeparator} />

        <FlatList
          data={last7DaysStatus}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDayItem}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            alignContent: "center",
            justifyContent: "space-between",
            borderColor: GlobalStyles.colors.text,
          }}
        />
      </View>
      <TreatmentDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        treatment={treatment}
        medication={medication}
        alerts={alerts}
        logs={logs}
        animationType="slide" // ou "fade"
      />
    </View>
  );
}

export default MedicationLogCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: GlobalStyles.colors.card,
    marginBottom: 12,
    alignSelf: "stretch",
    borderRadius: 8,
  },
  title: {
    color: GlobalStyles.colors.text,
    fontWeight: "bold",
    fontSize: 20,
  },
  contentContainer: {
    padding: 12,
    flex: 1,
  },
  text: {
    color: GlobalStyles.colors.text,
  },
  dayItemText: {
    alignItems: "center",
    marginBottom: 12,
  },
  dayItem: {
    padding: 6,
  },
  dayDisabled: {
    backgroundColor: "#444", // exemplo: cinza para não precisa tomar
    borderColor: "#444",
  },
  dayOk: {
    backgroundColor: GlobalStyles.colors.accent, // exemplo: verde para tomado
    borderColor: GlobalStyles.colors.accent,
  },
  dayNotOk: {
    backgroundColor: GlobalStyles.colors.error, // exemplo: vermelho para não tomado
    borderColor: GlobalStyles.colors.error,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lineSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: GlobalStyles.colors.disabled,
    marginVertical: 10,
  },
});
