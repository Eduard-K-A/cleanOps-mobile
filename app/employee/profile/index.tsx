import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/authContext';
import { useColors, useTheme } from '@/lib/themeContext';
import { updateProfile } from '@/app/actions/profile';
import { withdraw } from '@/app/actions/payments';

export default function EmployeeProfileScreen() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const C = useColors();
  const { colorMode, setColorMode } = useTheme();

  const [name,   setName]   = useState(profile?.full_name ?? '');
  const [phone,  setPhone]  = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  async function handleSave() {
    if (!name.trim()) { Alert.alert('Required', 'Name cannot be empty.'); return; }

    // Philippines Phone Validation: 09XXXXXXXXX or +639XXXXXXXXX
    const phPhoneRegex = /^(09|\+639)\d{9}$/;
    if (phone && !phPhoneRegex.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Invalid Phone', 'Please enter a valid PH mobile number (e.g., 09123456789 or +639123456789).');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(name, phone);
      await refreshProfile();
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch (err: any) { Alert.alert('Error', err.message); }
    finally { setSaving(false); }
  }

  async function handleWithdraw() {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }
    setWithdrawing(true);
    try {
      await withdraw(parsed);
      await refreshProfile();
      setModalVisible(false);
      setAmount('');
      Alert.alert('Success', `$${parsed.toFixed(2)} withdrawn from your earnings.`);
    } catch (err: any) {
      Alert.alert('Failed', err.message ?? 'Withdrawal failed. Try again.');
    } finally {
      setWithdrawing(false);
    }
  }

  const themeOptions: { label: string; value: 'light' | 'dark' | 'system'; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Light',  value: 'light',  icon: 'sunny-outline' },
    { label: 'Dark',   value: 'dark',   icon: 'moon-outline' },
    { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
  ];

  return (
    <SafeAreaView style={[st.safe, { backgroundColor: C.bg }]}>
      <View style={[st.topBar, { backgroundColor: C.surface, borderBottomColor: C.divider }]}>
        <TouchableOpacity style={[st.backBtn, { backgroundColor: C.surface2 }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={C.text2} />
        </TouchableOpacity>
        <Text style={[st.topTitle, { color: C.text1 }]}>My Profile</Text>
        <View style={{ width: 38 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
      >
        <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
          <View style={[st.avatarWrap, { backgroundColor: C.success }]}>
            <Text style={st.avatarText}>{(profile?.full_name ?? 'E')[0].toUpperCase()}</Text>
          </View>
          <Text style={[st.roleBadge, { color: C.text3 }]}>Employee Account</Text>

          <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
            <Text style={[st.cardTitle, { color: C.text1 }]}>Account Info</Text>
            <View style={[st.infoRow, { borderTopWidth: 0, paddingTop: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[st.infoLabel, { color: C.text3 }]}>Earnings Balance</Text>
                <Text style={[st.balanceValue, { color: C.text1 }]}>${Number(profile?.money_balance ?? 0).toFixed(2)}</Text>
              </View>
              <TouchableOpacity 
                style={[st.withdrawBtn, { backgroundColor: C.blue600 }]} 
                onPress={() => setModalVisible(true)}
              >
                <Text style={st.withdrawBtnText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
            <View style={[st.infoRow, { borderTopColor: C.divider }]}>
              <Text style={[st.infoLabel, { color: C.text3 }]}>Rating</Text>
              <Text style={[st.infoValue, { color: C.text1 }]}>{profile?.rating ? `${profile.rating} ★` : 'No rating yet'}</Text>
            </View>
          </View>

          <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
            <Text style={[st.cardTitle, { color: C.text1 }]}>Edit Profile</Text>
            
            <Text style={[st.fieldLabel, { color: C.text2 }]}>FULL NAME</Text>
            <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: C.divider, marginBottom: 12 }]}>
              <TextInput
                style={[st.input, { color: C.text1 }]}
                placeholder="Your full name"
                placeholderTextColor={C.text3}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <Ionicons name="person-outline" size={18} color={C.text3} />
            </View>

            <Text style={[st.fieldLabel, { color: C.text2 }]}>PHONE NUMBER</Text>
            <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: C.divider }]}>
              <TextInput
                style={[st.input, { color: C.text1 }]}
                placeholder="0912 345 6789"
                placeholderTextColor={C.text3}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Ionicons name="call-outline" size={18} color={C.text3} />
            </View>

            <TouchableOpacity
              style={[st.saveBtn, { backgroundColor: C.success }, saving && st.disabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={st.saveBtnText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>

          <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
            <Text style={[st.cardTitle, { color: C.text1 }]}>Appearance</Text>
            <View style={st.themeRow}>
              {themeOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[st.themeBtn, { borderColor: colorMode === opt.value ? C.blue600 : C.divider, backgroundColor: colorMode === opt.value ? C.blue50 : C.surface2 }]}
                  onPress={() => setColorMode(opt.value)}
                >
                  <Ionicons name={opt.icon} size={20} color={colorMode === opt.value ? C.blue600 : C.text3} />
                  <Text style={[st.themeBtnText, { color: colorMode === opt.value ? C.blue600 : C.text3 }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Withdrawal Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          style={st.modalOverlay} 
          behavior="padding"
        >
          <View style={[st.modalSheet, { backgroundColor: C.surface }]}>
            <View style={[st.modalHeader, { borderBottomColor: C.divider }]}>
              <Text style={[st.modalTitle, { color: C.text1 }]}>Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={C.text2} />
              </TouchableOpacity>
            </View>
            <View style={st.modalBody}>
              <Text style={[st.fieldLabel, { color: C.text2 }]}>AMOUNT (USD)</Text>
              <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: C.divider }]}>
                <Text style={[st.dollarSign, { color: C.text2 }]}>$</Text>
                <TextInput
                  style={[st.input, { color: C.text1, fontSize: 22, fontWeight: '700' }]}
                  placeholder="0.00"
                  placeholderTextColor={C.text3}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>
              <Text style={[st.balanceHint, { color: C.text3 }]}>
                Available for withdrawal: ${Number(profile?.money_balance ?? 0).toFixed(2)}
              </Text>
              <TouchableOpacity
                style={[st.confirmBtn, { backgroundColor: C.success }, withdrawing && st.disabled]}
                onPress={handleWithdraw}
                disabled={withdrawing}
              >
                {withdrawing
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={st.confirmBtnText}>Confirm Withdrawal</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:    { flex: 1 },
  topBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  topTitle:{ fontSize: 17, fontWeight: '700' },
  scroll:  { padding: 16, gap: 16, paddingBottom: 40, alignItems: 'center' },
  avatarWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  avatarText: { fontSize: 30, fontWeight: '800', color: '#fff' },
  roleBadge:  { fontSize: 13, fontWeight: '600', marginTop: 6, marginBottom: 4 },
  card:    { width: '100%', borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  cardTitle:  { fontSize: 15, fontWeight: '800' },
  infoRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1 },
  infoLabel:  { fontSize: 13 },
  infoValue:  { fontSize: 13, fontWeight: '700' },
  balanceValue: { fontSize: 24, fontWeight: '800', marginTop: 2 },
  withdrawBtn:  { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  withdrawBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  inputRow:   { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 50, gap: 8 },
  input:      { flex: 1, fontSize: 15 },
  saveBtn:    { borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  saveBtnText:{ fontSize: 15, fontWeight: '700', color: '#fff' },
  disabled:   { opacity: 0.5 },
  themeRow:   { flexDirection: 'row', gap: 10 },
  themeBtn:   { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  themeBtnText: { fontSize: 12, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet:   { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  modalHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  modalTitle:   { fontSize: 18, fontWeight: '800' },
  modalBody:    { padding: 20, gap: 12, paddingBottom: 36 },
  dollarSign:   { fontSize: 22, fontWeight: '700' },
  balanceHint:  { fontSize: 12, textAlign: 'right', marginTop: -4 },
  confirmBtn:   { borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  confirmBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
