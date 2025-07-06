import { supabase } from "./supabase";

// Função de cadastro
export const signUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

// Função de login
export const signIn = async ({ email, password }) => {
  const payload = { email, password };
  const response = await supabase.auth.signInWithPassword(payload);
  // Se quiser manter compatibilidade:
  const { data, error } = response;
  return { data, error };
};

// Checar sessão
export const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return error ? null : data.session;
};

// Logout
export const signOut = async () => {
  await supabase.auth.signOut();
};

// Refresh token
export async function refreshIdToken() {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw new Error(error.message);
    return data.session.access_token;
  } catch (error) {
    console.error("Erro ao renovar o token:", error);
    throw error;
  }
}

export const insertProfile = async (userId) => {
  const { error } = await supabase.from("profiles").insert([
    {
      id: userId,
      created_at: new Date().toISOString(),
    },
  ]);
  return { error };
};

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

export const updateProfile = async (
  userId,
  { name, gender, height, weight, age }
) => {
  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      gender,
      height,
      weight,
      age,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  return { error };
};

export const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
};

export const deleteAccount = async () => {
  // Obtém o token JWT do usuário autenticado
  const { data, error } = await supabase.auth.getSession();
  const { data: userData } = await supabase.auth.getUser();
  if (error || !data?.session?.access_token || !userData?.user?.id) {
    return { error: error || new Error("Usuário não autenticado") };
  }

  // Chama a Edge Function
  const response = await fetch(
    "https://jthcdqnkrwqlclnlljbb.supabase.co/functions/v1/delete-user-account",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session.access_token}`,
      },
      body: JSON.stringify({ user_id: userData.user.id }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return { error: new Error(errorText) };
  }

  return { error: null };
};
