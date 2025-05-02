import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import { useState, useEffect, Text } from "react";
import RoundToggle from "./RoundToggle";

function DayOfWeek({ onDaysChange, style, defaultValues }) {
  const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  const [selectedDays, setSelectedDays] = useState(
    Array.isArray(defaultValues) && defaultValues.length > 0
      ? defaultValues
      : days
  );
  useEffect(() => {
    onDaysChange(selectedDays);
  }, []);

  function toggleDay(day) {
    setSelectedDays((currentDays) => {
      const isSelected = currentDays.includes(day);
      const updatedDays = isSelected
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day];

      onDaysChange(updatedDays); // Notifica o componente pai sobre os dias selecionados
      return updatedDays;
    });
  }

  return (
    <>
      <View style={[styles.container, style]}>
        {days.map((day, index) => (
          <RoundToggle
            key={index}
            text={day.charAt(0)}
            isSelected={selectedDays.includes(day)}
            onPress={() => toggleDay(day)}
          />
        ))}
      </View>
    </>
  );
}

export default DayOfWeek;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  selectedText: {
    color: GlobalStyles.colors.background,
  },
  label: {
    fontSize: 16,
    color: GlobalStyles.colors.textSecondary,
    marginTop: 8,
  },
});
