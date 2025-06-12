import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";
import { fetchDiariesWithSensations } from "../../services/diaryService";
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

        {item.sensations && item.sensations.length > 0 && (
          <View style={styles.sensationsContainer}>
            <Text style={styles.sensationsTitle}>Sensações:</Text>
            {item.sensations.map((s, idx) => (
              <View key={s.id || idx} style={styles.sensationRow}>
                <Text style={styles.sensationDot}>•</Text>
                <Text style={styles.sensationItem}>
                  {s.description}
                  {typeof s.intensity === "number"
                    ? ` (intensidade: ${s.intensity})`
                    : ""}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  useEffect(() => {
    if (selectedTab !== "diary") return;
    async function fetchDiariesFromAPI() {
      setDiaries(await fetchDiariesWithSensations());
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
  sensationsContainer: {
    marginTop: 10,
  },
  sensationsTitle: {
    fontWeight: "bold",
    color: GlobalStyles.colors.primary,
    marginBottom: 2,
  },
  sensationItem: {
    color: GlobalStyles.colors.text,
    fontSize: 15,
    marginLeft: 8,
  },
  sensationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    marginBottom: 2,
  },
  sensationDot: {
    color: GlobalStyles.colors.primary,
    fontSize: 18,
    marginRight: 6,
    marginTop: 1,
  },
});
