import { supabase } from "./supabase";

export async function fetchAlerts() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", userId)
    .order("time", { ascending: true });

  if (error) {
    console.error("Erro ao buscar alertas:", error);
    throw new Error("Não foi possível buscar os alertas.");
  }

  return data.map((item) => ({
    id: item.id,
    time: item.time,
    dose: item.dose,
    observations: item.observations,
    treatmentId: item.treatment_id,
    days: item.days,
  }));
}

export async function storeAlert(alert) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("alerts")
    .insert([
      {
        user_id: userId,
        time: alert.time,
        dose: alert.dose,
        observations: alert.observations,
        treatment_id: alert.treatmentId,
        days: alert.days,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar alerta:", error);
    throw new Error("Não foi possível criar o alerta.");
  }

  return {
    id: data.id,
    time: data.time,
    dose: data.dose,
    observations: data.observations,
    treatmentId: data.treatment_id,
    days: data.days,
  };
}

export async function updateAlert(id, updates) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("alerts")
    .update({
      user_id: userId,
      time: updates.time,
      dose: updates.dose,
      observations: updates.observations,
      treatment_id: updates.treatmentId,
      days: updates.days,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar alerta com ID ${id}:`, error);
    throw new Error("Não foi possível atualizar o alerta.");
  }

  return {
    id: data.id,
    time: data.time,
    dose: data.dose,
    observations: data.observations,
    treatmentId: data.treatment_id,
    days: data.days,
  };
}

export async function deleteAlert(id) {
  const { error } = await supabase.from("alerts").delete().eq("id", id);

  if (error) {
    console.error(`Erro ao excluir alerta com ID ${id}:`, error);
    throw new Error("Não foi possível excluir o alerta.");
  }
}
