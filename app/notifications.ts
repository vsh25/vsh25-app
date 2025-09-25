// app/notifications.ts
import * as Notifications from 'expo-notifications';

export async function scheduleDailyReminder(hour: number, minute: number) {
  // Сначала уберём старые, чтобы не плодить дубликаты
  await cancelDailyReminders();

  // Повторяющееся ежедневное уведомление в указанное время
  const id = await Notifications.scheduleNotificationAsync({
    content: { title: 'VSH25', body: 'Время Биопрограммы' },
    trigger: { hour, minute, repeats: true }, // ежедневно в HH:MM
  });
  return id;
}

export async function cancelDailyReminders() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    all.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}