import { View, StyleSheet } from "react-native";
import Input from "./Input";
import IconButton from "./IconButton";
import { GlobalStyles } from "../constants/colors";

function SearchBar({ placeholder, onSearch, value, onChangeText }) {
  return (
    <View style={styles.searchContainer}>
      <Input
        style={styles.searchInput}
        textInputConfig={{
          placeholder: placeholder || "Pesquisar...",
          autoCapitalize: "none",
          autoCorrect: false,
          value: value,
          onChangeText: onChangeText,
          onSubmitEditing: onSearch,
          returnKeyType: "search",
        }}
      />
      <IconButton
        icon="MagnifyingGlass"
        color={GlobalStyles.colors.card}
        textColor={GlobalStyles.colors.primary}
        size={24}
        onPress={onSearch}
        style={styles.searchButton}
      />
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
  },
  searchButton: {
    padding: 8,
  },
});
