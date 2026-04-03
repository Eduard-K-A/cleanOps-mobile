// Mobile equivalent of app/homepage/page.tsx
// Replaced marketing landing page with a proper mobile welcome screen
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Dimensions, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { icon: 'shield-checkmark-outline' as const, title: 'Vetted Cleaners',    desc: 'Background-checked professionals' },
  { icon: 'location-outline'         as const, title: 'Real-time Tracking', desc: 'Follow your job live' },
  { icon: 'card-outline'             as const, title: 'Pay on Approval',    desc: 'Funds held in escrow until you approve' },
];

const STATS = [
  { num: '4.9★', label: 'Avg. rating' },
  { num: '2k+',  label: 'Jobs done' },
  { num: '98%',  label: 'Satisfaction' },
];

export default function HomepageScreen() {
  const router = useRouter();

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1565C0', '#1976D2', '#42A5F5']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={st.safe}>
        <ScrollView
          contentContainerStyle={st.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

          {/* Brand */}
          <View style={st.brand}>
            <View style={st.brandIcon}>
              <Ionicons name="sparkles" size={22} color="#fff" />
            </View>
            <Text style={st.brandName}>CleanOps</Text>
          </View>

          {/* Hero */}
          <View style={st.hero}>
            <Text style={st.eyebrow}>PROFESSIONAL CLEANING</Text>
            <Text style={st.headline}>Your space,{'\n'}spotless every time.</Text>
            <Text style={st.sub}>
              Book vetted cleaners, track jobs in real time, and approve work before you pay.
            </Text>
          </View>

          {/* Stats bar */}
          <View style={st.statsBar}>
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={st.statItem}>
                  <Text style={st.statNum}>{s.num}</Text>
                  <Text style={st.statLabel}>{s.label}</Text>
                </View>
                {i < STATS.length - 1 && <View style={st.statDivider} />}
              </React.Fragment>
            ))}
          </View>

          {/* Features */}
          <View style={st.features}>
            {FEATURES.map((f) => (
              <View key={f.title} style={st.featureRow}>
                <View style={st.featureIcon}>
                  <Ionicons name={f.icon} size={18} color="#fff" />
                </View>
                <View style={st.featureText}>
                  <Text style={st.featureTitle}>{f.title}</Text>
                  <Text style={st.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* CTA buttons */}
          <View style={st.buttons}>
            <TouchableOpacity
              style={st.primaryBtn}
              onPress={() => router.push('/signup')}
              activeOpacity={0.85}
            >
              <Text style={st.primaryBtnText}>Get started free</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.blue700} />
            </TouchableOpacity>

            <TouchableOpacity
              style={st.secondaryBtn}
              onPress={() => router.push('/login')}
              activeOpacity={0.85}
            >
              <Text style={st.secondaryBtnText}>Sign in to your account</Text>
            </TouchableOpacity>
          </View>

          {/* Trust footer */}
          <View style={st.trust}>
            <View style={st.avatars}>
              {['JR', 'ML', 'AK'].map((initials, i) => (
                <View key={initials} style={[st.avatar, i > 0 && st.avatarOverlap]}>
                  <Text style={st.avatarText}>{initials}</Text>
                </View>
              ))}
            </View>
            <Text style={st.trustText}>
              Trusted by <Text style={st.trustBold}>2,000+</Text> households
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: 'space-between',
    minHeight: height - 60,
  },

  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  brandIcon: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  brandName: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },

  hero: { marginBottom: 28 },
  eyebrow: {
    fontSize: 10, fontWeight: '700', letterSpacing: 2,
    color: 'rgba(255,255,255,0.65)', marginBottom: 12,
  },
  headline: {
    fontSize: Math.min(width * 0.1, 38),
    fontWeight: '800',
    color: '#fff',
    lineHeight: Math.min(width * 0.12, 46),
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },

  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statItem:   { flex: 1, alignItems: 'center' },
  statNum:    { fontSize: 18, fontWeight: '800', color: '#fff' },
  statLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  features:    { gap: 10, marginBottom: 28 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  featureIcon: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 13, fontWeight: '700', color: '#fff' },
  featureDesc:  { fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 1 },

  buttons: { gap: 12, marginBottom: 24 },
  primaryBtn: {
    backgroundColor: '#fff', borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '800', color: Colors.blue700 },
  secondaryBtn: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 14, paddingVertical: 15, alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },

  trust: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  avatars: { flexDirection: 'row' },
  avatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.blue400,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.blue700,
  },
  avatarOverlap: { marginLeft: -8 },
  avatarText:   { fontSize: 9, fontWeight: '800', color: '#fff' },
  trustText:    { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  trustBold:    { fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
});
