import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/themeContext';
import { BookingForm } from '@/components/booking/BookingForm';

/**
 * CustomerOrderScreen
 * 
 * This screen displays the full-screen booking flow.
 * Header and navigation are managed within the BookingForm component 
 * to allow for a custom native blue gradient header as per Figma designs.
 */
export default function CustomerOrderScreen() {
  const { colors: C } = useTheme();
  
  return (
    <SafeAreaView style={[st.safe, { backgroundColor: C.bg }]} edges={['bottom']}>
      <BookingForm />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1 },
});
