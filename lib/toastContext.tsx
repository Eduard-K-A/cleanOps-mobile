import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type ToastType = 'success' | 'error' | 'info';

interface Toast { message: string; type: ToastType; }
interface ToastCtx { show: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastCtx>({ show: () => {} });
export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error:   'alert-circle',
  info:    'information-circle',
};
const COLORS: Record<ToastType, string> = {
  success: '#059669',
  error:   '#DC2626',
  info:    '#2563EB',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast]   = useState<Toast | null>(null);
  const opacity             = useRef(new Animated.Value(0)).current;
  const translateY          = useRef(new Animated.Value(-20)).current;
  const timerRef            = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, type: ToastType = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    Animated.parallel([
      Animated.timing(opacity,     { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY,  { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
    timerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 250, useNativeDriver: true }),
      ]).start(() => setToast(null));
    }, 3000);
  }, [opacity, translateY]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            st.container,
            { top: insets.top + 12, opacity, transform: [{ translateY }] },
            { backgroundColor: COLORS[toast.type] },
          ]}
          pointerEvents="none"
        >
          <Ionicons name={ICONS[toast.type]} size={18} color="#fff" />
          <Text style={st.text} numberOfLines={2}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const st = StyleSheet.create({
  container: {
    position: 'absolute', left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 10, elevation: 8, zIndex: 9999,
  },
  text: { flex: 1, fontSize: 14, fontWeight: '600', color: '#fff' },
});
