import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { updateSettings as updateDBSettings } from '@/actions/profile';

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
    // 1. Try to get from Supabase first
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();
      
      if (!error && profile?.settings) {
        // Sync local storage with DB
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile.settings));
        return profile.settings as UserSettings;
      }
    }

    // 2. Fallback to AsyncStorage
    const localData = await AsyncStorage.getItem(STORAGE_KEY);
    return localData ? JSON.parse(localData) : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  
  // 1. Update AsyncStorage (for speed/offline)
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 2. Update Supabase (for cross-device sync)
  try {
    await updateDBSettings(updated);
  } catch (e) {
    console.warn('Supabase settings sync failed:', e);
    // We don't throw here to keep the app functional offline
  }

  return updated;
}
