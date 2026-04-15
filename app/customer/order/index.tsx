import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/themeContext';
import { BookingForm } from '@/components/booking/BookingForm';

export default function CustomerOrderScreen() {
  const router = useRouter();
  const { colors: C } = useTheme();
  return (
    <SafeAreaView style={[st.safe, { backgroundColor: C.bg }]}>
      <View style={[st.header, { backgroundColor: C.surface, borderBottomColor: C.divider }]}>
        <View style={st.headerRow}>
          <TouchableOpacity style={[st.backBtn, { backgroundColor: C.surface2 }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={C.text2} />
          </TouchableOpacity>
          <View style={st.headerText}>
            <Text style={[st.title, { color: C.text1 }]}>Request a Cleaning</Text>
            <Text style={[st.sub, { color: C.text3 }]}>
              Size, location, urgency — then authorize payment. Funds are held in escrow until you approve.
            </Text>
          </View>
        </View>
      </View>
      <BookingForm />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1 },
  header:     { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  headerRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn:    { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  title:      { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  sub:        { fontSize: 12, marginTop: 3, lineHeight: 17 },
});
