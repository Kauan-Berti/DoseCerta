import { Text, View, StyleSheet } from "react-native";

function CreateJournalEntry() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CreateJournalEntry</Text>
    </View>
  );
}

export default CreateJournalEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
});
