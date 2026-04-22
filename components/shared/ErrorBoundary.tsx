import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/lib/themeContext';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; }

function FallbackUI({ onReset }: { onReset: () => void }) {
  const C = useColors();
  return (
    <View style={[st.container, { backgroundColor: C.bg }]}>
      <Ionicons name="warning-outline" size={52} color={C.text3} />
      <Text style={[st.title, { color: C.text1 }]}>Something went wrong</Text>
      <Text style={[st.sub, { color: C.text3 }]}>An unexpected error occurred. Please try again.</Text>
      <TouchableOpacity style={[st.btn, { backgroundColor: C.blue600 }]} onPress={onReset}>
        <Text style={st.btnText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    return <FallbackUI onReset={() => this.setState({ hasError: false })} />;
  }
}

const st = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  title:     { fontSize: 18, fontWeight: '800' },
  sub:       { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  btn:       { marginTop: 8, borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12 },
  btnText:   { fontSize: 15, fontWeight: '700', color: '#fff' },
});
