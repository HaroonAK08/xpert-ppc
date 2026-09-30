import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
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

/**
 * Requests permission and returns this device's Expo push token, or null if the
 * user declined, this is a simulator/emulator without push support, or the
 * request otherwise fails (e.g. no EAS project id when running outside a dev build).
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'android') {
    // High importance + sound so a new lead shows a heads-up banner even when the app is closed.
    await Notifications.setNotificationChannelAsync('new-leads', {
      name: 'New leads',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const granted = await ensureNotificationPermission();
  if (!granted) return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
  } catch (err) {
    console.warn('[push] Could not get Expo push token:', err);
    return null;
  }
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
