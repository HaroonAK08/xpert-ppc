import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return Boolean(req.granted);
}

export async function scheduleFollowUpReminder(input: {
  leadId: string;
  leadName: string;
  when: Date;
}) {
  const ok = await ensureNotificationPermission();
  if (!ok) return null;

  if (input.when.getTime() <= Date.now()) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('followups', {
      name: 'Follow-ups',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Follow-up due',
      body: `Follow up with ${input.leadName}`,
      data: { leadId: input.leadId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: input.when,
      channelId: 'followups',
    },
  });
}
