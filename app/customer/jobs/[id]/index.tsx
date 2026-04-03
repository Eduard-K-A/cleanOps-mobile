// Mobile equivalent of app/customer/jobs/[id]/page.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getJob, approveJobCompletion, updateJobStatus } from '@/app/actions/jobs';
import { Colors } from '@/constants/colors';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ChatWindow } from '@/components/chat/ChatWindow';
import type { Job } from '@/types';

export default function CustomerJobDetailScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const router    = useRouter();
  const [job,       setJob]       = useState<Job | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [approving, setApproving] = useState(false);
  const [cancelling,setCancelling]= useState(false);
  const [showChat,  setShowChat]  = useState(false);

  useEffect(() => {
    getJob(id).then(setJob).catch(console.warn).finally(() => setLoading(false));
  }, [id]);

  async function handleApprove() {
    Alert.alert('Approve & Release Payment?', 'The cleaner will receive their payment.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: async () => {
        setApproving(true);
        try {
          await approveJobCompletion(id);
          setJob(await getJob(id));
          Alert.alert('Approved!', 'Payment released to the cleaner ✅');
        } catch (err: any) { Alert.alert('Error', err.message); }
        finally { setApproving(false); }
      }},
    ]);
  }

  async function handleCancel() {
    Alert.alert('Cancel Request?', 'This cannot be undone.', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: async () => {
        setCancelling(true);
        try {
          await updateJobStatus(id, 'CANCELLED');
          setJob(await getJob(id));
        } catch (err: any) { Alert.alert('Error', err.message); }
        finally { setCancelling(false); }
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
      {/* Top bar */}
      <View style={st.topBar}>
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text2} />
        </TouchableOpacity>
        <Text style={st.topTitle}>Job Details</Text>
        <TouchableOpacity
          style={[st.chatToggleBtn, showChat && st.chatToggleBtnActive]}
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
            <Text style={st.priceNote}>held in escrow</Text>
          </View>

          {/* Details */}
          <View style={st.card}>
            <Text style={st.cardTitle}>Job Info</Text>
            {[
              { icon: 'resize-outline' as const,   label: 'Size',     value: job.size || '—' },
              { icon: 'location-outline' as const,  label: 'Location', value: job.location_address || '—' },
              { icon: 'flash-outline' as const,     label: 'Urgency',  value: job.urgency },
              { icon: 'time-outline' as const,      label: 'Created',  value: new Date(job.created_at).toLocaleString() },
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

          {/* Tasks */}
          {job.tasks?.length > 0 && (
            <View style={st.card}>
              <Text style={st.cardTitle}>Tasks Requested</Text>
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

          {/* Proof of work */}
          {job.proof_urls && job.proof_urls.length > 0 && (
            <View style={st.card}>
              <Text style={st.cardTitle}>Proof of Work</Text>
              {job.proof_description ? <Text style={st.proofDesc}>{job.proof_description}</Text> : null}
              {job.proof_urls.map((url, i) => (
                <View key={i} style={st.proofUrl}>
                  <Ionicons name="link-outline" size={13} color={Colors.blue600} />
                  <Text style={st.proofUrlText} numberOfLines={1}>{url}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Approve */}
          {job.status === 'PENDING_REVIEW' && (
            <View style={st.reviewCard}>
              <Text style={st.reviewTitle}>Cleaner marked this job as done</Text>
              <Text style={st.reviewDesc}>Review the proof of work above, then approve to release payment.</Text>
              <TouchableOpacity
                style={[st.approveBtn, approving && st.disabled]}
                onPress={handleApprove}
                disabled={approving}
              >
                {approving
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Ionicons name="checkmark-circle" size={18} color="#fff" />
                      <Text style={st.approveBtnText}>Approve & Release Payment</Text>
                    </>
                }
              </TouchableOpacity>
            </View>
          )}

          {/* Cancel */}
          {job.status === 'OPEN' && (
            <TouchableOpacity
              style={[st.cancelBtn, cancelling && st.disabled]}
              onPress={handleCancel}
              disabled={cancelling}
            >
              <Text style={st.cancelBtnText}>{cancelling ? 'Cancelling…' : 'Cancel Request'}</Text>
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
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { fontSize: 16, fontWeight: '700', color: Colors.text1 },
  chatToggleBtn: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: Colors.blue50,
    borderWidth: 1, borderColor: Colors.blue100,
    alignItems: 'center', justifyContent: 'center',
  },
  chatToggleBtnActive: { backgroundColor: Colors.blue600, borderColor: Colors.blue600 },

  scroll: { padding: 16, gap: 14, paddingBottom: 36 },

  heroCard: {
    backgroundColor: Colors.blue700, borderRadius: 16,
    padding: 20, alignItems: 'center',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  jobId:   { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  price:   { fontSize: 38, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  priceNote:{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.divider, gap: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.text1 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  detailLabel: { fontSize: 10, color: Colors.text3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, color: Colors.text1, fontWeight: '600', marginTop: 2 },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.blue50, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  tagText: { fontSize: 13, color: Colors.blue700, fontWeight: '600' },

  proofDesc: { fontSize: 14, color: Colors.text2, lineHeight: 20 },
  proofUrl: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surface2, borderRadius: 8, padding: 10,
  },
  proofUrlText: { flex: 1, fontSize: 13, color: Colors.blue600 },

  reviewCard: {
    backgroundColor: '#FFFBEB', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#FDE68A', gap: 10,
  },
  reviewTitle: { fontSize: 15, fontWeight: '800', color: '#92400E' },
  reviewDesc:  { fontSize: 13, color: '#78350F', lineHeight: 18 },
  approveBtn: {
    backgroundColor: Colors.success, borderRadius: 12, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  approveBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  cancelBtn: {
    borderWidth: 1.5, borderColor: Colors.error, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', backgroundColor: '#FEF2F2',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: Colors.error },
  disabled: { opacity: 0.5 },
});
