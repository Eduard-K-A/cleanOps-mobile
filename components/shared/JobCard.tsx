import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { StatusBadge } from './StatusBadge';
import type { Job } from '@/types';

const { width } = Dimensions.get('window');

interface Props {
  job: Job;
  onPress: () => void;
  showClaim?: boolean;
  isClaiming?: boolean;
  onClaim?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
}

export function JobCard({
  job,
  onPress,
  showClaim,
  isClaiming,
  onClaim,
  actionLabel,
  onAction,
  actionLoading,
}: Props) {
  const price = (job.price_amount / 100).toFixed(2);
  const hasAction = showClaim || !!actionLabel;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <Text style={styles.jobId}>#{job.id.slice(0, 8).toUpperCase()}</Text>
          <StatusBadge status={job.status} />
        </View>
        <Text style={styles.price}>${price}</Text>
      </View>

      {/* Info row */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={13} color={Colors.text3} />
          <Text style={styles.infoText} numberOfLines={1}>
            {job.location_address || 'Address not set'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="flash-outline" size={13} color={Colors.text3} />
          <Text style={styles.infoText}>{job.urgency}</Text>
        </View>
        {job.size ? (
          <View style={styles.infoItem}>
            <Ionicons name="resize-outline" size={13} color={Colors.text3} />
            <Text style={styles.infoText} numberOfLines={1}>{job.size}</Text>
          </View>
        ) : null}
      </View>

      {/* Tasks */}
      {job.tasks?.length > 0 && (
        <View style={styles.tasksRow}>
          {job.tasks.slice(0, 4).map((t) => (
            <View key={t} style={styles.taskPill}>
              <Text style={styles.taskText}>{t}</Text>
            </View>
          ))}
          {job.tasks.length > 4 && (
            <View style={styles.taskPill}>
              <Text style={styles.taskText}>+{job.tasks.length - 4}</Text>
            </View>
          )}
        </View>
      )}

      {/* Action buttons */}
      {hasAction && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>

          {showClaim && onClaim && (
            <TouchableOpacity
              style={[styles.primaryBtn, isClaiming && styles.disabled]}
              onPress={onClaim}
              disabled={isClaiming}
            >
              <Text style={styles.primaryBtnText}>
                {isClaiming ? 'Claiming…' : 'Claim Job'}
              </Text>
            </TouchableOpacity>
          )}

          {actionLabel && onAction && (
            <TouchableOpacity
              style={[styles.primaryBtn, actionLoading && styles.disabled]}
              onPress={onAction}
              disabled={actionLoading}
            >
              <Text style={styles.primaryBtnText}>
                {actionLoading ? 'Loading…' : actionLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  jobId: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text3,
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.blue700,
    letterSpacing: -0.5,
  },
  infoRow: {
    gap: 6,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text2,
    flex: 1,
  },
  tasksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  taskPill: {
    backgroundColor: Colors.blue50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  taskText: {
    fontSize: 11,
    color: Colors.blue700,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  viewBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.divider,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text2,
  },
  primaryBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.blue600,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  disabled: {
    opacity: 0.45,
  },
});
