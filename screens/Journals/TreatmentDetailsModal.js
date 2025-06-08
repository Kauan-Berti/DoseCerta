import { View, Text, StyleSheet, Modal } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import { Pill } from "phosphor-react-native";

function TreatmentDetailsModal({
  visible,
  onClose,
  treatment,
  alerts,
  medication,
  logs,
  animationType = "slide",
}) {
  function getLast30DaysData(alerts, logs) {
    const diasSemana = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    const diasSemanaAbbr = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
    const days = [];
    const today = new Date();
    const alertsArray = Array.isArray(alerts) ? alerts : alerts ? [alerts] : [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const abbr = diasSemanaAbbr[d.getDay()];
      const diaSemana = diasSemana[d.getDay()];
      const dia = String(d.getDate()).padStart(2, "0");
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const ano = d.getFullYear();

      // Filtra alertas para o dia da semana
      const alertsForDay = alertsArray.filter(
        (alert) => alert.days && alert.days.includes(abbr)
      );

      // Filtra logs para o dia
      const logsForDay = (logs || []).filter((log) => {
        const alertDate = new Date(log.alert_time);
        return (
          alertDate.getDate() === d.getDate() &&
          alertDate.getMonth() === d.getMonth() &&
          alertDate.getFullYear() === d.getFullYear()
        );
      });

      days.push({
        label: `${diaSemana}, ${dia}/${mes}/${ano}`,
        date: new Date(d),
        alerts: alertsForDay,
        logs: logsForDay,
      });
    }
    return days;
  }
  const ultimos30Dias = getLast30DaysData(alerts, logs);

  function DetailsCard({ item }) {
    return (
      <View style={styles.detailsCard}>
        <View style={styles.topContainer}>
          <View style={styles.iconContainer}>
            <Pill color={GlobalStyles.colors.primary} size={38} />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{item.label}</Text>
          </View>
        </View>
        <View style={styles.lineSeparator} />
        <View style={styles.cardContent}>
          {item.alerts.length > 0 ? (
            item.alerts.map((alert, idx) => {
              // Procura log para este alerta (mesmo alert_time)
              const log = item.logs.find(
                (l) =>
                  l.alert_time &&
                  alert.time &&
                  new Date(l.alert_time).getHours() ===
                    Number(alert.time.split(":")[0]) &&
                  new Date(l.alert_time).getMinutes() ===
                    Number(alert.time.split(":")[1])
              );
              // Formata o horário do alerta
              const [h, m] = alert.time.split(":");
              const fakeDate = new Date();
              fakeDate.setHours(Number(h), Number(m), 0, 0);
              const alertHour = fakeDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <Text style={styles.text} key={idx}>
                  Alerta: {alertHour} -{" "}
                  {log
                    ? `Tomou: ${new Date(log.time_taken).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone:
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                        }
                      )}`
                    : "Não registrado"}
                </Text>
              );
            })
          ) : (
            <Text style={styles.text}>Nenhum alerta para este dia</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType={animationType} // garante animação
      transparent={true}
      backgroundColor={GlobalStyles.colors.card}
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}> {medication || "Medicamento"}</Text>
        </View>
        <FlatList
          data={ultimos30Dias}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <DetailsCard item={item} />}
          initialNumToRender={10}
        />
      </View>
    </Modal>
  );
}

export default TreatmentDetailsModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: GlobalStyles.colors.background,
    marginTop: 60,
  },
  text: {
    color: GlobalStyles.colors.text,
  },
  title: {
    fontSize: 36,
    color: GlobalStyles.colors.text,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: GlobalStyles.colors.card,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    borderRadius: 9,
  },
  cardTitle: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "stretch",
    marginVertical: 12,
    marginHorizontal: 12,
  },
  iconContainer: {
    borderRadius: 32,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.primary,
    padding: 8,
  },
  lineSeparator: {
    height: 1,
    marginHorizontal: 8,
    alignSelf: "stretch",
    backgroundColor: GlobalStyles.colors.disabled,
  },
  cardTitleContainer: {
    alignItems: "center",
    flex: 1,
  },
  cardContent: {
    marginVertical: 12,
    marginHorizontal: 12,
  },
});
