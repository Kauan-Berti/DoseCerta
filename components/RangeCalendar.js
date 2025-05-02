import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { GlobalStyles } from "../constants/colors";
import { Calendar } from "react-native-calendars";
function RangeCalendar({ isVisible, onClose, onDayPress, markedDates }) {
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
              onDayPress={onDayPress}
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
