import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "../constants/colors";

import NavigationHeader from "../components/NavigationHeader";
import AlertCard from "../components/AlertCard";
import { useEffect, useContext, useState } from "react";
import { MedicationsContext } from "../store/medication-context";
import { fetchMedication } from "../util/http";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function Treatment() {
  const medicationsContext = useContext(MedicationsContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayAlerts, setTodayAlerts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    async function getMedications() {
      setIsFetching(true);
      try {
        const medications = await fetchMedication();
        medicationsContext.setMedications(medications);
      } catch (err) {
        console.log(err);
        setError("Não foi possível carregar os medicamentos.");
      } finally {
        setIsFetching(false);
      }
    }
    getMedications();
  }, []);

  useEffect(() => {
    const alerts = getAlertsForDate(selectedDate);
    setTodayAlerts(alerts); // Atualiza os alertas para a data selecionada
  }, [selectedDate, medicationsContext.medications]);

  function errorHandler() {
    setError(null);
  }

  useEffect(() => {
    const alerts = getAlertsForDate(selectedDate);
    setTodayAlerts(alerts); // Atualiza os alertas para a data selecionada
  }, [selectedDate, medicationsContext.medications]); // Recalcula os alertas quando a data ou os medicamentos mudam

  function handlePreviousDay() {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1); // Subtrai 1 dia
      return newDate;
    });
  }

  function handleNextDay() {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1); // Adiciona 1 dia
      return newDate;
    });
  }

  function getAlertsForDate(date) {
    const selectedISO = date.toISOString().split("T")[0];

    const alerts = medicationsContext.medications.flatMap((medication) => {
      const treatmentStartDate = new Date(medication.treatmentStartDate);
      const treatmentEndDate = new Date(
        treatmentStartDate.getTime() +
          medication.treatmentTime * 24 * 60 * 60 * 1000 // Adiciona os dias do tratamento
      );

      // Verifica se hoje está dentro do intervalo de tratamento
      if (date >= treatmentStartDate && date <= treatmentEndDate) {
        return medication.alerts.map((alert) => ({
          ...alert,
          id: `${medication.id}-${alert.id}`, // Garante IDs únicos combinando o ID do medicamento e do alerta
          name: medication.name, // Inclui o nome do medicamento no alerta
        }));
      }

      return []; // Retorna vazio se o medicamento não está no intervalo de tratamento
    });

    // Ordena os alertas pelo horário
    return alerts.sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(":").map(Number);
      const [bHours, bMinutes] = b.time.split(":").map(Number);

      // Converte o horário em minutos desde o início do dia
      const aTotalMinutes = aHours * 60 + aMinutes;
      const bTotalMinutes = bHours * 60 + bMinutes;

      return aTotalMinutes - bTotalMinutes; // Ordena em ordem crescente
    });
  }

  function renderAlertCard(itemData) {
    const { name, time, dose, preMeal } = itemData.item;
    return <AlertCard name={name} time={time} dose={dose} preMeal={preMeal} />;
  }

  if (error && !isFetching) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }
  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader
        title={selectedDate.toLocaleDateString("pt-BR")}
        onBack={handlePreviousDay}
        onNext={handleNextDay}
      />
      <FlatList
        data={todayAlerts}
        renderItem={renderAlertCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

export default Treatment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 20,
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
  contentContainer: {
    paddingBottom: 100,
  },
});
