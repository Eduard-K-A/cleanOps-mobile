// Mobile equivalent of app/employee/history/page.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert, Modal,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getEmployeeJobs, updateJobStatus } from '@/app/actions/jobs';
import { Colors } from '@/constants/colors';
import { JobCard } from '@/components/shared/JobCard';
import type { Job } from '@/types';

export default function EmployeeHistoryScreen() {
  const router = useRouter();
  const [jobs,        setJobs]        = useState<Job[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [modalVisible,setModalVisible]= useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [proofDesc,   setProofDesc]   = useState('');
  const [proofUrls,   setProofUrls]   = useState(['']);
  const [submitting,  setSubmitting]  = useState(false);

  const fetchJobs = useCallback(async () => {
    try { setJobs(await getEmployeeJobs()); }
    catch (e) { console.warn(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  function openModal(job: Job) {
    setSelectedJob(job);
    setProofDesc('');
    setProofUrls(['']);
    setModalVisible(true);
  }

  function addUrl()                        { setProofUrls((p) => [...p, '']); }
  function updateUrl(i: number, v: string) { setProofUrls((p) => p.map((u, idx) => idx === i ? v : u)); }
  function removeUrl(i: number)            { if (proofUrls.length > 1) setProofUrls((p) => p.filter((_, idx) => idx !== i)); }

  async function submitMarkDone() {
    if (!selectedJob) return;
    const valid = proofUrls.map((u) => u.trim()).filter(Boolean);
    if (valid.length === 0) { Alert.alert('Proof required', 'Add at least one proof URL.'); return; }
    const bad = valid.find((u) => { try { new URL(u); return false; } catch { return true; } });
    if (bad) { Alert.alert('Invalid URL', 'Use a full URL starting with https://'); return; }

    setSubmitting(true);
    try {
      await updateJobStatus(selectedJob.id, 'PENDING_REVIEW', valid, proofDesc);
      setModalVisible(false);
      Alert.alert('Submitted! ✅', "Job sent for customer review. You'll be paid when they approve.");
      fetchJobs();
    } catch (err: any) { Alert.alert('Error', err.message ?? 'Could not submit.'); }
    finally { setSubmitting(false); }
  }

  return (
    <SafeAreaView style={st.safe}>
      <View style={st.header}>
        <Text style={st.title}>Your History</Text>
        <Text style={st.sub}>Jobs you've claimed or completed</Text>
      </View>

      {loading ? (
        <View style={st.center}><ActivityIndicator size="large" color={Colors.blue600} /></View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={st.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchJobs(); }} tintColor={Colors.blue600} />
          }
          ListEmptyComponent={
            <View style={st.empty}>
              <Ionicons name="time-outline" size={48} color={Colors.text3} />
              <Text style={st.emptyTitle}>No jobs yet</Text>
              <Text style={st.emptyDesc}>Claimed jobs will appear here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View>
              <JobCard job={item} onPress={() => router.push(`/employee/jobs/${item.id}`)} />
              {item.status === 'IN_PROGRESS' && (
                <TouchableOpacity style={st.markDoneBtn} onPress={() => openModal(item)}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text style={st.markDoneBtnText}>Mark as Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      {/* Mark Done Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <SafeAreaView style={st.modalSafe}>
            <View style={st.modalHeader}>
              <Text style={st.modalTitle}>Submit Proof of Work</Text>
              <TouchableOpacity style={st.modalClose} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.text2} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={st.modalScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={st.modalDesc}>
                Provide links to photos or a description of the completed work. The customer will review before releasing your payment.
              </Text>

              <Text style={st.fieldLabel}>DESCRIPTION (Optional)</Text>
              <TextInput
                style={st.textarea}
                placeholder="Describe the work you completed…"
                placeholderTextColor={Colors.text3}
                value={proofDesc}
                onChangeText={setProofDesc}
                multiline
                numberOfLines={3}
              />

              <Text style={st.fieldLabel}>PROOF URLs</Text>
              {proofUrls.map((url, i) => (
                <View key={i} style={st.urlRow}>
                  <TextInput
                    style={st.urlInput}
                    placeholder="https://example.com/photo.jpg"
                    placeholderTextColor={Colors.text3}
                    value={url}
                    onChangeText={(v) => updateUrl(i, v)}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                  {proofUrls.length > 1 && (
                    <TouchableOpacity style={st.removeBtn} onPress={() => removeUrl(i)}>
                      <Ionicons name="trash-outline" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity style={st.addUrlBtn} onPress={addUrl}>
                <Ionicons name="add-circle-outline" size={18} color={Colors.blue600} />
                <Text style={st.addUrlText}>Add another URL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[st.submitBtn, submitting && st.disabled]}
                onPress={submitMarkDone}
                disabled={submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" />
                  : <><Ionicons name="send-outline" size={18} color="#fff" /><Text style={st.submitBtnText}>Submit for Review</Text></>
                }
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  title:  { fontSize: 22, fontWeight: '800', color: Colors.text1, letterSpacing: -0.3 },
  sub:    { fontSize: 13, color: Colors.text3, marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list:   { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100 },
  empty:  { alignItems: 'center', paddingTop: 64, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: Colors.text1 },
  emptyDesc:  { fontSize: 14, color: Colors.text3 },
  markDoneBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.success, borderRadius: 12, paddingVertical: 12,
    marginTop: -8, marginBottom: 12,
  },
  markDoneBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  modalSafe:   { flex: 1, backgroundColor: Colors.surface },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text1 },
  modalClose: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  modalScroll: { padding: 20, gap: 10, paddingBottom: 40 },
  modalDesc:   { fontSize: 14, color: Colors.text2, lineHeight: 20, marginBottom: 8 },
  fieldLabel:  { fontSize: 10, fontWeight: '700', color: Colors.text2, letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 8 },
  textarea: {
    backgroundColor: Colors.surface2, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.divider,
    padding: 14, fontSize: 14, color: Colors.text1, minHeight: 90, textAlignVertical: 'top', marginBottom: 16,
  },
  urlRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  urlInput: {
    flex: 1, backgroundColor: Colors.surface2, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.divider, paddingHorizontal: 14, height: 48,
    fontSize: 14, color: Colors.text1,
  },
  removeBtn: {
    width: 40, height: 48, borderRadius: 12, backgroundColor: '#FEF2F2',
    borderWidth: 1, borderColor: '#FECACA', alignItems: 'center', justifyContent: 'center',
  },
  addUrlBtn:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24, paddingVertical: 4 },
  addUrlText:   { fontSize: 14, fontWeight: '600', color: Colors.blue600 },
  submitBtn: {
    backgroundColor: Colors.blue600, borderRadius: 14, height: 52,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  disabled:      { opacity: 0.5 },
});
