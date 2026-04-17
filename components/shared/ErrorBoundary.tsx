import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={st.container}>
        <Ionicons name="warning-outline" size={52} color="#94A3B8" />
        <Text style={st.title}>Something went wrong</Text>
        <Text style={st.sub}>An unexpected error occurred. Please try again.</Text>
        <TouchableOpacity style={st.btn} onPress={() => this.setState({ hasError: false })}>
          <Text style={st.btnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const st = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12, backgroundColor: '#0F172A' },
  title:     { fontSize: 18, fontWeight: '800', color: '#F1F5F9' },
  sub:       { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
  btn:       { marginTop: 8, backgroundColor: '#2563EB', borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12 },
  btnText:   { fontSize: 15, fontWeight: '700', color: '#fff' },
});
