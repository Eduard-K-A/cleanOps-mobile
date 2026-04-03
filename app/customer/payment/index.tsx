// Mobile equivalent of app/customer/payment/page.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { getBalance } from '@/app/actions/payments';
import { getCustomerJobs } from '@/app/actions/jobs';
import type { Job } from '@/types';

export default function CustomerPaymentScreen() {
  const router = useRouter();
  const [balance,  setBalance]  = useState<number | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      getBalance(),
      getCustomerJobs(),
    ]).then(([bal, jobs]) => {
      setBalance(bal);
      setRecentJobs(jobs.filter((j) => j.status === 'COMPLETED').slice(0, 5));
    }).catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = recentJobs.reduce((sum, j) => sum + j.price_amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text2} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Payments</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.blue600} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Balance card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>
              ${balance !== null ? Number(balance).toFixed(2) : '0.00'}
            </Text>
            <Text style={styles.balanceSub}>Held securely in your CleanOps wallet</Text>
          </View>

          {/* Summary cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="checkmark-circle-outline" size={22} color={Colors.success} />
              <Text style={styles.summaryValue}>{recentJobs.length}</Text>
              <Text style={styles.summaryLabel}>Completed Jobs</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="cash-outline" size={22} color={Colors.blue600} />
              <Text style={styles.summaryValue}>${(totalSpent / 100).toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Total Spent</Text>
            </View>
          </View>

          {/* Escrow explanation */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How payments work</Text>
            {[
              { icon: 'lock-closed-outline' as const, text: 'When you place an order, funds are held securely in escrow.' },
              { icon: 'eye-outline' as const,         text: 'You review the work before approving payment.' },
              { icon: 'checkmark-circle-outline' as const, text: 'Once you approve, funds are released to the cleaner.' },
            ].map((item) => (
              <View key={item.text} style={styles.infoRow}>
                <Ionicons name={item.icon} size={18} color={Colors.blue600} />
                <Text style={styles.infoText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Recent completed jobs */}
          {recentJobs.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Payments</Text>
              {recentJobs.map((job) => (
                <View key={job.id} style={styles.paymentRow}>
                  <View style={styles.paymentLeft}>
                    <Text style={styles.paymentId}>#{job.id.slice(0, 8).toUpperCase()}</Text>
                    <Text style={styles.paymentDate}>
                      {new Date(job.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={styles.paymentAmount}>−${(job.price_amount / 100).toFixed(2)}</Text>
                    <View style={styles.paidBadge}>
                      <Text style={styles.paidBadgeText}>Paid</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => router.push('/customer/requests' as any)}
          >
            <Text style={styles.viewAllText}>View All Requests</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.blue600} />
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { fontSize: 17, fontWeight: '700', color: Colors.text1 },

  scroll: { padding: 16, gap: 16, paddingBottom: 40 },

  balanceCard: {
    backgroundColor: Colors.blue700, borderRadius: 20, padding: 24, alignItems: 'center', gap: 6,
  },
  balanceLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  balanceValue: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  balanceSub:   { fontSize: 12, color: 'rgba(255,255,255,0.55)' },

  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.divider,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  summaryValue: { fontSize: 20, fontWeight: '800', color: Colors.text1 },
  summaryLabel: { fontSize: 12, color: Colors.text3, fontWeight: '500' },

  infoCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 18, gap: 14,
    borderWidth: 1, borderColor: Colors.divider,
  },
  infoTitle: { fontSize: 15, fontWeight: '800', color: Colors.text1, marginBottom: 2 },
  infoRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText:  { fontSize: 13, color: Colors.text2, flex: 1, lineHeight: 19 },

  section:      { gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.text1 },
  paymentRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.divider,
  },
  paymentLeft:   { gap: 2 },
  paymentId:     { fontSize: 13, fontWeight: '700', color: Colors.text1 },
  paymentDate:   { fontSize: 12, color: Colors.text3 },
  paymentRight:  { alignItems: 'flex-end', gap: 4 },
  paymentAmount: { fontSize: 15, fontWeight: '800', color: Colors.error },
  paidBadge:     { backgroundColor: '#ECFDF5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  paidBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.success },

  viewAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.blue50, borderRadius: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.blue100,
  },
  viewAllText: { fontSize: 14, fontWeight: '700', color: Colors.blue600 },
});
