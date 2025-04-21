import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "../constants/colors";

import NavigationHeader from "../components/NavigationHeader";
import AlertCard from "../components/AlertCard";

function Treatment() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title={new Date().toISOString().slice(0, 10)} />
      <FlatList
        data={[{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]}
        renderItem={({ item }) => <AlertCard />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

export default Treatment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    paddingHorizontal: 20,
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
  contentContainer: {
    paddingBottom: 100,
  },
});
