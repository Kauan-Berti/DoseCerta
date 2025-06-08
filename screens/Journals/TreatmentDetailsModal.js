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
  animationType = "slide",
}) {
  function getLast30DaysData(alerts) {
    const diasSemana = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    const days = [];
    const today = new Date();
    const diasSemanaAbbr = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
    // Garante que alerts é sempre um array
    const alertsArray = Array.isArray(alerts) ? alerts : alerts ? [alerts] : [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const abbr = diasSemanaAbbr[d.getDay()];
      const diaSemana = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ][d.getDay()];
      const dia = String(d.getDate()).padStart(2, "0");
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const ano = d.getFullYear();
      const alertsForDay = alertsArray.filter(
        (alert) => alert.days && alert.days.includes(abbr)
      );
      days.push({
        label: `${diaSemana}, ${dia}/${mes}/${ano}`,
        date: new Date(d),
        alerts: alertsForDay,
      });
    }
    return days;
  }
  const ultimos30Dias = getLast30DaysData(alerts);

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
          {/* Exemplo: listar horários dos alertas do dia */}
          {item.alerts.length > 0 ? (
            item.alerts.map((alert, idx) => (
              <Text style={styles.text} key={idx}>
                Alerta: {alert.time}
              </Text>
            ))
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
