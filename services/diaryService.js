import { supabase } from "./supabase";

export async function fetchDiaries() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  console.log("userId", userId);
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar diarios:", error);
    throw new Error("Não foi possível buscar os diarios.");
  }

  // Converter campos para camelCase
  return data.map((item) => ({
    id: item.id,
    date: item.date,
    content: item.content,
  }));
}

export async function fetchDiaryByDate(date) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  // Garante que só a parte da data (YYYY-MM-DD) será usada
  const dateOnly = date.split("T")[0];
  const startOfDay = `${dateOnly}T00:00:00.000`;
  const endOfDay = `${dateOnly}T23:59:59.999`;

  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startOfDay)
    .lte("date", endOfDay)
    .order("date", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Erro ao buscar diario do dia:", error);
    throw new Error("Não foi possível buscar o diario do dia.");
  }

  if (!data || data.length === 0) return null;

  return {
    id: data[0].id,
    date: data[0].date,
    content: data[0].content,
  };
}

export async function storeDiary(diary) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("diaries")
    .insert([
      {
        user_id: userId,
        date: diary.date,
        content: diary.content,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar diario:", error);
    throw new Error("Não foi possível salvar o diario.");
  }

  return {
    id: data.id,
    date: data.date,
    content: data.content,
  };
}

export async function updateDiary(id, updates) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("diaries")
    .update({
      user_id: userId,
      date: updates.date,
      content: updates.content,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar diario ${id}:`, error);
    throw new Error("Não foi possível atualizar o diario.");
  }

  return {
    id: data.id,
    date: data.date,
    content: data.content,
  };
}

export async function deleteDiary(id) {
  const { error } = await supabase.from("diaries").delete().eq("id", id);

  if (error) {
    console.error(`Erro ao excluir diario ${id}:`, error);
    throw new Error("Não foi possível excluir o diario.");
  }
}

export async function fetchDiariesWithSensations() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("diaries")
    .select(`
      id,
      date,
      content,
      sensation_diaries (
        id,
        intensity,
        sensation_id,
        sensation:sensation_id (
          description
        )
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar diarios:", error);
    throw new Error("Não foi possível buscar os diarios.");
  }

  return data.map((item) => ({
    id: item.id,
    date: item.date,
    content: item.content,
    sensations: (item.sensation_diaries || []).map((sd) => ({
      id: sd.id,
      intensity: sd.intensity,
      description: sd.sensation?.description ?? "",
    })),
  }));
}