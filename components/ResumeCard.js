import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import RoundToggle from "./RoundToggle";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
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
  function renderDayItem({ item }) {
    return (
      <View style={styles.dayItem}>
        <View style={styles.dayItemText}>
          <Text style={styles.text}>{item}</Text>
        </View>
        <View>
          <RoundToggle
            size={30}
            isSelected={true}
            icon={"CheckCircle"}
          ></RoundToggle>
        </View>
      </View>
    );
  }

  const last7Days = getLast7DaysAbbr();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.text}> {medicament}</Text>
        <FlatList
          data={last7Days}
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
  dayDisabled: {},
  dayOk: {},
  dayNotOk: {},
});
