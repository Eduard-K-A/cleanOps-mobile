// Mobile equivalent of components/home/CTABanner.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export function CTABanner() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#1565C0', '#1E88E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <Text style={styles.heading}>Ready for a spotless space?</Text>
      <Text style={styles.sub}>Join 2,000+ happy households using CleanOps.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/signup')} activeOpacity={0.85}>
        <Text style={styles.btnText}>Get Started Free</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.blue700} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16, marginVertical: 8,
    borderRadius: 20, padding: 24, gap: 10, alignItems: 'flex-start',
  },
  heading: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  sub:     { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 18, paddingVertical: 12, marginTop: 6,
  },
  btnText: { fontSize: 14, fontWeight: '800', color: Colors.blue700 },
});
