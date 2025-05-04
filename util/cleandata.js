import AsyncStorage from "@react-native-async-storage/async-storage";

export async function cleanOldData() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log("Chaves armazenadas:", keys);

    // Exemplo: Remover chaves específicas da versão antiga
    const oldKeys = ["authToken", "oldDataKey"]; // Chaves antigas
    for (const key of oldKeys) {
      await AsyncStorage.removeItem(key);
      console.log(`Item ${key} removido.`);
    }
  } catch (error) {
    console.error("Erro ao limpar dados antigos do AsyncStorage:", error);
  }
}
