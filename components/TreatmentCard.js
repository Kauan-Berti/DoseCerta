import { View, Text, Image, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import RoundButton from "./RoundButton";
import DoubleLabelBox from "./DoubleLabelBox";
import { AppContext } from "../store/app-context";
import { useState, useEffect, useContext, use } from "react";
import formatDate from "../util/formatDate";
import { FlatList } from "react-native-gesture-handler";
import formatTime from "../util/formatTime";
import DayOfWeek from "../components/DayOfWeek";

// This is the default configuration

function TreatmentCard({ treatmentId, onEdit }) {
  const appContext = useContext(AppContext);

  const [treatment, setTreatment] = useState(null);
  const [medication, setMedication] = useState(null);
  const [alerts, setAlerts] = useState([]);

  function getTreatment(treatmentId) {
    return appContext.treatments.find(
      (treatment) => treatment.id === treatmentId
    );
  }
  function getMedication(medicationId) {
    return appContext.medications.find(
      (medication) => medication.id === medicationId
    );
  }

  function getAlerts(treatmentId) {
    return appContext.alerts.filter(
      (alert) => alert.treatmentId === treatmentId
    );
  }

  useEffect(() => {
    setAlerts(getAlerts(treatmentId));
  }, [treatmentId]);

  useEffect(() => {
    setTreatment(getTreatment(treatmentId));
  }, [treatmentId]);

  useEffect(() => {
    if (treatment) {
      setMedication(getMedication(treatment.medicationId));
    }
  }, [treatment]);

  // useEffect(() => {
  //   console.log("treatment", treatment);
  // }, [treatment]);

  // useEffect(() => {
  //   console.log("medication", medication);
  // }, [medication]);
  // useEffect(() => {
  //   console.log("alerts", alerts);
  // }, [alerts]);

  function handlePress() {
    onEdit();
  }

  function renderAlertItem({ item }) {
    const weekOrder = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
    // Ordena os dias conforme a ordem da semana
    const sortedDays = [...item.days].sort(
      (a, b) =>
        weekOrder.indexOf(a.toUpperCase()) - weekOrder.indexOf(b.toUpperCase())
    );

    return (
      <View style={styles.alert}>
        <Text style={styles.text}> {formatTime(item.time)}</Text>

        <View style={styles.daysContainer}>
          <DayOfWeek defaultValues={sortedDays} isButton={false} size={30} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.titlesContainer}>
        <Text style={styles.title}>
          {medication != null ? medication.name : ""}
        </Text>

        <RoundButton
          icon="ArrowSquareOut"
          size={32}
          color={GlobalStyles.colors.primary}
          borderColor={GlobalStyles.colors.card}
          backgroundColor={GlobalStyles.colors.card}
          onPress={handlePress}
        />
      </View>
      <View style={styles.lineSeparator} />
      {treatment != null ? (
        treatment.isContinuous ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
              borderWidth: 1,
              borderColor: GlobalStyles.colors.disabled,
            }}
          >
            <Text style={styles.subTitle}>Uso contínuo</Text>
          </View>
        ) : (
          <View style={styles.datesContainer}>
            <DoubleLabelBox
              title="Início: "
              text={formatDate(treatment.startDate)}
            />
            <DoubleLabelBox
              title="Fim: "
              text={formatDate(treatment.endDate)}
            />
          </View>
        )
      ) : null}

      {alerts.length > 0 ? (
        <View style={styles.alertsContainer}>
          <FlatList
            data={alerts}
            renderItem={renderAlertItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.alertsContainer}>
          <Text style={styles.text}>Sem alertas</Text>
        </View>
      )}
    </View>
  );
}

export default TreatmentCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    backgroundColor: GlobalStyles.colors.card,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titlesContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertsContainer: {
    borderColor: GlobalStyles.colors.disabled,
    borderWidth: 1,
    marginVertical: 2,
    flex: 1,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
    marginVertical: 10,
  },
  lineSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: GlobalStyles.colors.disabled,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  action: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 6, // Adiciona espaçamento vertical entre as actions
  },
  leftAction: {
    backgroundColor: GlobalStyles.colors.error,
  },
  rightAction: {
    backgroundColor: GlobalStyles.colors.accent,
  },
  alert: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    gap: 10,
    marginLeft: 10,
  },
  day: {
    backgroundColor: GlobalStyles.colors.card,
    height: 20,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 1,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.disabled,
  },
  dayText: {
    color: GlobalStyles.colors.text,
    fontSize: 12,
    textAlign: "center",
  },
  daysContainer: {
    flexGrow: 1,
  },
});
