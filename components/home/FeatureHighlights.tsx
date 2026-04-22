// Mobile equivalent of components/home/FeatureHighlights.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/themeContext';

export function FeatureHighlights() {
  const { colors: C, isDark } = useTheme();

  const FEATURES = [
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Vetted Professionals',
      desc: 'Every cleaner is background-checked and reviewed.',
      color: C.blue600,
    },
    {
      icon: 'location-outline' as const,
      title: 'Real-Time Tracking',
      desc: 'See your job status update live in the app.',
      color: C.success,
    },
    {
      icon: 'lock-closed-outline' as const,
      title: 'Secure Escrow',
      desc: 'Pay only when you are satisfied with the work.',
      color: C.warning,
    },
    {
      icon: 'star-outline' as const,
      title: 'Top-Rated Cleaners',
      desc: '4.9★ average rating across 2,000+ jobs.',
      color: '#8B5CF6',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: C.text1 }]}>Why CleanOps?</Text>
      <View style={styles.grid}>
        {FEATURES.map((f) => (
          <View key={f.title} style={[styles.card, { backgroundColor: C.surface, borderColor: C.divider, shadowColor: isDark ? '#000' : '#e8edf3' }]}>
            <View style={[styles.iconWrap, { backgroundColor: f.color + '18' }]}>
              <Ionicons name={f.icon} size={22} color={f.color} />
            </View>
            <Text style={[styles.title, { color: C.text1 }]}>{f.title}</Text>
            <Text style={[styles.desc, { color: C.text3 }]}>{f.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8 },
  heading:   { fontSize: 18, fontWeight: '800', marginBottom: 14, letterSpacing: -0.3 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title:    { fontSize: 13, fontWeight: '700' },
  desc:     { fontSize: 12, lineHeight: 17 },
});

