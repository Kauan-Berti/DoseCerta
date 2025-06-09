import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { GlobalStyles } from "../constants/colors";

export default function SensationPickerModal({
  visible,
  categories,
  sensations,
  selectedSensations,
  setSelectedSensations,
  onClose,
}) {
  function toggleSensation(sensation) {
    const exists = selectedSensations.find((s) => s.id === sensation.id);
    if (exists) {
      setSelectedSensations(
        selectedSensations.filter((s) => s.id !== sensation.id)
      );
    } else {
      setSelectedSensations([
        ...selectedSensations,
        { ...sensation, intensidade: 5 },
      ]);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione sensações</Text>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 16,
              paddingHorizontal: 8,
              alignItems: "stretch",
            }}
            showsVerticalScrollIndicator={false}
          >
            {categories.map((cat) => (
              <View key={cat.id} style={{ marginBottom: 12 }}>
                <Text style={styles.modalCategoryTitle}>{cat.name}</Text>
                {sensations
                  .filter((s) => s.category_id === cat.id)
                  .map((s) => {
                    const selected = selectedSensations.some(
                      (sel) => sel.id === s.id
                    );
                    return (
                      <Pressable
                        key={s.id}
                        style={[
                          styles.modalItem,
                          selected && styles.modalItemSelected,
                        ]}
                        onPress={() => toggleSensation(s)}
                      >
                        <Text
                          style={[
                            styles.modalItemText,
                            selected && styles.modalItemTextSelected,
                          ]}
                        >
                          {s.description}
                        </Text>
                      </Pressable>
                    );
                  })}
              </View>
            ))}
            <Pressable onPress={onClose}>
              <Text style={styles.modalCancel}>Concluir</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GlobalStyles.colors.card ?? "#fff", // fallback para branco
    padding: 24,
    borderRadius: 16,
    width: "92%",
    maxHeight: "75%",
    alignItems: "stretch",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
    color: GlobalStyles.colors.primary,
  },
  modalCategoryTitle: {
    fontWeight: "bold",
    color: GlobalStyles.colors.primary,
    marginBottom: 4,
    marginTop: 8,
  },
  modalItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: GlobalStyles.colors.card,
  },
  modalItemSelected: {
    backgroundColor: GlobalStyles.colors.primary,
  },
  modalItemText: {
    color: GlobalStyles.colors.text,
  },
  modalItemTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalCancel: {
    marginTop: 16,
    color: GlobalStyles.colors.error ?? "#E53935",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
