// Mobile equivalent of components/dashboard/RecentActivityFeed.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, STATUS_COLORS } from '@/constants/colors';
import type { Job } from '@/types';

interface Props {
  jobs: Job[];
  role?: 'customer' | 'employee';
  loading?: boolean;
}

export function RecentActivityFeed({ jobs, role = 'customer', loading = false }: Props) {
  const router = useRouter();

  function goToJob(id: string) {
    const base = role === 'employee' ? '/employee/jobs' : '/customer/jobs';
    router.push(`${base}/${id}` as any);
  }

  if (loading) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Loading…</Text>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="document-outline" size={28} color={Colors.text3} />
        <Text style={styles.emptyText}>No recent activity</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {jobs.slice(0, 5).map((job) => {
        const s = STATUS_COLORS[job.status] ?? STATUS_COLORS['OPEN'];
        return (
          <TouchableOpacity key={job.id} style={styles.row} onPress={() => goToJob(job.id)} activeOpacity={0.75}>
            <View style={[styles.dot, { backgroundColor: s.text }]} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowId}>#{job.id.slice(0, 8).toUpperCase()}</Text>
              <Text style={styles.rowStatus} numberOfLines={1}>{s.label}</Text>
            </View>
            <Text style={styles.rowPrice}>${(job.price_amount / 100).toFixed(2)}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.text3} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 2 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 6,
  },
  dot:       { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  rowInfo:   { flex: 1 },
  rowId:     { fontSize: 13, fontWeight: '700', color: Colors.text1 },
  rowStatus: { fontSize: 12, color: Colors.text3, marginTop: 1 },
  rowPrice:  { fontSize: 14, fontWeight: '700', color: Colors.blue700 },

  empty: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14, color: Colors.text3 },
});
