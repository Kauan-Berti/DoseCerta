import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchCategories, storeSensation } from "../services/sensationsService";
import Input from "../components/Input";
import { Picker } from "@react-native-picker/picker";
import { Sparkle } from "phosphor-react-native";
import { GlobalStyles } from "../constants/colors";
import { Pressable, ActivityIndicator, Modal } from "react-native";
import { CheckCircle } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native"; // adicione este import

function CreateSensation() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const navigation = useNavigation();

  async function handleSave() {
    console.log(descricao);
    if (!descricao.trim() || !selectedCategory) return;
    setIsSaving(true);

    // Salve a sensação aqui (adicione sua lógica de store)
    await storeSensation({
      description: descricao,
      category_id: selectedCategory,
    });

    setIsSaving(false);
    setDescricao("");
    setSelectedCategory(null);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigation.goBack(); // ou navegue para onde desejar
    }, 2000);
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchCategoriesFromAPI() {
        const cats = await fetchCategories();
        setCategories(cats);
      }
      fetchCategoriesFromAPI();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <Input
        textInputConfig={{
          maxLength: 100,
          placeholder: "Nome da sensação",
          onChangeText: setDescricao,
          value: descricao,
        }}
        style={styles.input}
      />
      <Text style={styles.label}>Categoria</Text>
      <Pressable
        style={styles.categorySelect}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Text style={styles.categorySelectText}>
          {categories.find((cat) => cat.id === selectedCategory)?.name ||
            "Selecione uma categoria"}
        </Text>
      </Pressable>
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
            <Text style={styles.finishText}>Finalizar</Text>
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
              Sensação salva com sucesso!
            </Text>
          </View>
        </View>
      </Modal>
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma categoria</Text>
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{cat.name}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setCategoryModalVisible(false)}>
                <Text style={styles.modalCancel}>Cancelar</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CreateSensation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.background,
    paddingTop: 24,
    paddingHorizontal: 12,
  },

  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: GlobalStyles.colors.disabled,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: GlobalStyles.colors.card,
  },
  picker: {
    height: 60,
    color: GlobalStyles.colors.text,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
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
  buttonPressed: {
    opacity: 0.7,
  },
  categorySelect: {
    borderWidth: 1,
    borderColor: GlobalStyles.colors.disabled,
    borderRadius: 8,
    backgroundColor: GlobalStyles.colors.card,
    padding: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  categorySelectText: {
    color: GlobalStyles.colors.text,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // fundo escurecido
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GlobalStyles.colors.card,
    padding: 24,
    borderRadius: 16,
    width: "92%",
    maxHeight: "70%",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
    color: GlobalStyles.colors.primary,
  },
  modalItem: {
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.disabled,
  },
  modalItemText: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  modalCancel: {
    marginTop: 16,
    color: GlobalStyles.colors.error,
    fontWeight: "bold",
    fontSize: 16,
  },
});
