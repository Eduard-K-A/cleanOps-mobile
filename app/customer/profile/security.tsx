import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/lib/themeContext';
import { getSettings, updateSettings, UserSettings } from '@/stores/settingsStore';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';

export default function SecurityScreen() {
  const router = useRouter();
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  async function toggleBiometrics() {
    if (!settings) return;
    const val = !settings.biometrics;
    const updated = await updateSettings({ biometrics: val });
    setSettings(updated);
  }

  async function handlePasswordReset() {
    if (!profile?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
      if (error) throw error;
      Alert.alert('Success', 'Password reset instructions have been sent to your email.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not initiate password reset.');
    }
  }

  if (!settings) return null;

  return (
    <View style={[st.container, { backgroundColor: C.bg }]}>
      <View style={[st.topBar, { backgroundColor: C.surface, borderBottomColor: C.divider, paddingTop: insets.top }]}>
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={C.text1} />
        </TouchableOpacity>
        <Text style={[st.topTitle, { color: C.text1 }]}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={st.scroll}>
        <Text style={[st.sectionTitle, { color: C.text1 }]}>Authentication</Text>
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
          <TouchableOpacity style={st.row} onPress={handlePasswordReset}>
            <View style={[st.iconWrap, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#ef4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[st.label, { color: C.text1 }]}>Change Password</Text>
              <Text style={[st.sub, { color: C.text3 }]}>Send reset link to your email</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.text3} />
          </TouchableOpacity>

          <View style={[st.row, { borderTopWidth: 1, borderTopColor: C.divider }]}>
            <View style={[st.iconWrap, { backgroundColor: '#f0f9ff' }]}>
              <Ionicons name="finger-print-outline" size={20} color={C.blue600} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[st.label, { color: C.text1 }]}>Enable Biometrics</Text>
              <Text style={[st.sub, { color: C.text3 }]}>Use FaceID or Fingerprint</Text>
            </View>
            <Switch 
              value={settings.biometrics} 
              onValueChange={toggleBiometrics}
              trackColor={{ false: '#cbd5e1', true: C.blue600 }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={[st.sectionTitle, { color: C.text1, marginTop: 32 }]}>Data & Privacy</Text>
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
          <TouchableOpacity style={st.row}>
            <View style={[st.iconWrap, { backgroundColor: '#f8fafc' }]}>
              <Ionicons name="document-text-outline" size={20} color={C.text2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[st.label, { color: C.text1 }]}>Privacy Policy</Text>
              <Text style={[st.sub, { color: C.text3 }]}>How we handle your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.text3} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={st.deleteBtn}>
           <Text style={st.deleteBtnText}>Request Account Deletion</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '800', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 12, marginTop: 2 },
  deleteBtn: { marginTop: 40, padding: 16, alignItems: 'center' },
  deleteBtnText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
});
