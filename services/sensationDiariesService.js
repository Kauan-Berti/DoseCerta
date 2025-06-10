import { supabase } from "./supabase";

export async function fetchSensationDiaries() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("sensation_diaries")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar sensações:", error);
    throw new Error("Não foi possível buscar as sensações.");
  }

  return data.map((item) => ({
    id: item.id,
    sensation_id: item.sensation_id,
    intensity: item.intensity,
    diary_id: item.diary_id,
  }));
}

export async function fetchSensationDiariesByDiaryId(diaryId) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("sensation_diaries")
    .select("*")
    .eq("diary_id", diaryId)
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar sensações:", error);
    throw new Error("Não foi possível buscar as sensações.");
  }

  return data.map((item) => ({
    id: item.id,
    sensation_id: item.sensation_id,
    intensity: item.intensity,
    diary_id: item.diary_id,
  }));
}

export async function storeSensationDiary(sensationDiary) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("sensation_diaries")
    .insert([
      {
        user_id: userId,
        sensation_id: sensationDiary.sensation_id,
        intensity: sensationDiary.intensity,
        diary_id: sensationDiary.diary_id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar sensação:", error);
    throw new Error("Não foi possível criar o sensação.");
  }

  return {
    id: data.id,
    sensation_id: data.sensation_id,
    intensity: data.intensity,
    diary_id: data.diary_id,
  };
}
export async function storeManySensationDiaries(sensationDiaries) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  // Adiciona user_id em cada objeto
  const diariesToInsert = sensationDiaries.map((sd) => ({
    user_id: userId,
    sensation_id: sd.sensation_id,
    intensity: sd.intensity,
    diary_id: sd.diary_id,
  }));

  const { data, error } = await supabase
    .from("sensation_diaries")
    .insert(diariesToInsert)
    .select();

  if (error) {
    console.error("Erro ao criar sensações:", error);
    throw new Error("Não foi possível criar as sensações.");
  }

  // Retorna os registros inseridos
  return data.map((item) => ({
    id: item.id,
    sensation_id: item.sensation_id,
    intensity: item.intensity,
    diary_id: item.diary_id,
  }));
}

export async function updateSensationDiary(id, sensationDiary) {
  const { data, error } = await supabase
    .from("sensation_diaries")
    .update({
      intensity: sensationDiary.intensity,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar sensação com ID ${id}:`, error);
    throw new Error("Não foi possível atualizar a sensação.");
  }

  return {
    id: data.id,
    sensation_id: data.sensation_id,
    intensity: data.intensity,
    diary_id: data.diary_id,
  };
}

export async function updateManySensationDiaries(sensationDiaries) {
  // sensationDiaries: array de objetos { id, intensity }
  const results = [];
  for (const sd of sensationDiaries) {
    const updated = await updateSensationDiary(sd.id, {
      intensity: sd.intensity,
    });
    results.push(updated);
  }
  return results;
}

export async function deleteSensationDiary(id) {
  const { error } = await supabase
    .from("sensation_diaries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Erro ao excluir sensação com ID ${id}:`, error);
    throw new Error("Não foi possível excluir a sensação.");
  }
}
