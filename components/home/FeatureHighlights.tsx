// Mobile equivalent of components/home/FeatureHighlights.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const FEATURES = [
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Vetted Professionals',
    desc: 'Every cleaner is background-checked and reviewed.',
    color: Colors.blue600,
  },
  {
    icon: 'location-outline' as const,
    title: 'Real-Time Tracking',
    desc: 'See your job status update live in the app.',
    color: Colors.success,
  },
  {
    icon: 'lock-closed-outline' as const,
    title: 'Secure Escrow',
    desc: 'Pay only when you are satisfied with the work.',
    color: Colors.warning,
  },
  {
    icon: 'star-outline' as const,
    title: 'Top-Rated Cleaners',
    desc: '4.9★ average rating across 2,000+ jobs.',
    color: '#8B5CF6',
  },
];

export function FeatureHighlights() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Why CleanOps?</Text>
      <View style={styles.grid}>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: f.color + '18' }]}>
              <Ionicons name={f.icon} size={22} color={f.color} />
            </View>
            <Text style={styles.title}>{f.title}</Text>
            <Text style={styles.desc}>{f.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8 },
  heading:   { fontSize: 18, fontWeight: '800', color: Colors.text1, marginBottom: 14, letterSpacing: -0.3 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title:    { fontSize: 13, fontWeight: '700', color: Colors.text1 },
  desc:     { fontSize: 12, color: Colors.text3, lineHeight: 17 },
});
