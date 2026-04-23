import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Platform, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/themeContext';

// Mock data based on Figma 15:1095
const MOCK_NOTIFS = [
  { id: '1', type: 'URGENT', title: '🚨 Urgent Job Alert!', desc: '"Post-Party Cleanup" posted 3.1 mi away. $150 payout.', time: '1d ago', read: false },
  { id: '2', type: 'URGENT', title: '🚨 Urgent Job Alert!', desc: '"Airbnb Turnover" near you (0.9 mi). $95 payout.', time: '1d ago', read: false },
  { id: '3', type: 'PAYMENT', title: 'Payment Received 💰', desc: '$60.00 deposited for "Regular Weekly Clean". Total balance updated.', time: '7d ago', read: true },
  { id: '4', type: 'URGENT', title: '🚨 Urgent Job Alert!', desc: '"Home Deep Clean" HIGH priority just 0.3 mi away. View details now.', time: '23h ago', read: true },
];

export default function EmployeeNotificationsScreen() {
  const router = useRouter();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const renderItem = ({ item }: { item: typeof MOCK_NOTIFS[0] }) => (
    <TouchableOpacity 
      style={[st.notifCard, { backgroundColor: C.surface, borderColor: item.read ? C.divider : C.blue200 }]}
      activeOpacity={0.7}
    >
      <View style={st.notifIconWrap}>
        <Text style={st.notifEmoji}>{item.type === 'URGENT' ? '🚨' : '💰'}</Text>
      </View>
      <View style={st.notifContent}>
        <View style={st.notifHeader}>
          <Text style={[st.notifTitle, { color: C.text1 }]}>{item.title}</Text>
          {!item.read && <View style={[st.unreadDot, { backgroundColor: '#ef4444' }]} />}
        </View>
        <Text style={[st.notifDesc, { color: C.text2 }]} numberOfLines={2}>{item.desc}</Text>
        <Text style={[st.notifTime, { color: C.text3 }]}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[st.container, { backgroundColor: C.bg }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[st.header, { paddingTop: insets.top + 10, backgroundColor: C.surface, borderBottomColor: C.divider }]}>
        <View style={st.headerTop}>
          <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={C.text1} />
          </TouchableOpacity>
          <View style={st.titleWrap}>
            <Text style={[st.title, { color: C.text1 }]}>Notifications</Text>
            <Text style={[st.subtitle, { color: C.text3 }]}>{notifs.filter(n => !n.read).length} unread</Text>
          </View>
          <TouchableOpacity style={st.markReadBtn} onPress={markAllRead}>
             <Ionicons name="checkmark-done-outline" size={16} color={C.blue600} />
             <Text style={[st.markReadText, { color: C.blue600 }]}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={notifs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={st.listContent}
        ListHeaderComponent={<Text style={[st.sectionTitle, { color: C.text3 }]}>Recent Activity</Text>}
      />
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  titleWrap: { flex: 1, marginLeft: 12 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, fontWeight: '500' },
  markReadBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markReadText: { fontSize: 12, fontWeight: '700' },

  listContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  
  notifCard: { flexDirection: 'row', padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 12, gap: 12 },
  notifIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' },
  notifEmoji: { fontSize: 20 },
  notifContent: { flex: 1, gap: 4 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: 14, fontWeight: '800' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifDesc: { fontSize: 13, lineHeight: 18 },
  notifTime: { fontSize: 11, fontWeight: '500', marginTop: 2 },
});
