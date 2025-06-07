import { supabase } from "./supabase";

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

export async function fetchMedicationLogsInRange(
  treatmentId,
  startDate,
  endDate
) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  const startUTC = `${startDate.getFullYear()}-${String(
    startDate.getMonth() + 1
  ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}T00:00:00`;
  const endUTC = `${endDate.getFullYear()}-${String(
    endDate.getMonth() + 1
  ).padStart(2, "0")}-${String(endDate.getDate()).padStart(
    2,
    "0"
  )}T23:59:59.999`;

  const { data, error } = await supabase
    .from("medication_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("treatment_id", treatmentId)
    .gte("alert_time", startUTC)
    .lte("alert_time", endUTC);

  if (error) {
    console.error("Erro ao buscar logs no intervalo:", error);
    throw error;
  }
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
