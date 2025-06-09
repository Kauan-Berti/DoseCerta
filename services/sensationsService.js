import { supabase } from "./supabase";

export async function fetchSensations() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("sensations")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar sensações:", error);
    throw new Error("Não foi possível buscar as sensações.");
  }

  return data.map((item) => ({
    id: item.id,
    description: item.description,
    category_id: item.category_id,
  }));
}

export async function storeSensation(sensation) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("sensations")
    .insert([
      {
        user_id: userId,
        description: sensation.description,
        category_id: sensation.category_id,
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
    description: data.description,
    category_id: data.category_id,
  };
}

export async function updateSensation(id, sensation) {
  const { data, error } = await supabase
    .from("sensations")
    .update({
      description: sensation.description,
      category_id: sensation.category_id,
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
    description: data.description,
    category_id: data.category_id,
  };
}

export async function deleteSensation(id) {
  const { error } = await supabase.from("sensations").delete().eq("id", id);

  if (error) {
    console.error(`Erro ao excluir sensação com ID ${id}:`, error);
    throw new Error("Não foi possível excluir a sensação.");
  }
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) {
    console.error("Erro ao buscar categorias:", error);
    throw new Error("Não foi possível buscar as categorias.");
  }
  return data.map((item) => ({
    id: item.id,
    name: item.name,
  }));
}
