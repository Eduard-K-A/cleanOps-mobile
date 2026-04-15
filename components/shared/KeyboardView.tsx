import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KeyboardViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  stickyFooter?: React.ReactNode;
}

export function KeyboardView({
  children,
  style,
  contentContainerStyle,
  stickyFooter,
}: KeyboardViewProps) {
  const insets = useSafeAreaInsets();
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    // iOS fires keyboardWill* (before animation) — use LayoutAnimation for smooth sync.
    // Android fires keyboardDid* (after keyboard appears) — no LayoutAnimation needed.
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      if (Platform.OS === 'ios') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      // Subtract insets.bottom because the parent SafeAreaView already pads for
      // the home indicator / nav bar, so we only need the remaining keyboard height.
      setKbHeight(Math.max(e.endCoordinates.height - insets.bottom, 0));
    });

    const hide = Keyboard.addListener(hideEvent, () => {
      if (Platform.OS === 'ios') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setKbHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom]);

  return (
    <View style={[st.container, style]}>
      <ScrollView
        style={st.container}
        contentContainerStyle={[st.scrollContent, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {stickyFooter && (
        <View style={{ marginBottom: kbHeight }}>
          {stickyFooter}
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
