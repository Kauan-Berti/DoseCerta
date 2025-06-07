import { supabase } from "./supabase";

export async function fetchTreatments() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("treatments")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Erro ao buscar tratamentos:", error);
    throw new Error("Não foi possível buscar os tratamentos.");
  }

  return data.map((item) => ({
    id: item.id,
    startDate: item.start_date,
    endDate: item.end_date,
    medicationId: item.medication_id,
    isContinuous: item.is_continuous,
  }));
}

export async function storeTreatment(treatment) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("treatments")
    .insert([
      {
        user_id: userId,
        start_date: treatment.startDate,
        end_date: treatment.endDate,
        medication_id: treatment.medicationId,
        is_continuous: treatment.isContinuous,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar tratamento:", error);
    throw new Error("Não foi possível criar o tratamento.");
  }

  return {
    id: data.id,
    startDate: data.start_date,
    endDate: data.end_date,
    medicationId: data.medication_id,
    isContinuous: data.is_continuous,
  };
}

export async function updateTreatment(id, updates) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("treatments")
    .update({
      user_id: userId,
      start_date: updates.startDate,
      end_date: updates.endDate,
      medication_id: updates.medicationId,
      is_continuous: updates.isContinuous,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar tratamento com ID ${id}:`, error);
    throw new Error("Não foi possível atualizar o tratamento.");
  }

  return {
    id: data.id,
    startDate: data.start_date,
    endDate: data.end_date,
    medicationId: data.medication_id,
    isContinuous: data.is_continuous,
  };
}

export async function deleteTreatment(id) {
  const { error } = await supabase.from("treatments").delete().eq("id", id);

  if (error) {
    console.error(`Erro ao excluir tratamento com ID ${id}:`, error);
    throw new Error("Não foi possível excluir o tratamento.");
  }
}
