// Mobile equivalent of app/employee/feed/page.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getOpenJobs, claimJob } from '@/app/actions/jobs';
import { Colors } from '@/constants/colors';
import { JobCard } from '@/components/shared/JobCard';
import type { Job } from '@/types';

export default function EmployeeFeedScreen() {
  const router = useRouter();
  const [jobs,       setJobs]       = useState<Job[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claiming,   setClaiming]   = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try { setJobs(await getOpenJobs()); }
    catch (e) { console.warn(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  async function handleClaim(jobId: string) {
    Alert.alert('Claim Job?', 'You will be assigned to this job and responsible for completing it.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Claim', onPress: async () => {
        setClaiming(jobId);
        try {
          await claimJob(jobId);
          setJobs((prev) => prev.filter((j) => j.id !== jobId));
          Alert.alert('Claimed! 🎉', 'Go to History to manage this job.');
        } catch (err: any) { Alert.alert('Failed', err.message ?? 'Try again.'); }
        finally { setClaiming(null); }
      }},
    ]);
  }

  return (
    <SafeAreaView style={st.safe}>
      <View style={st.header}>
        <View>
          <Text style={st.title}>Available Jobs</Text>
          <Text style={st.sub}>Browse and claim open cleaning jobs</Text>
        </View>
        <TouchableOpacity style={st.refreshBtn} onPress={fetchJobs} disabled={loading}>
          <Ionicons name="refresh-outline" size={20} color={Colors.blue600} style={loading ? { opacity: 0.4 } : {}} />
        </TouchableOpacity>
      </View>

      <View style={st.liveBadge}>
        <View style={st.liveDot} />
        <Text style={st.liveText}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} available</Text>
      </View>

      {loading ? (
        <View style={st.center}>
          <ActivityIndicator size="large" color={Colors.blue600} />
          <Text style={st.loadingText}>Finding jobs near you…</Text>
        </View>
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
              <View style={st.emptyIcon}>
                <Ionicons name="briefcase-outline" size={36} color={Colors.text3} />
              </View>
              <Text style={st.emptyTitle}>No open jobs right now</Text>
              <Text style={st.emptyDesc}>New jobs appear here — pull down to refresh.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push(`/employee/jobs/${item.id}`)}
              showClaim
              isClaiming={claiming === item.id}
              onClaim={() => handleClaim(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8,
  },
  title:  { fontSize: 22, fontWeight: '800', color: Colors.text1, letterSpacing: -0.3 },
  sub:    { fontSize: 13, color: Colors.text3, marginTop: 2 },
  refreshBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.blue50,
    alignItems: 'center', justifyContent: 'center',
  },
  liveBadge:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingBottom: 10 },
  liveDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  liveText:   { fontSize: 13, color: Colors.text3, fontWeight: '500' },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:{ fontSize: 14, color: Colors.text3 },
  list:       { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 100 },
  empty:      { alignItems: 'center', paddingTop: 72, gap: 10 },
  emptyIcon:  { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: Colors.text1 },
  emptyDesc:  { fontSize: 14, color: Colors.text3, textAlign: 'center', paddingHorizontal: 32 },
});
