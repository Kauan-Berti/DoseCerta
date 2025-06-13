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
