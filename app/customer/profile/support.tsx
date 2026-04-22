import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/lib/themeContext';

const FAQS = [
  { q: 'How do I book a cleaner?', a: 'Tap the "+" Book button in the bottom navigation. Choose your service type, specific tasks, and schedule. Your funds will be held in escrow until the job is done.' },
  { q: 'Can I cancel a booking?', a: 'Yes, you can cancel any job that is still in the "OPEN" status. Go to My Jobs, select the request, and tap "Cancel". Your funds will be automatically refunded to your wallet.' },
  { q: 'How does the hiring process work?', a: 'Once you post a job, interested cleaners will apply. You can view their profiles and ratings in the job details. Tap "Approve & Hire" to select your preferred cleaner.' },
  { q: 'Is my money safe?', a: 'Absolutely. We use a secure escrow system. Your payment is only released to the cleaner after you approve the completed work.' },
  { q: 'What if I am not satisfied?', a: 'If you are unhappy with the service, do not approve the job completion. Contact our support immediately via the "Contact Us" button below.' },
];

export default function SupportScreen() {
  const router = useRouter();
  const C = useColors();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(null);

  function toggle(idx: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === idx ? null : idx);
  }

  return (
    <View style={[st.container, { backgroundColor: C.bg }]}>
      <View style={[st.topBar, { backgroundColor: C.surface, borderBottomColor: C.divider, paddingTop: insets.top }]}>
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={C.text1} />
        </TouchableOpacity>
        <Text style={[st.topTitle, { color: C.text1 }]}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={st.scroll}>
        <Text style={[st.sectionTitle, { color: C.text1 }]}>Frequently Asked Questions</Text>
        
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
          {FAQS.map((faq, idx) => {
            const isExp = expanded === idx;
            return (
              <TouchableOpacity 
                key={idx} 
                style={[st.faqItem, idx > 0 && { borderTopWidth: 1, borderTopColor: C.divider }]} 
                onPress={() => toggle(idx)}
                activeOpacity={0.7}
              >
                <View style={st.qRow}>
                  <Text style={[st.qText, { color: C.text1 }]}>{faq.q}</Text>
                  <Ionicons name={isExp ? 'chevron-up' : 'chevron-down'} size={18} color={C.text3} />
                </View>
                {isExp && <Text style={[st.aText, { color: C.text3 }]}>{faq.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={st.contactSection}>
          <Text style={[st.contactTitle, { color: C.text1 }]}>Still need help?</Text>
          <Text style={[st.contactSub, { color: C.text3 }]}>Our support team is available 24/7</Text>
          
          <TouchableOpacity style={[st.contactBtn, { backgroundColor: C.blue600 }]}>
            <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
            <Text style={st.contactBtnText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '800', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  faqItem: { padding: 16 },
  qRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  qText: { fontSize: 14, fontWeight: '600', flex: 1 },
  aText: { fontSize: 13, marginTop: 12, lineHeight: 20 },
  contactSection: { alignItems: 'center', marginTop: 40, gap: 8 },
  contactTitle: { fontSize: 18, fontWeight: '800' },
  contactSub: { fontSize: 14, marginBottom: 12 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 },
  contactBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
