// Mobile equivalent of app/customer/order/page.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { BookingForm } from '@/components/booking/BookingForm';

export default function CustomerOrderScreen() {
  return (
    <SafeAreaView style={st.safe}>
      <View style={st.header}>
        <Text style={st.title}>Request a Cleaning</Text>
        <Text style={st.sub}>
          Size, location, urgency — then authorize payment. Funds are held in escrow until you approve.
        </Text>
      </View>
      <BookingForm />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text1, letterSpacing: -0.3 },
  sub:   { fontSize: 12, color: Colors.text3, marginTop: 3, lineHeight: 17 },
});
