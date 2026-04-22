import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cleanops_user_settings';

export interface UserSettings {
  pushNotifications: boolean;
  emailUpdates: boolean;
  smsAlerts: boolean;
  promos: boolean;
  biometrics: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  pushNotifications: true,
  emailUpdates: true,
  smsAlerts: false,
  promos: false,
  biometrics: false,
};

export async function getSettings(): Promise<UserSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
