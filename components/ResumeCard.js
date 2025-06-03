import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import RoundToggle from "./RoundToggle";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const daysStatus = [
  { day: "Dom", status: "notNeed" },
  { day: "Seg", status: "notOk" },
  { day: "Ter", status: "ok" },
  { day: "Qua", status: "notOk" },
  { day: "Qui", status: "ok" },
  { day: "Sex", status: "ok" },
  { day: "Sáb", status: "notNeed" },
];

function getLast7DaysAbbr() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(weekDays[d.getDay()]);
  }
  return days;
}

function ResumeCard({ medicament = "Medicamento" }) {
  //buscar histórico de uso do medicamento
  // e renderizar os dias com o estado do uso

  // Exemplo de renderização de um item do FlatList
  // Cada item representa um dia da semana
  // e se o medicamento foi tomado ou não nesse dia

  function renderDayItem({ item }) {
    let bgColor = GlobalStyles.colors.primary;
    if (item.status === "notNeed") bgColor = "#444";
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

  //const last7Days = weekDays();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.text}> {medicament}</Text>
        <FlatList
          data={daysStatus}
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
    </View>
  );
}

export default ResumeCard;

const styles = StyleSheet.create({
  cardContainer: {
    height: 150,
    width: "100%",
    backgroundColor: GlobalStyles.colors.card,
    marginBottom: 12,
  },
  contentContainer: {
    margin: 12,
    flex: 1,
  },
  text: {
    color: GlobalStyles.colors.text,
  },
  dayItemText: {
    alignItems: "center",
    marginBottom: 8,
  },
  dayItem: {
    padding: 6,
    borderRadius: 6,
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
});
