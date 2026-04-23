import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/lib/themeContext';

export default function AlertSettingsScreen() {
  const router = useRouter();
  const C = useColors();
  const insets = useSafeAreaInsets();
  
  const [notifs, setNotifs] = useState({
    push: true,
    sms: false,
    email: true,
    marketing: false,
    urgent: true,
  });

  const toggle = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={[st.container, { backgroundColor: C.bg }]}>
      <View style={[st.topBar, { backgroundColor: C.surface, borderBottomColor: C.divider, paddingTop: insets.top }]}>
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={C.text1} />
        </TouchableOpacity>
        <Text style={[st.topTitle, { color: C.text1 }]}>Alert Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={st.scroll}>
        <Text style={[st.sectionTitle, { color: C.text1 }]}>Job Alerts</Text>
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
          <View style={st.row}>
            <View style={{ flex: 1 }}>
              <Text style={[st.label, { color: C.text1 }]}>Push Notifications</Text>
              <Text style={[st.sub, { color: C.text3 }]}>Real-time alerts for new jobs</Text>
            </View>
            <Switch 
              value={notifs.push} 
              onValueChange={() => toggle('push')}
              trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
              thumbColor="#fff"
            />
          </View>
          <View style={[st.row, { borderTopWidth: 1, borderTopColor: C.divider }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.label, { color: C.text1 }]}>Urgent Dispatches</Text>
              <Text style={[st.sub, { color: C.text3 }]}>Bypass silent mode for high-priority jobs</Text>
            </View>
            <Switch 
              value={notifs.urgent} 
              onValueChange={() => toggle('urgent')}
              trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={[st.sectionTitle, { color: C.text1, marginTop: 32 }]}>Other Channels</Text>
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
          <View style={st.row}>
            <View style={{ flex: 1 }}>
              <Text style={[st.label, { color: C.text1 }]}>SMS Alerts</Text>
              <Text style={[st.sub, { color: C.text3 }]}>Backup alerts via text message</Text>
            </View>
            <Switch 
              value={notifs.sms} 
              onValueChange={() => toggle('sms')}
              trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
              thumbColor="#fff"
            />
          </View>
          <View style={[st.row, { borderTopWidth: 1, borderTopColor: C.divider }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.label, { color: C.text1 }]}>Email Summary</Text>
              <Text style={[st.sub, { color: C.text3 }]}>Weekly earnings and performance summary</Text>
            </View>
            <Switch 
              value={notifs.email} 
              onValueChange={() => toggle('email')}
              trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity style={[st.saveBtn, { backgroundColor: '#22c55e' }]} onPress={() => router.back()}>
           <Text style={st.saveBtnText}>Update Alert Settings</Text>
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
  label: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 12, marginTop: 2 },
  saveBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
