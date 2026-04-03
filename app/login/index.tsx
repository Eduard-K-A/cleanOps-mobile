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
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
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
    <SafeAreaView style={st.safe}>
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
          <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text2} />
          </TouchableOpacity>

          {/* Brand */}
          <View style={st.brand}>
            <LinearGradient colors={['#1565C0', '#42A5F5']} style={st.brandIcon}>
              <Ionicons name="sparkles" size={18} color="#fff" />
            </LinearGradient>
            <Text style={st.brandName}>CleanOps</Text>
          </View>

          {/* Header */}
          <Text style={st.title}>Welcome back</Text>
          <Text style={st.sub}>
            No account yet?{' '}
            <Link href="/signup" style={st.link}>Create one free</Link>
          </Text>

          {/* Form */}
          <View style={st.form}>
            {/* Email */}
            <View style={st.field}>
              <Text style={st.label}>EMAIL</Text>
              <View style={st.inputRow}>
                <TextInput
                  style={st.input}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.text3}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Ionicons name="mail-outline" size={18} color={Colors.text3} />
              </View>
            </View>

            {/* Password */}
            <View style={st.field}>
              <View style={st.labelRow}>
                <Text style={st.label}>PASSWORD</Text>
                <Text style={st.forgot}>Forgot password?</Text>
              </View>
              <View style={st.inputRow}>
                <TextInput
                  style={st.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.text3}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={Colors.text3}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[st.submitBtn, loading && st.disabled]}
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
              <View style={st.dividerLine} />
              <Text style={st.dividerText}>OR</Text>
              <View style={st.dividerLine} />
            </View>

            <Text style={st.nudge}>
              Don't have an account?{' '}
              <Link href="/signup" style={st.link}>Sign up free</Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.surface },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.surface2,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 8, marginBottom: 28,
  },

  brand:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  brandIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 18, fontWeight: '800', color: Colors.text1, letterSpacing: -0.3 },

  title: { fontSize: Math.min(width * 0.07, 28), fontWeight: '800', color: Colors.text1, letterSpacing: -0.4, marginBottom: 6 },
  sub:   { fontSize: 14, color: Colors.text3, marginBottom: 32 },
  link:  { color: Colors.blue600, fontWeight: '700' },

  form: { gap: 0 },

  field:    { marginBottom: 18 },
  label: {
    fontSize: 10, fontWeight: '700', color: Colors.text2,
    letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 8,
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgot:   { fontSize: 12, color: Colors.text3, fontWeight: '500' },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderWidth: 1.5, borderColor: Colors.divider,
    borderRadius: 12, paddingHorizontal: 14, height: 50,
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, color: Colors.text1 },

  submitBtn: {
    backgroundColor: Colors.blue600, borderRadius: 14, height: 52,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 8,
    shadowColor: Colors.blue600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  submitText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  disabled:   { opacity: 0.55 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.divider },
  dividerText: { fontSize: 11, fontWeight: '700', color: Colors.text3, letterSpacing: 0.8 },

  nudge: { fontSize: 14, color: Colors.text3, textAlign: 'center' },
});
