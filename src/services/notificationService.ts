import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { WorkoutMode } from "../types/firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function scheduleWorkoutNotification(
  time: string,
  mode: WorkoutMode,
  segmentMode: string
): Promise<string> {
  const [hoursRaw, minutesRaw] = time.split(":").map((value) => Number(value));
  const hours = Number.isFinite(hoursRaw) ? hoursRaw : 8;
  const minutes = Number.isFinite(minutesRaw) ? minutesRaw : 0;

  const trigger = {
    hour: Math.max(0, Math.min(23, hours)),
    minute: Math.max(0, Math.min(59, minutes)),
    repeats: true,
  } as any;

  const title = `Limiter Breaker: ${mode === "full" ? "Full Workout" : mode === "intercalated" ? "Intercalated" : "Super Intercalated"}`;
  const body = `Hora de começar seu treino${segmentMode === "oneByOne" ? " em sequência" : segmentMode === "split" ? " em 4 blocos" : " no seu formato personalizado"}.`;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: false,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
    },
    trigger,
  });

  return notificationId;
}

export async function cancelScheduledNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllWorkoutNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
