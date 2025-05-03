import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/colors";

function ProgressBar({
  progress = 0,
  height = 10,
  color = GlobalStyles.colors.lightYellow,
}) {
  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.progress,
          { width: `${progress}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: GlobalStyles.colors.disabled,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row-reverse",
  },
  progress: {
    height: "100%",
    borderRadius: 5,
  },
});
