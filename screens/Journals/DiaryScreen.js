import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import { fetchDiaries } from "../../services/diaryService";
import { useState, useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Scroll } from "phosphor-react-native";

function DiaryScreen({ selectedTab }) {
  const [diaries, setDiaries] = useState([]);

  function DiaryCard({ item }) {
    return (
      <View style={styles.contentCard}>
        <View style={styles.cardHeader}>
          <Scroll color={GlobalStyles.colors.primary} size={28} weight="bold" />
          <Text style={styles.cardDate}>
            {(() => {
              const dateStr = new Date(item.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
            })()}
          </Text>
        </View>
        <Text style={styles.cardContent}>{item.content}</Text>
      </View>
    );
  }

  useEffect(() => {
    if (selectedTab !== "diary") return;
    async function fetchDiariesFromAPI() {
      setDiaries(await fetchDiaries());
    }
    fetchDiariesFromAPI();
    //console.log("Diario selecionado");
  }, [selectedTab]);

  useEffect(() => {
    console.log(diaries);
  }, [diaries]);

  return (
    <View>
      <FlatList
        data={diaries}
        keyExtractor={(item) => item.id}
        renderItem={DiaryCard}
        ListFooterComponent={<View style={{ height: 200 }} />} // ajuste a altura conforme o tamanho do seu BottomNavigation
      />
    </View>
  );
}

export default DiaryScreen;

const styles = StyleSheet.create({
  text: {
    color: GlobalStyles.colors.text,
  },
  contentCard: {
    marginVertical: 4,
    padding: 18,
    borderRadius: 14,
    backgroundColor: GlobalStyles.colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  cardDate: {
    color: GlobalStyles.colors.primary,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  cardContent: {
    color: GlobalStyles.colors.text,
    fontSize: 17,
    lineHeight: 22,
    marginTop: 2,
  },
});
