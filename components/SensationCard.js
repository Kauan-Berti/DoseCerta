import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { GlobalStyles } from "../constants/colors";

export default function SensationCard({ sensation, onChange }) {
  const [tempValue, setTempValue] = useState(
    typeof sensation.intensidade === "number" ? sensation.intensidade : 5
  );

  // Atualiza o valor local enquanto desliza
  function handleValueChange(value) {
    setTempValue(value);
  }

  // Só atualiza o global ao soltar o dedo
  function handleSlidingComplete(value) {
    onChange(sensation.id, value);
  }

  // Atualiza o valor local se a prop mudar (ex: ao remover/adicionar sensação)
  React.useEffect(() => {
    setTempValue(
      typeof sensation.intensidade === "number" ? sensation.intensidade : 5
    );
  }, [sensation.intensidade]);
  return (
    <View style={styles.sensationCard}>
      <Text style={styles.sensationName}>{sensation.description}</Text>
      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={sensation.intensidade}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={GlobalStyles.colors.primary}
          maximumTrackTintColor="#eee"
          thumbTintColor={GlobalStyles.colors.primary}
          thumbStyle={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "#fff",
            backgroundColor: GlobalStyles.colors.primary,
          }}
        />
        <View style={styles.intensityBadge}>
          <Text style={styles.intensityBadgeText}>{tempValue}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sensationCard: {
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  sensationName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 14,
    color: GlobalStyles.colors.primary,
    letterSpacing: 0.5,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  intensityBadge: {
    backgroundColor: GlobalStyles.colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    elevation: 2,
  },
  intensityBadgeText: {
    color: GlobalStyles.colors.card,
    fontWeight: "bold",
    fontSize: 18,
  },
  slider: {
    flex: 1,
    height: 50, // aumente a altura
  },
});
