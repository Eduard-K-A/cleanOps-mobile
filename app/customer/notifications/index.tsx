import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/themeContext';
import { getCustomerJobs } from '@/actions/jobs';
import { formatTimeAgo } from '@/lib/utils';
import type { Job, JobStatus } from '@/types';

interface AppNotification {
  id: string;
  jobId: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  color: string;
  isRead: boolean;
  timestamp: number;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors: C, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      const data = await getCustomerJobs();
      setJobs(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(new Set(allIds));
  };

  const notifications = useMemo(() => {
    const list: AppNotification[] = [];

    jobs.forEach(job => {
      // 1. Initial Posting Notification
      list.push({
        id: `post-${job.id}`,
        jobId: job.id,
        title: 'Job Posted! 🎉',
        desc: `"${job.size || 'Cleaning Request'}" is now live. Cleaners near you will see it.`,
        time: formatTimeAgo(job.created_at),
        icon: '🧹',
        color: '#0284c7',
        isRead: false,
        timestamp: new Date(job.created_at).getTime(),
      });

      // 2. Assigned Notification
      if (['IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED'].includes(job.status)) {
        list.push({
          id: `assign-${job.id}`,
          jobId: job.id,
          title: 'Worker Assigned!',
          desc: `${job.employee_name || 'A cleaner'} has claimed your job and is on the way.`,
          time: '1d ago', // Mocked relative time for status changes
          icon: '🏃',
          color: '#0284c7',
          isRead: false,
          timestamp: new Date(job.created_at).getTime() + 1000 * 60 * 5, // +5 mins
        });
      }

      // 3. Ready for Review
      if (['PENDING_REVIEW', 'COMPLETED'].includes(job.status)) {
        list.push({
          id: `review-${job.id}`,
          jobId: job.id,
          title: 'Ready for Review ✅',
          desc: `${job.employee_name || 'The cleaner'} submitted proof. Approve to release payment.`,
          time: '2d ago',
          icon: '📸',
          color: '#16a34a',
          isRead: false,
          timestamp: new Date(job.created_at).getTime() + 1000 * 60 * 60, // +1 hour
        });
      }

      // 4. Completed
      if (job.status === 'COMPLETED') {
        list.push({
          id: `paid-${job.id}`,
          jobId: job.id,
          title: 'Payment Released 💰',
          desc: `$${(job.price_amount / 100).toFixed(2)} released for your "${job.size || 'Clean'}".`,
          time: '7d ago',
          icon: '✨',
          color: '#314158',
          isRead: false,
          timestamp: new Date(job.created_at).getTime() + 1000 * 60 * 60 * 2, // +2 hours
        });
      }
    });

    // Sort newest first
    return list
      .map(n => ({ ...n, isRead: readIds.has(n.id) }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [jobs, readIds]);

  const newCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={[st.container, { backgroundColor: C.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#0c4a6e', '#0284c7']}
        style={[st.header, { paddingTop: insets.top + 12 }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={st.headerContent}>
          <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={{ flex: 1 }}>
            <Text style={st.headerTitle}>Notifications</Text>
            <Text style={st.headerSub}>{newCount} unread</Text>
          </View>

          <TouchableOpacity style={st.markReadBtn} onPress={handleMarkAllRead}>
            <Ionicons name="checkmark-done" size={14} color="#fff" />
            <Text style={st.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={st.center}>
          <ActivityIndicator color={C.blue600} size="large" />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[st.scroll, { paddingBottom: insets.bottom + 20 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue600} />}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={st.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={C.text3} />
              <Text style={[st.emptyText, { color: C.text3 }]}>No notifications yet.</Text>
            </View>
          ) : (
            <>
              <Text style={[st.sectionLabel, { color: C.text3 }]}>NEW ({newCount})</Text>
              <View style={st.list}>
                {notifications.map((n) => {
                  // Adaptation for Dark Mode
                  const cardBg = isDark ? C.surface : (n.color === '#16a34a' ? '#f0fdf4' : (n.color === '#0284c7' ? '#e0f2fe' : '#fffbeb'));
                  const borderCol = isDark ? n.color + '40' : (n.color === '#16a34a' ? '#bbf7d0' : (n.color === '#0284c7' ? '#bae6fd' : '#fde68a'));
                  
                  return (
                    <TouchableOpacity
                      key={n.id}
                      style={[st.notifCard, { backgroundColor: cardBg, borderColor: borderCol }]}
                      onPress={() => router.push(`/customer/jobs/${n.jobId}`)}
                    >
                      <View style={[st.iconBox, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                        <Text style={{ fontSize: 18 }}>{n.icon}</Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <View style={st.notifTop}>
                          <Text style={[st.notifTitle, { color: isDark ? C.text1 : n.color }]}>{n.title}</Text>
                          {!n.isRead && <View style={[st.unreadDot, { backgroundColor: n.color }]} />}
                        </View>
                        <Text style={[st.notifDesc, { color: isDark ? C.text2 : '#45556c' }]}>{n.desc}</Text>
                        <Text style={[st.notifTime, { color: C.text3 }]}>{n.time}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  scroll: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  list: {
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  notifTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
