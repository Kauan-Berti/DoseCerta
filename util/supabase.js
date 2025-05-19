import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase URL e chave pública
const supabaseUrl = "https://jthcdqnkrwqlclnlljbb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aGNkcW5rcndxbGNsbmxsamJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjM3MDksImV4cCI6MjA2MTkzOTcwOX0.cddBGdIL4xFarhWt3RzzyOUa085vGqd3cuLmI7gtlfU";

// Criação do cliente com suporte a sessão persistente
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // necessário para mobile
  },
});

// -------------------- Autenticação --------------------

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return error ? null : data.session;
};

export const signOut = async () => {
  await supabase.auth.signOut();
  await AsyncStorage.removeItem("authToken");
};

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

// -------------------- Medicamentos --------------------

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

//--------------------- Tratamentos --------------------

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

//--------------------- Alertas --------------------

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

export async function storeMedicationLog(log) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  const alertTimeStamp =
    log.alertTime.length === 5 ? `${log.alertTime}:00` : log.alertTime; // já deve ser 'YYYY-MM-DDTHH:mm:ss'

  const { data, error } = await supabase
    .from("medication_logs")
    .insert([
      {
        user_id: userId,
        treatment_id: log.treatmentId,
        time_taken: new Date().toISOString(), // Data/hora em que o usuário confirmou
        alert_time: alertTimeStamp, // Horário do alerta programado
        notes: log.notes || "",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar log de medicação:", error);
    throw new Error("Não foi possível criar o log de medicação.");
  }
  return data;
}

export async function fetchMedicationLogsForDate(treatmentId, selectedDate) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  // No frontend, para o dia selecionado:
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const startUTC = `${year}-${month}-${day}T00:00:00`;
  const endUTC = `${year}-${month}-${day}T23:59:59.999`;

  // dateStr: 'YYYY-MM-DD'
  const { data, error } = await supabase
    .from("medication_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("treatment_id", treatmentId)
    .gte("alert_time", startUTC)
    .lte("alert_time", endUTC);

  if (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
  console.log("Logs:", data);
  return data;
}

export async function fetchAllMedicationLogs() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("medication_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar todos os logs:", error);
    throw error;
  }
  return data;
}
