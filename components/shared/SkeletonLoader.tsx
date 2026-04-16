import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useColors } from '@/lib/themeContext';

interface Props {
  width?: number;
  widthPercent?: string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({ width, widthPercent = '100%', height = 16, borderRadius = 8, style }: Props) {
  const C       = useColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <View style={[{ width: width ?? undefined, alignSelf: width ? undefined : 'stretch' }, style]}>
      <Animated.View
        style={{ width: width ?? widthPercent as `${number}%`, height, borderRadius, backgroundColor: C.surface2, opacity }}
      />
    </View>
  );
}

// Pre-built card skeleton — matches JobCard dimensions
export function JobCardSkeleton() {
  const C = useColors();
  return (
    <View style={[st.card, { backgroundColor: C.surface, borderColor: C.divider }]}>
      <View style={st.row}>
        <SkeletonBox width={100} height={13} />
        <SkeletonBox width={60}  height={13} />
      </View>
      <SkeletonBox height={13} style={{ marginTop: 12 }} />
      <SkeletonBox width={200} height={13} style={{ marginTop: 8 }} />
      <View style={[st.row, { marginTop: 12 }]}>
        <SkeletonBox width={60} height={24} borderRadius={12} />
        <SkeletonBox width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  row:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
