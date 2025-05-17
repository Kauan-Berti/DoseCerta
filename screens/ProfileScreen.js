import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";
import IconButton from "../components/IconButton";
import { AuthContext } from "../store/auth-context";
import { useContext } from "react";

function ProfileScreen() {

  const authContext = useContext(AuthContext);
  function logoutHandler() {
    authContext.logout();
  }
  return (
    <View style={styles.container}>
      <IconButton
        size={24}
        color={GlobalStyles.colors.primary}
        onPress={logoutHandler}
        title={"Sair"}
        icon="SignOut"
      />
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.background,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.text,
  },
});
