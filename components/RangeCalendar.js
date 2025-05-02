import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { GlobalStyles } from "../constants/colors";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
function RangeCalendar({ isVisible, onClose, onDateRangeSelected }) {
  const [startDate, setStartDate] = useState(null); // Data de início
  const [endDate, setEndDate] = useState(null); // Data de término
  const [selectingEndDate, setSelectingEndDate] = useState(false); // Estado para controlar a seleção da data de término

  function handleDayPress(day) {
    if (!selectingEndDate) {
      // Seleciona a data de início
      setStartDate(day.dateString);
      setEndDate(null); // Reseta a data de término ao selecionar uma nova data de início
      setSelectingEndDate(true); // Alterna para a seleção da data de término
    } else {
      // Seleciona a data de término
      const selectedStartDate = startDate || day.dateString; // Garante que o startDate seja usado corretamente

      setEndDate(day.dateString);
      setSelectingEndDate(false);
      onDateRangeSelected({
        startDate: selectedStartDate,
        endDate: day.dateString,
      });
      onClose(); // Fecha o calendário após selecionar o intervalo
    }
  }

  // Marca as datas selecionadas e o intervalo
  const markedDates = {};
  if (startDate) {
    markedDates[startDate] = {
      startingDay: true,
      color: GlobalStyles.colors.primary,
      textColor: GlobalStyles.colors.background,
    };
  }
  if (endDate) {
    markedDates[endDate] = {
      endingDay: true,
      color: GlobalStyles.colors.primary,
      textColor: GlobalStyles.colors.background,
    };

    // Marca o intervalo entre as datas
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split("T")[0];
      if (dateString !== startDate && dateString !== endDate) {
        markedDates[dateString] = {
          color: GlobalStyles.colors.primary,
          textColor: GlobalStyles.colors.background,
        };
      }
      currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Incrementa o dia sem problemas de fuso horário
    }
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose} // Fecha a modal ao pressionar o botão de voltar
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Calendar
              markingType="period"
              markedDates={markedDates}
              onDayPress={handleDayPress}
              style={styles.calendar}
              theme={{
                backgroundColor: GlobalStyles.colors.card,
                calendarBackground: GlobalStyles.colors.card,
                textSectionTitleColor: GlobalStyles.colors.textSecondary,
                selectedDayBackgroundColor: GlobalStyles.colors.primary,
                selectedDayTextColor: GlobalStyles.colors.background,
                todayTextColor: GlobalStyles.colors.accent,
                dayTextColor: GlobalStyles.colors.text,
                textDisabledColor: GlobalStyles.colors.disabledText,
                arrowColor: GlobalStyles.colors.primary,
                monthTextColor: GlobalStyles.colors.text,
                textDayFontWeight: "bold",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "bold",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default RangeCalendar;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semi-transparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: GlobalStyles.colors.card, // Fundo do conteúdo da modal
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  calendar: {
    borderRadius: 10,
  },
});
