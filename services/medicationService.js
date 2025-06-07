import { supabase } from "./supabase";

export async function fetchMedications() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  console.log("userId", userId);
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar medicamentos:", error);
    throw new Error("Não foi possível buscar os medicamentos.");
  }

  // Converter campos para camelCase
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    amount: item.amount,
    minAmount: item.min_amount,
    form: item.form,
    unit: item.unit,
  }));
}

export async function storeMedication(medication) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("medications")
    .insert([
      {
        user_id: userId,
        name: medication.name,
        amount: medication.amount,
        min_amount: medication.minAmount,
        form: medication.form,
        unit: medication.unit,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar medicamento:", error);
    throw new Error("Não foi possível salvar o medicamento.");
  }

  return {
    id: data.id,
    name: data.name,
    amount: data.amount,
    minAmount: data.min_amount,
    form: data.form,
    unit: data.unit,
  };
}

export async function updateMedication(id, updates) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("medications")
    .update({
      user_id: userId,
      name: updates.name,
      amount: updates.amount,
      min_amount: updates.minAmount,
      form: updates.form,
      unit: updates.unit,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar medicamento com ID ${id}:`, error);
    throw new Error("Não foi possível atualizar o medicamento.");
  }

  return {
    id: data.id,
    name: data.name,
    amount: data.amount,
    minAmount: data.min_amount,
    form: data.form,
    unit: data.unit,
  };
}

export async function deleteMedication(id) {
  const { error } = await supabase.from("medications").delete().eq("id", id);

  if (error) {
    console.error(`Erro ao excluir medicamento com ID ${id}:`, error);
    throw new Error("Não foi possível excluir o medicamento.");
  }
}
