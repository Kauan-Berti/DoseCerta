import { Text, View, StyleSheet, Pressable } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import { useState } from "react";

function SelectMedicationCard({ children, isSelected, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, isSelected && styles.selected]}>
        <Text style={[styles.title, isSelected && styles.textSelected]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export default SelectMedicationCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.card,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: GlobalStyles.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.text,
  },
  selected: {
    backgroundColor: GlobalStyles.colors.primary,
  },
  textSelected: {
    color: GlobalStyles.colors.background,
  },
});
