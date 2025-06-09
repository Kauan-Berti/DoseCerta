import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { GlobalStyles } from "../constants/colors";
import { CheckCircle, Scroll } from "phosphor-react-native";
import Input from "../components/Input";
import {
  storeDiary,
  updateDiary,
  fetchDiaryByDate,
} from "../services/diaryService";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  fetchCategories,
  fetchSensations,
} from "../services/sensationsService";
import SensationPickerModal from "../components/SensationPickerModal";
import SensationCard from "../components/SensationCard";

function CreateDiary() {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [diaryId, setDiaryId] = useState(null);
  const [sensationModalVisible, setSensationModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sensations, setSensations] = useState([]);
  const [selectedSensations, setSelectedSensations] = useState([]);

  const navigation = useNavigation();

  function setIntensidade(sensationId, value) {
    setSelectedSensations((prev) =>
      prev.map((s) => (s.id === sensationId ? { ...s, intensidade: value } : s))
    );
    console.log(`${sensationId} ${value}`);
  }

  async function upsertDiary(diary) {
    if (diary.id) {
      return await updateDiary(diary.id, diary);
    } else {
      return await storeDiary(diary);
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function loadTodayDiary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diary = await fetchDiaryByDate(today.toISOString());
        if (diary) {
          setText(diary.content || "");
          setDiaryId(diary.id);
        } else {
          setText("");
          setDiaryId(null);
        }
      }
      loadTodayDiary();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const cats = await fetchCategories();
        setCategories(cats);
        const sens = await fetchSensations();
        setSensations(sens);
      }
      fetchData();
    }, [])
  );

  async function handleSave() {
    if (!text.trim()) return;
    setIsSaving(true);

    await upsertDiary({
      id: diaryId,
      date: new Date().toISOString(),
      content: text.trim(),
      sensations: selectedSensations, // Salva sensações e intensidades
    });

    setIsSaving(false);
    setText("");
    setSelectedSensations([]);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigation.navigate("Alerts");
    }, 2000);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [
            styles.sensationButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setSensationModalVisible(true)}
        >
          <Text style={styles.buttonText}>Incluir sensações</Text>
        </Pressable>

        {selectedSensations.length > 0 && (
          <View style={styles.selectedSensationsContainer}>
            {selectedSensations.map((s) => (
              <SensationCard
                key={s.id}
                sensation={s}
                onChange={setIntensidade}
              />
            ))}
          </View>
        )}

        <View style={styles.titleContainer}>
          <Scroll color={GlobalStyles.colors.primary} />
          <Text style={styles.text}>Descreva o que sentiu durante o dia</Text>
        </View>

        <View style={styles.contentContainer}>
          <Input
            textInputConfig={{
              multiline: true,
              maxLength: 1000,
              value: text,
              onChangeText: setText,
              placeholder: "Como foi seu dia?",
            }}
            style={styles.inputMultiline}
          />
          <Text style={styles.counterText}>{text.length}/1000</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.finishButton,
            pressed && !isSaving && styles.buttonPressed,
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={GlobalStyles.colors.text} size="small" />
          ) : (
            <>
              <CheckCircle color={GlobalStyles.colors.text} />
              <Text style={styles.finishText}>Finalizar diário</Text>
            </>
          )}
        </Pressable>

        <Modal
          visible={showSuccess}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccess(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <CheckCircle color={GlobalStyles.colors.primary} size={48} />
              <Text style={styles.modalSuccessText}>
                Diário salvo com sucesso!
              </Text>
            </View>
          </View>
        </Modal>

        <SensationPickerModal
          visible={sensationModalVisible}
          categories={categories}
          sensations={sensations}
          selectedSensations={selectedSensations}
          setSelectedSensations={setSelectedSensations}
          onClose={() => setSensationModalVisible(false)}
        />
      </View>
    </ScrollView>
  );
}

export default CreateDiary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 8,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.primary,
    fontWeight: "bold",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sensationButton: {
    backgroundColor: GlobalStyles.colors.card,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: GlobalStyles.colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  contentContainer: {
    alignSelf: "stretch",
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: "top",
    padding: 12,
    fontSize: 18,
  },
  counterText: {
    alignSelf: "flex-end",
    color: "#888",
    marginRight: 8,
    marginTop: 2,
  },
  finishButton: {
    backgroundColor: GlobalStyles.colors.accent,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
  },
  finishText: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
    fontWeight: "bold",
  },
  selectedSensationsContainer: {
    flexDirection: "column",
    marginBottom: 12,
    gap: 12,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GlobalStyles.colors.card,
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
  },
  modalSuccessText: {
    color: GlobalStyles.colors.primary,
    fontSize: 20,
    marginTop: 12,
    fontWeight: "bold",
  },
});
