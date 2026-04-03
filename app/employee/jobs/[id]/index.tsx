// Mobile equivalent of app/employee/jobs/[id]/page.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getJob, claimJob } from '@/app/actions/jobs';
import { Colors } from '@/constants/colors';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ChatWindow } from '@/components/chat/ChatWindow';
import type { Job } from '@/types';

export default function EmployeeJobDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const [job,      setJob]      = useState<Job | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    getJob(id).then(setJob).catch(console.warn).finally(() => setLoading(false));
  }, [id]);

  async function handleClaim() {
    Alert.alert('Claim Job?', 'You will be assigned and responsible for completing this job.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Claim', onPress: async () => {
        setClaiming(true);
        try {
          await claimJob(id);
          Alert.alert('Claimed! 🎉', 'Go to History to manage this job.', [
            { text: 'View History', onPress: () => router.push('/employee/history') },
          ]);
        } catch (err: any) { Alert.alert('Failed', err.message ?? 'Try again.'); }
        finally { setClaiming(false); }
      }},
    ]);
  }

  if (loading) return (
    <SafeAreaView style={st.safe}><View style={st.center}><ActivityIndicator size="large" color={Colors.blue600} /></View></SafeAreaView>
  );
  if (!job) return (
    <SafeAreaView style={st.safe}><View style={st.center}><Text style={st.errorText}>Job not found</Text></View></SafeAreaView>
  );

  return (
    <SafeAreaView style={st.safe}>
      <View style={st.topBar}>
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text2} />
        </TouchableOpacity>
        <Text style={st.topTitle}>Job Details</Text>
        <TouchableOpacity
          style={[st.chatBtn, showChat && st.chatBtnActive]}
          onPress={() => setShowChat(!showChat)}
        >
          <Ionicons name="chatbubble-outline" size={18} color={showChat ? '#fff' : Colors.blue600} />
        </TouchableOpacity>
      </View>

      {showChat ? (
        <ChatWindow jobId={id} />
      ) : (
        <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
          {/* Price hero */}
          <View style={st.heroCard}>
            <View style={st.heroTop}>
              <Text style={st.jobId}>#{job.id.slice(0, 8).toUpperCase()}</Text>
              <StatusBadge status={job.status} />
            </View>
            <Text style={st.price}>${(job.price_amount / 100).toFixed(2)}</Text>
            <Text style={st.priceNote}>You receive ~85% after platform fee</Text>
            <View style={st.payoutPill}>
              <Ionicons name="cash-outline" size={14} color="#fff" />
              <Text style={st.payoutText}>
                Est. payout: ${((job.price_amount * 0.85) / 100).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View style={st.card}>
            <Text style={st.cardTitle}>Job Info</Text>
            {[
              { icon: 'resize-outline'   as const, label: 'Size',     value: job.size || '—' },
              { icon: 'location-outline' as const, label: 'Location', value: job.location_address || '—' },
              { icon: 'flash-outline'    as const, label: 'Urgency',  value: job.urgency },
              { icon: 'time-outline'     as const, label: 'Posted',   value: new Date(job.created_at).toLocaleString() },
            ].map((row) => (
              <View key={row.label} style={st.detailRow}>
                <Ionicons name={row.icon} size={17} color={Colors.text3} />
                <View style={{ flex: 1 }}>
                  <Text style={st.detailLabel}>{row.label.toUpperCase()}</Text>
                  <Text style={st.detailValue}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {job.tasks?.length > 0 && (
            <View style={st.card}>
              <Text style={st.cardTitle}>Tasks Required</Text>
              <View style={st.tagsWrap}>
                {job.tasks.map((t) => (
                  <View key={t} style={st.tag}>
                    <Ionicons name="checkmark-outline" size={13} color={Colors.blue600} />
                    <Text style={st.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {job.status === 'OPEN' && (
            <TouchableOpacity
              style={[st.claimBtn, claiming && st.disabled]}
              onPress={handleClaim}
              disabled={claiming}
            >
              {claiming
                ? <ActivityIndicator color="#fff" />
                : <><Ionicons name="hand-right-outline" size={20} color="#fff" /><Text style={st.claimBtnText}>Claim this Job</Text></>
              }
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.bg },
  center:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 15, color: Colors.text3 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.divider, backgroundColor: Colors.surface,
  },
  backBtn: { width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 16, fontWeight: '700', color: Colors.text1 },
  chatBtn: { width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.blue50, borderWidth: 1, borderColor: Colors.blue100, alignItems: 'center', justifyContent: 'center' },
  chatBtnActive: { backgroundColor: Colors.blue600, borderColor: Colors.blue600 },
  scroll: { padding: 16, gap: 14, paddingBottom: 36 },
  heroCard: { backgroundColor: Colors.blue800, borderRadius: 16, padding: 20, alignItems: 'center' },
  heroTop:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  jobId:    { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  price:    { fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 4 },
  priceNote:{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 },
  payoutPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  payoutText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.divider, gap: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.text1 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  detailLabel: { fontSize: 10, color: Colors.text3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, color: Colors.text1, fontWeight: '600', marginTop: 2 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.blue50, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  tagText: { fontSize: 13, color: Colors.blue700, fontWeight: '600' },
  claimBtn: { backgroundColor: Colors.blue600, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  claimBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  disabled: { opacity: 0.5 },
});
