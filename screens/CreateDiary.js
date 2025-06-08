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

function CreateDiary() {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // novo estado
  const [diaryId, setDiaryId] = useState(null); // para atualizar se já existir

  const navigation = useNavigation();

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
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.sensationButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Incluir sensações</Text>
      </Pressable>
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
    </View>
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
});
