import { View, Text, StyleSheet, Modal } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import { Pill } from "phosphor-react-native";
import {
  CheckCircle,
  WarningCircle,
  Clock,
  XCircle,
} from "phosphor-react-native";

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

    const startDate = treatment?.startDate
      ? new Date(treatment.startDate)
      : null;

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      if (startDate && d < startDate) break;
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
          {item.alerts.length === 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Clock size={18} color="#aaa" style={{ marginRight: 4 }} />
              <Text
                style={[
                  styles.text,
                  { fontWeight: "bold", marginRight: 6, color: "#aaa" },
                ]}
              >
                --
              </Text>
              <Text style={[styles.text, { color: "#aaa", marginLeft: 4 }]}>
                Não necessário
              </Text>
            </View>
          ) : (
            item.alerts.map((alert, idx) => {
              const log = item.logs.find(
                (l) =>
                  l.alert_time &&
                  alert.time &&
                  new Date(l.alert_time).getHours() ===
                    Number(alert.time.split(":")[0]) &&
                  new Date(l.alert_time).getMinutes() ===
                    Number(alert.time.split(":")[1])
              );
              const [h, m] = alert.time.split(":");
              const fakeDate = new Date();
              fakeDate.setHours(Number(h), Number(m), 0, 0);
              const alertHour = fakeDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              let statusIcon = null;
              let statusColor = "#aaa";
              let statusText = "Não registrado";

              if (log) {
                const logDateLocal = log.time_taken.endsWith("Z")
                  ? new Date(log.time_taken)
                  : new Date(log.time_taken + "Z");
                const logAlertDate = new Date(log.alert_time);
                const diffMs = Math.abs(
                  logDateLocal.getTime() - logAlertDate.getTime()
                );
                const diffH = diffMs / (1000 * 60 * 60);

                if (diffH <= 1) {
                  statusIcon = (
                    <CheckCircle size={18} color="#4CAF50" weight="bold" />
                  );
                  statusColor = "#4CAF50";
                  statusText = ` ${logDateLocal.toLocaleDateString()} ${logDateLocal.toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}`;
                } else {
                  statusIcon = (
                    <WarningCircle size={18} color="#FFC107" weight="bold" />
                  );
                  statusColor = "#FFC107";
                  statusText = ` ${logDateLocal.toLocaleDateString()} ${logDateLocal.toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}`;
                }
              } else {
                // Só fica vermelho se era necessário tomar (há alerta para o dia)
                statusIcon = (
                  <XCircle size={18} color="#F44336" weight="bold" />
                );
                statusColor = "#F44336";
                statusText = "Não registrado";
              }

              return (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Clock
                    size={18}
                    color={GlobalStyles.colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.text,
                      { fontWeight: "bold", marginRight: 6 },
                    ]}
                  >
                    {alertHour}
                  </Text>
                  {statusIcon}
                  <Text
                    style={[styles.text, { color: statusColor, marginLeft: 4 }]}
                  >
                    {statusText}
                  </Text>
                </View>
              );
            })
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
        <View style={styles.treatmentInfoContainer}>
          <Text style={styles.treatmentInfoTitle}>Detalhes do Tratamento</Text>
          <View style={styles.treatmentInfoRow}>
            <Text style={styles.treatmentInfoLabel}>Início:</Text>
            <Text style={styles.treatmentInfoValue}>
              {treatment?.startDate
                ? new Date(treatment.startDate).toLocaleDateString()
                : "--"}
            </Text>
          </View>
          <View style={styles.treatmentInfoRow}>
            <Text style={styles.treatmentInfoLabel}>Fim:</Text>
            <Text style={styles.treatmentInfoValue}>
              {treatment?.endDate
                ? new Date(treatment.endDate).toLocaleDateString()
                : "Uso contínuo"}
            </Text>
          </View>
        </View>
        <FlatList
          data={ultimos30Dias}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <DetailsCard item={item} />}
          initialNumToRender={10}
          ListFooterComponent={<View style={{ height: 300 }} />} // ajuste a altura conforme o tamanho do seu BottomNavigation
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
    fontSize: 16,
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
  treatmentInfoContainer: {
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 8,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  treatmentInfoTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: GlobalStyles.colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  treatmentInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  treatmentInfoLabel: {
    fontWeight: "600",
    color: GlobalStyles.colors.text,
    fontSize: 16,
  },
  treatmentInfoValue: {
    color: GlobalStyles.colors.text,
    fontSize: 16,
  },
});
