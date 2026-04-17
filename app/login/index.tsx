// Mobile equivalent of app/login/page.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Dimensions, Modal,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signIn } from '@/actions/auth';
import { supabase } from '@/lib/supabase';
import { useColors } from '@/lib/themeContext';
import { useToast } from '@/lib/toastContext';

const { width } = Dimensions.get('window');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LoginScreen() {
  const router = useRouter();
  const C = useColors();
  const toast = useToast();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);

  // Field errors
  const [errors, setErrors] = useState<{ email: string; password: string }>({ email: '', password: '' });

  // Forgot password modal
  const [forgotVisible,  setForgotVisible]  = useState(false);
  const [forgotEmail,    setForgotEmail]    = useState('');
  const [forgotLoading,  setForgotLoading]  = useState(false);
  const [forgotEmailErr, setForgotEmailErr] = useState('');

  function validateFields(): boolean {
    const e: typeof errors = { email: '', password: '' };
    if (!email.trim())               e.email    = 'Email is required.';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address.';
    if (!password)                   e.password = 'Password is required.';
    setErrors(e);
    return !e.email && !e.password;
  }

  async function handleLogin() {
    if (!validateFields()) return;
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, password: err.message ?? 'Incorrect email or password.' }));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit() {
    if (!forgotEmail.trim()) { setForgotEmailErr('Email is required.'); return; }
    if (!EMAIL_RE.test(forgotEmail.trim())) { setForgotEmailErr('Enter a valid email address.'); return; }
    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim().toLowerCase());
      if (error) throw error;
      setForgotVisible(false);
      toast.show('Reset link sent. Check your inbox.');
    } catch (err: any) {
      setForgotEmailErr(err.message ?? 'Could not send reset link.');
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <SafeAreaView style={[st.safe, { backgroundColor: C.surface }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <TouchableOpacity style={[st.backBtn, { backgroundColor: C.surface2 }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={C.text2} />
          </TouchableOpacity>

          <View style={st.brand}>
            <LinearGradient colors={['#1565C0', '#42A5F5']} style={st.brandIcon}>
              <Ionicons name="sparkles" size={18} color="#fff" />
            </LinearGradient>
            <Text style={[st.brandName, { color: C.text1 }]}>CleanOps</Text>
          </View>

          <Text style={[st.title, { color: C.text1 }]}>Welcome back</Text>
          <Text style={[st.sub, { color: C.text3 }]}>
            No account yet?{' '}
            <Link href="/signup" style={[st.link, { color: C.blue600 }]}>Create one free</Link>
          </Text>

          <View style={st.form}>
            {/* Email */}
            <View style={st.field}>
              <Text style={[st.label, { color: C.text2 }]}>EMAIL</Text>
              <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: errors.email ? C.error : C.divider }]}>
                <TextInput
                  style={[st.input, { color: C.text1 }]}
                  placeholder="you@example.com"
                  placeholderTextColor={C.text3}
                  value={email}
                  onChangeText={(v) => { setEmail(v); if (errors.email) setErrors((p) => ({ ...p, email: '' })); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Ionicons name="mail-outline" size={18} color={errors.email ? C.error : C.text3} />
              </View>
              {!!errors.email && <Text style={[st.errorText, { color: C.error }]}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={st.field}>
              <View style={st.labelRow}>
                <Text style={[st.label, { color: C.text2 }]}>PASSWORD</Text>
                <TouchableOpacity onPress={() => { setForgotEmail(email); setForgotEmailErr(''); setForgotVisible(true); }}>
                  <Text style={[st.forgot, { color: C.blue600 }]}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: errors.password ? C.error : C.divider }]}>
                <TextInput
                  style={[st.input, { color: C.text1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={C.text3}
                  value={password}
                  onChangeText={(v) => { setPassword(v); if (errors.password) setErrors((p) => ({ ...p, password: '' })); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={errors.password ? C.error : C.text3} />
                </TouchableOpacity>
              </View>
              {!!errors.password && <Text style={[st.errorText, { color: C.error }]}>{errors.password}</Text>}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[st.submitBtn, { backgroundColor: C.blue600, shadowColor: C.blue600 }, loading && st.disabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <><Text style={st.submitText}>Sign in</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></>
              }
            </TouchableOpacity>

            <View style={st.divider}>
              <View style={[st.dividerLine, { backgroundColor: C.divider }]} />
              <Text style={[st.dividerText, { color: C.text3 }]}>OR</Text>
              <View style={[st.dividerLine, { backgroundColor: C.divider }]} />
            </View>

            <Text style={[st.nudge, { color: C.text3 }]}>
              Don't have an account?{' '}
              <Link href="/signup" style={[st.link, { color: C.blue600 }]}>Sign up free</Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal visible={forgotVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={st.modalOverlay} behavior="padding">
          <View style={[st.modalSheet, { backgroundColor: C.surface }]}>
            <View style={[st.modalHeader, { borderBottomColor: C.divider }]}>
              <Text style={[st.modalTitle, { color: C.text1 }]}>Reset Password</Text>
              <TouchableOpacity onPress={() => setForgotVisible(false)}>
                <Ionicons name="close" size={22} color={C.text2} />
              </TouchableOpacity>
            </View>
            <View style={st.modalBody}>
              <Text style={[st.modalDesc, { color: C.text2 }]}>
                Enter your email and we'll send you a link to reset your password.
              </Text>
              <Text style={[st.label, { color: C.text2 }]}>EMAIL</Text>
              <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: forgotEmailErr ? C.error : C.divider }]}>
                <TextInput
                  style={[st.input, { color: C.text1 }]}
                  placeholder="you@example.com"
                  placeholderTextColor={C.text3}
                  value={forgotEmail}
                  onChangeText={(v) => { setForgotEmail(v); if (forgotEmailErr) setForgotEmailErr(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                />
                <Ionicons name="mail-outline" size={18} color={forgotEmailErr ? C.error : C.text3} />
              </View>
              {!!forgotEmailErr && <Text style={[st.errorText, { color: C.error }]}>{forgotEmailErr}</Text>}
              <TouchableOpacity
                style={[st.submitBtn, { backgroundColor: C.blue600 }, forgotLoading && st.disabled]}
                onPress={handleForgotSubmit}
                disabled={forgotLoading}
              >
                {forgotLoading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={st.submitText}>Send Reset Link</Text>
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
  safe:   { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 28 },

  brand:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  brandIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },

  title: { fontSize: Math.min(width * 0.07, 28), fontWeight: '800', letterSpacing: -0.4, marginBottom: 6 },
  sub:   { fontSize: 14, marginBottom: 32 },
  link:  { fontWeight: '700' },

  form: { gap: 0 },
  field: { marginBottom: 18 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgot: { fontSize: 12, fontWeight: '600' },
  errorText: { fontSize: 12, fontWeight: '500', marginTop: 5 },

  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 50, gap: 8 },
  input: { flex: 1, fontSize: 15 },

  submitBtn: { borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  submitText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  disabled:   { opacity: 0.55 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 22 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

  nudge: { fontSize: 14, textAlign: 'center' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet:   { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  modalHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  modalTitle:   { fontSize: 18, fontWeight: '800' },
  modalBody:    { padding: 20, gap: 12, paddingBottom: 36 },
  modalDesc:    { fontSize: 14, lineHeight: 20, marginBottom: 4 },
});
