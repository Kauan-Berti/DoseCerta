import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import IconButton from "../../components/IconButton";
import { GlobalStyles } from "../../constants/colors";
import RangeCalendar from "../../components/RangeCalendar";
import { Calendar, ShareNetwork } from "phosphor-react-native";

function getDefaultDates() {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  return {
    startDate: oneMonthAgo.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  };
}

export default function ShareScreen() {
  const { startDate, endDate } = getDefaultDates();
  const [range, setRange] = useState({ startDate, endDate });
  const [showCalendar, setShowCalendar] = useState(false);

  function onShare() {
    // Implemente a lógica de compartilhamento aqui
    alert(
      `Compartilhar de ${formatDate(range.startDate)} até ${formatDate(
        range.endDate
      )}`
    );
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <ShareNetwork
          size={24}
          color={GlobalStyles.colors.primary}
          weight="bold"
        />{" "}
        Selecione o período para compartilhar
      </Text>

      <View style={styles.rangeRow}>
        <View style={styles.dateBox}>
          <Calendar
            size={22}
            color={GlobalStyles.colors.primary}
            style={styles.icon}
          />
          <Text style={styles.label}>Data inicial</Text>
          <Text style={styles.dateText}>{formatDate(range.startDate)}</Text>
        </View>
        <View style={styles.dateBox}>
          <Calendar
            size={22}
            color={GlobalStyles.colors.primary}
            style={styles.icon}
          />
          <Text style={styles.label}>Data final</Text>
          <Text style={styles.dateText}>{formatDate(range.endDate)}</Text>
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <IconButton
          title="Selecionar período"
          color={GlobalStyles.colors.primary}
          size={20}
          style={styles.selectButton}
          icon="Calendar"
          onPress={() => setShowCalendar(true)}
        />

        <IconButton
          title="Compartilhar"
          color={GlobalStyles.colors.primary}
          size={22}
          style={styles.shareButton}
          icon="ShareNetwork"
          onPress={onShare}
        />
      </View>

      <RangeCalendar
        isVisible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateRangeSelected={({ startDate, endDate }) =>
          setRange({ startDate, endDate })
        }
        initalValues={range}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.background,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary,
    marginBottom: 32,
    textAlign: "center",
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  dateBox: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 8,
    elevation: 1,
    minWidth: 120,
  },
  label: {
    fontSize: 15,
    color: GlobalStyles.colors.textSecondary,
    marginBottom: 4,
    marginTop: 4,
  },
  dateText: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
    fontWeight: "bold",
  },
  selectButton: {
    marginBottom: 24,
    alignSelf: "center",
  },
  shareButton: {
    marginTop: 8,
    alignSelf: "center",
  },
  icon: {
    marginBottom: 2,
  },
  buttonGroup: {
    flexDirection: "column",
    gap: 16, // Ou use marginTop no shareButton se preferir compatibilidade ampla
    alignItems: "center",
  },
  shareButton: {
    marginTop: 16,
    alignSelf: "center",
  },
});
