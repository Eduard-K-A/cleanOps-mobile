// Mobile equivalent of app/login/page.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView, Dimensions,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signIn } from '@/app/actions/auth';
import { useColors } from '@/lib/themeContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const C = useColors();
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      // navigation handled by _layout.tsx auth listener
    } catch (err: any) {
      Alert.alert('Sign in failed', err.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[st.safe, { backgroundColor: C.surface }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={st.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity style={[st.backBtn, { backgroundColor: C.surface2 }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={C.text2} />
          </TouchableOpacity>

          {/* Brand */}
          <View style={st.brand}>
            <LinearGradient colors={['#1565C0', '#42A5F5']} style={st.brandIcon}>
              <Ionicons name="sparkles" size={18} color="#fff" />
            </LinearGradient>
            <Text style={[st.brandName, { color: C.text1 }]}>CleanOps</Text>
          </View>

          {/* Header */}
          <Text style={[st.title, { color: C.text1 }]}>Welcome back</Text>
          <Text style={[st.sub, { color: C.text3 }]}>
            No account yet?{' '}
            <Link href="/signup" style={[st.link, { color: C.blue600 }]}>Create one free</Link>
          </Text>

          {/* Form */}
          <View style={st.form}>
            {/* Email */}
            <View style={st.field}>
              <Text style={[st.label, { color: C.text2 }]}>EMAIL</Text>
              <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: C.divider }]}>
                <TextInput
                  style={[st.input, { color: C.text1 }]}
                  placeholder="you@example.com"
                  placeholderTextColor={C.text3}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Ionicons name="mail-outline" size={18} color={C.text3} />
              </View>
            </View>

            {/* Password */}
            <View style={st.field}>
              <View style={st.labelRow}>
                <Text style={[st.label, { color: C.text2 }]}>PASSWORD</Text>
                <Text style={[st.forgot, { color: C.text3 }]}>Forgot password?</Text>
              </View>
              <View style={[st.inputRow, { backgroundColor: C.surface2, borderColor: C.divider }]}>
                <TextInput
                  style={[st.input, { color: C.text1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={C.text3}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={C.text3}
                  />
                </TouchableOpacity>
              </View>
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
                : <>
                    <Text style={st.submitText}>Sign in</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
              }
            </TouchableOpacity>

            {/* Divider */}
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
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 8, marginBottom: 28,
  },

  brand:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  brandIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },

  title: { fontSize: Math.min(width * 0.07, 28), fontWeight: '800', letterSpacing: -0.4, marginBottom: 6 },
  sub:   { fontSize: 14, marginBottom: 32 },
  link:  { fontWeight: '700' },

  form: { gap: 0 },

  field:    { marginBottom: 18 },
  label: {
    fontSize: 10, fontWeight: '700',
    letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 8,
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgot:   { fontSize: 12, fontWeight: '500' },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12, paddingHorizontal: 14, height: 50,
    gap: 8,
  },
  input: { flex: 1, fontSize: 15 },

  submitBtn: {
    borderRadius: 14, height: 52,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  submitText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  disabled:   { opacity: 0.55 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 22 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

  nudge: { fontSize: 14, textAlign: 'center' },
});

