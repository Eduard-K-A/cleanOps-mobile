// Mobile equivalent of components/dashboard/QuickStatsRow.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatCard } from '@/components/shared/StatCard';
import { Colors } from '@/constants/colors';

interface Props {
  activeCount:    number;
  pendingCount:   number;
  completedCount: number;
  role?: 'customer' | 'employee';
}

export function QuickStatsRow({ activeCount, pendingCount, completedCount, role = 'customer' }: Props) {
  return (
    <View style={styles.row}>
      <StatCard
        label={role === 'employee' ? 'Active Jobs' : 'Active Orders'}
        value={activeCount}
        icon="timer-outline"
        color={Colors.blue600}
      />
      <StatCard
        label="Pending Review"
        value={pendingCount}
        icon="hourglass-outline"
        color={Colors.warning}
      />
      <StatCard
        label="Completed"
        value={completedCount}
        icon="checkmark-circle-outline"
        color={Colors.success}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
