import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStatusColors } from '@/lib/themeContext';
import type { JobStatus } from '@/types';

interface Props {
  status: JobStatus;
}

export function StatusBadge({ status }: Props) {
  const statusColors = useStatusColors();
  const s = statusColors[status] ?? statusColors['OPEN'];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.text }]} />
      <Text style={[styles.label, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
