// notificationHelper.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configura o canal de notificação (Android)
export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }
}

// Solicita permissão
export async function registerForNotifications() {
  if (!Device.isDevice) {
    alert("Notificações só funcionam em dispositivos físicos!");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Permissão para notificações não concedida!");
  }
}

// Agenda a notificação
export async function scheduleAlarmNotification(hour: number, minute: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Alarme",
      body: "Hora de acordar! Toque para abrir o app.",
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: false,
    },
  });
}

export async function scheduleNotificationInMinutes(minutes: number) {
  console.log("Notificacao Criada");
  const triggerTime = new Date(Date.now() + minutes * 60 * 1000);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Alarme automático",
      body: `Esta notificação foi agendada para ${minutes} minuto(s) após abrir o app.`,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      year: triggerTime.getFullYear(),
      month: triggerTime.getMonth() + 1, // meses começam em 0
      day: triggerTime.getDate(),
      hour: triggerTime.getHours(),
      minute: triggerTime.getMinutes(),
      second: triggerTime.getSeconds(),
    },
  });
}

export async function   scheduleNotificationInSeconds(seconds: number) {
  console.log("Agendando noticação");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Alarme rápido",
      body: `Esta notificação foi agendada para ${seconds} segundos após abrir o app.`,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    },
  });
}
