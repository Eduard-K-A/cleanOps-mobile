// Mobile equivalent of app/signup/page.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Dimensions,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signUp } from '@/actions/auth';
import { useColors } from '@/lib/themeContext';

const { width } = Dimensions.get('window');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Role = 'customer' | 'employee';

export default function SignupScreen() {
  const router = useRouter();
  const C = useColors();

  const [fullName,     setFullName]     = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [role,         setRole]         = useState<Role>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);

  const [errors, setErrors] = useState<{ name: string; email: string; password: string }>({ name: '', email: '', password: '' });

  function passwordStrength(pw: string): { bars: number; label: string; color: string } {
    if (!pw)           return { bars: 0, label: '',       color: '' };
    if (pw.length < 6) return { bars: 1, label: 'Weak',   color: C.error };
    if (pw.length < 10)return { bars: 2, label: 'Fair',   color: C.warning };
    return               { bars: 3, label: 'Strong', color: C.success };
  }

  const pw = passwordStrength(password);

  function validateFields(): boolean {
    const e: typeof errors = { name: '', email: '', password: '' };
    if (!fullName.trim())              e.name     = 'Full name is required.';
    else if (fullName.trim().length < 2) e.name   = 'Name must be at least 2 characters.';
    if (!email.trim())                 e.email    = 'Email is required.';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address.';
    if (!password)                     e.password = 'Password is required.';
    else if (password.length < 6)      e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return !e.name && !e.email && !e.password;
  }

  async function handleSignup() {
    if (!validateFields()) return;
    setLoading(true);
    try {
      await signUp({ email, password, fullName, role });
    } catch (err: any) {
      const msg: string = err.message ?? 'Sign up failed.';
      if (msg.toLowerCase().includes('email')) {
        setErrors((p) => ({ ...p, email: msg }));
      } else {
        setErrors((p) => ({ ...p, password: msg }));
      }
    } finally {
      setLoading(false);
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

          <Text style={[st.title, { color: C.text1 }]}>Create account</Text>
          <Text style={[st.sub, { color: C.text3 }]}>
            Already have one?{' '}
            <Link href="/login" style={[st.link, { color: C.blue600 }]}>Sign in</Link>
          </Text>

          {/* Role toggle */}
          <View style={st.roleWrap}>
            <Text style={[st.label, { color: C.text2 }]}>I AM A…</Text>
            <View style={[st.roleToggle, { backgroundColor: C.surface2, borderColor: C.divider }]}>
              {(['customer', 'employee'] as Role[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[st.roleBtn, role === r && [st.roleBtnActive, { backgroundColor: C.surface }]]}
                  onPress={() => setRole(r)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={r === 'customer' ? 'person-outline' : 'briefcase-outline'}
                    size={16}
                    color={role === r ? C.blue700 : C.text3}
                  />
                  <Text style={[st.roleBtnText, { color: role === r ? C.blue700 : C.text3 }, role === r && st.roleBtnTextActive]}>
                    {r === 'customer' ? 'Customer' : 'Employee'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={st.form}>
            {/* Full name */}
            <View style={st.field}>
              <Text style={[st.label, { color: C.text2 }]}>FULL NAME</Text>
              <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: errors.name ? C.error : C.divider }]}>
                <TextInput
                  style={[st.input, { color: C.text1 }]}
                  placeholder="John Doe"
                  placeholderTextColor={C.text3}
                  value={fullName}
                  onChangeText={(v) => { setFullName(v); if (errors.name) setErrors((p) => ({ ...p, name: '' })); }}
                  autoCapitalize="words"
                />
                <Ionicons name="person-outline" size={18} color={errors.name ? C.error : C.text3} />
              </View>
              {!!errors.name && <Text style={[st.errorText, { color: C.error }]}>{errors.name}</Text>}
            </View>

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
              <Text style={[st.label, { color: C.text2 }]}>PASSWORD</Text>
              <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: errors.password ? C.error : C.divider }]}>
                <TextInput
                  style={[st.input, { color: C.text1 }]}
                  placeholder="Min. 6 characters"
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

              {/* Strength meter */}
              {password.length > 0 && (
                <View style={st.strengthRow}>
                  <View style={st.strengthBars}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={[st.strengthBar, { backgroundColor: C.divider }, i < pw.bars && { backgroundColor: pw.color }]} />
                    ))}
                  </View>
                  <Text style={[st.strengthLabel, { color: pw.color }]}>{pw.label}</Text>
                </View>
              )}
              {!!errors.password && <Text style={[st.errorText, { color: C.error }]}>{errors.password}</Text>}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[st.submitBtn, { backgroundColor: C.blue600, shadowColor: C.blue600 }, loading && st.disabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <><Text style={st.submitText}>Create account</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></>
              }
            </TouchableOpacity>

            <Text style={[st.terms, { color: C.text3 }]}>
              By signing up you agree to our{' '}
              <Text style={[st.link, { color: C.blue600 }]}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={[st.link, { color: C.blue600 }]}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 28 },

  brand:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 28 },
  brandIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },

  title: { fontSize: Math.min(width * 0.07, 28), fontWeight: '800', letterSpacing: -0.4, marginBottom: 6 },
  sub:   { fontSize: 14, marginBottom: 24 },
  link:  { fontWeight: '700' },

  roleWrap: { marginBottom: 22 },
  roleToggle: { flexDirection: 'row', borderWidth: 1.5, borderRadius: 12, padding: 4, gap: 4, marginTop: 8 },
  roleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 9 },
  roleBtnActive: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  roleBtnText:       { fontSize: 13, fontWeight: '500' },
  roleBtnTextActive: { fontWeight: '700' },

  form: { gap: 0 },
  field: { marginBottom: 18 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 8 },
  errorText: { fontSize: 12, fontWeight: '500', marginTop: 5 },

  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 50, gap: 8 },
  input: { flex: 1, fontSize: 15 },

  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  strengthBars: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '700', minWidth: 42, textAlign: 'right' },

  submitBtn: { borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  submitText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  disabled:   { opacity: 0.55 },

  terms: { fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 16 },
});
