import { supabase } from "./supabase";

// Função de cadastro
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

// Função de login
export const signIn = async ({ email, password }) => {
  console.log("EMAIL:", email);
  console.log("PASSWORD:", password);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("DATA:", data);
  console.log("ERROR:", error);
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
