// Mobile equivalent of app/employee/dashboard/page.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/authContext';
import { getEmployeeJobs } from '@/app/actions/jobs';
import { signOut } from '@/app/actions/auth';
import { Colors } from '@/constants/colors';
import { StatCard } from '@/components/shared/StatCard';
import { JobCard } from '@/components/shared/JobCard';
import type { Job } from '@/types';

const { width } = Dimensions.get('window');

export default function EmployeeDashboardScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const [jobs,       setJobs]       = useState<Job[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = useCallback(async () => {
    try { setJobs(await getEmployeeJobs()); }
    catch (e) { console.warn(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const firstName     = profile?.full_name?.split(' ')[0] ?? 'Employee';
  const activeJobs    = jobs.filter((j) => j.status === 'IN_PROGRESS');
  const pendingJobs   = jobs.filter((j) => j.status === 'PENDING_REVIEW');
  const completedJobs = jobs.filter((j) => j.status === 'COMPLETED');
  const totalEarnings = completedJobs.reduce((s, j) => s + j.price_amount, 0);

  return (
    <SafeAreaView style={st.safe}>
      <ScrollView
        contentContainerStyle={st.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchJobs(); }}
            tintColor={Colors.blue600}
          />
        }
      >
        <LinearGradient
          colors={['#1565C0', '#1E88E5']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={st.headerCard}
        >
          <View style={st.headerTop}>
            <View>
              <Text style={st.greeting}>Good to see you,</Text>
              <Text style={st.name}>{firstName} 👋</Text>
            </View>
            <TouchableOpacity style={st.signOutBtn} onPress={signOut}>
              <Ionicons name="log-out-outline" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
          <Text style={st.headerSub}>Overview of your work and earnings.</Text>
          {profile?.money_balance !== undefined && (
            <View style={st.balancePill}>
              <Ionicons name="wallet-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={st.balanceText}>
                Balance: <Text style={st.balanceBold}>${Number(profile.money_balance).toFixed(2)}</Text>
              </Text>
            </View>
          )}
        </LinearGradient>

        <View style={st.statsRow}>
          <StatCard label="Active"  value={activeJobs.length}    icon="timer-outline"           color={Colors.blue600} />
          <StatCard label="Pending" value={pendingJobs.length}   icon="hourglass-outline"        color={Colors.warning} />
          <StatCard label="Done"    value={completedJobs.length} icon="checkmark-circle-outline" color={Colors.success} />
        </View>

        {/* Earnings */}
        <View style={st.earningsCard}>
          <View style={st.earningsLeft}>
            <Ionicons name="cash-outline" size={22} color={Colors.success} />
            <View>
              <Text style={st.earningsLabel}>Total Earnings</Text>
              <Text style={st.earningsValue}>${(totalEarnings / 100).toFixed(2)}</Text>
            </View>
          </View>
          <Ionicons name="trending-up-outline" size={28} color={Colors.success} style={{ opacity: 0.4 }} />
        </View>

        {/* Quick actions */}
        <View style={st.section}>
          <Text style={st.sectionTitle}>Quick Actions</Text>
          {[
            { label: 'Browse Available Jobs', icon: 'search-outline' as const, href: '/employee/feed',    color: Colors.blue50,  iconColor: Colors.blue600 },
            { label: 'My Job History',        icon: 'time-outline'   as const, href: '/employee/history', color: '#ECFDF5',      iconColor: Colors.success },
          ].map((a) => (
            <TouchableOpacity
              key={a.label}
              style={st.actionRow}
              onPress={() => router.push(a.href as any)}
              activeOpacity={0.85}
            >
              <View style={[st.actionIcon, { backgroundColor: a.color }]}>
                <Ionicons name={a.icon} size={20} color={a.iconColor} />
              </View>
              <Text style={st.actionLabel}>{a.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.text3} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent activity */}
        <View style={st.section}>
          <Text style={st.sectionTitle}>Recent Activity</Text>
          {loading ? (
            <View style={st.emptyCard}><Text style={st.emptyText}>Loading…</Text></View>
          ) : jobs.length === 0 ? (
            <View style={st.emptyCard}>
              <Ionicons name="briefcase-outline" size={32} color={Colors.text3} />
              <Text style={st.emptyText}>No activity yet</Text>
              <TouchableOpacity onPress={() => router.push('/employee/feed')}>
                <Text style={st.emptyLink}>Browse available jobs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            jobs.slice(0, 3).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => router.push(`/employee/jobs/${job.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: 100 },

  headerCard: { margin: 16, borderRadius: 20, padding: 20 },
  headerTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  greeting:   { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  name:       { fontSize: Math.min(width * 0.056, 22), fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  headerSub:  { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 14 },
  signOutBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  balancePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start',
  },
  balanceText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  balanceBold: { fontWeight: '800', color: '#fff' },

  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 12 },

  earningsCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#ECFDF5', borderRadius: 16, padding: 18,
    marginHorizontal: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  earningsLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  earningsLabel: { fontSize: 12, color: '#065F46', fontWeight: '600' },
  earningsValue: { fontSize: 22, fontWeight: '900', color: '#047857', letterSpacing: -0.5 },

  section:      { paddingHorizontal: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text1, marginBottom: 12 },

  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.divider, marginBottom: 10,
  },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text1 },

  emptyCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 32,
    alignItems: 'center', gap: 8,
    borderWidth: 2, borderColor: Colors.divider, borderStyle: 'dashed',
  },
  emptyText: { fontSize: 14, color: Colors.text3 },
  emptyLink: { fontSize: 14, color: Colors.blue600, fontWeight: '700' },
});
