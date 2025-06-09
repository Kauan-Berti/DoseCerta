import { Text, View, StyleSheet, Pressable } from "react-native";
import { GlobalStyles } from "../constants/colors";
import { CheckCircle, Scroll } from "phosphor-react-native";
import Input from "../components/Input";
import React, { useState, useEffect } from "react";
import {
  storeDiary,
  updateDiary,
  fetchDiaryByDate,
} from "../services/diaryService";
import { ActivityIndicator } from "react-native"; // adicione este import
import { useNavigation } from "@react-navigation/native";
import { Modal } from "react-native"; // adicione este import
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  fetchCategories,
  fetchSensations,
} from "../services/sensationsService";
import SensationPickerModal from "../components/SensationPickerModal";
import Slider from "@react-native-community/slider";
import { ScrollView } from "react-native"; // adicione este import

function CreateDiary() {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // novo estado
  const [diaryId, setDiaryId] = useState(null); // para atualizar se já existir
  const [sensationModalVisible, setSensationModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sensations, setSensations] = useState([]);
  const [selectedSensations, setSelectedSensations] = useState([]);
  const [tempIntensidades, setTempIntensidades] = useState({});

  const navigation = useNavigation();
  function setIntensidade(sensationId, value) {
    setSelectedSensations((prev) =>
      prev.map((s) => (s.id === sensationId ? { ...s, intensidade: value } : s))
    );
  }

  useEffect(() => {
    const initial = {};
    selectedSensations.forEach((s) => {
      initial[s.id] = typeof s.intensidade === "number" ? s.intensidade : 5;
    });
    setTempIntensidades(initial);
  }, [selectedSensations]);

  async function upsertDiary(diary) {
    if (diary.id) {
      // Se já existe, atualiza
      return await updateDiary(diary.id, diary);
    } else {
      // Se não existe, cria novo
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
          setDiaryId(diary.id); // supondo que o diário tem um id
          console.log("Possui Diario");
        } else {
          setText("");
          setDiaryId(null);
          console.log("Não Possui Diario");
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

    const diary = {
      date: new Date().toISOString(),
      content: text.trim(),
    };
    await upsertDiary({
      id: diaryId, // null ou id existente
      date: new Date().toISOString(),
      content: text.trim(),
    });
    setIsSaving(false);
    setText(""); // limpa o campo
    setShowSuccess(true); // mostra modal de sucesso

    setTimeout(() => {
      setShowSuccess(false);
      navigation.navigate("Alerts"); // redireciona após 1s
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
              <View key={s.id} style={styles.sensationCard}>
                <Text style={styles.sensationName}>{s.description}</Text>
                <Slider
                  style={{ width: "100%", height: 40, marginVertical: 8 }}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={tempIntensidades[s.id] ?? 5}
                  onValueChange={(value) => {
                    setTempIntensidades((prev) => ({ ...prev, [s.id]: value }));
                  }}
                  onSlidingComplete={(value) => {
                    setIntensidade(s.id, value);
                  }}
                  minimumTrackTintColor={GlobalStyles.colors.primary}
                  maximumTrackTintColor="#ccc"
                />
                <Text style={styles.sensationIntensity}>
                  Intensidade: {tempIntensidades[s.id] ?? s.intensidade}
                </Text>
              </View>
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
            style={{ minHeight: 200 }}
          />
          <Text
            style={{
              alignSelf: "flex-end",
              color: "#888",
              marginRight: 8,
              marginTop: 2,
            }}
          >
            {text.length}/1000
          </Text>
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
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: GlobalStyles.colors.card,
                padding: 32,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <CheckCircle color={GlobalStyles.colors.primary} size={48} />
              <Text
                style={{
                  color: GlobalStyles.colors.primary,
                  fontSize: 20,
                  marginTop: 12,
                  fontWeight: "bold",
                }}
              >
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
    minHeight: 120, // mais espaço para digitação
    textAlignVertical: "top",
    padding: 12, // mais confortável
    fontSize: 18,
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
    width: "100%", // opcional, se estiver dentro de um View sem largura definida
  },

  sensationCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    width: "100%", // <<< GARANTE que o card expanda
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  selectedSensationText: {
    color: "#fff",
    fontWeight: "bold",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GlobalStyles.colors.card,
    padding: 24,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
    color: GlobalStyles.colors.primary,
  },
  modalCancel: {
    marginTop: 16,
    color: GlobalStyles.colors.error ?? "#E53935",
    fontWeight: "bold",
    fontSize: 16,
  },
  sensationCard: {
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sensationName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: GlobalStyles.colors.primary,
  },
  sensationIntensity: {
    alignSelf: "flex-end",
    color: GlobalStyles.colors.text,
    fontSize: 14,
    marginTop: 4,
  },
});
