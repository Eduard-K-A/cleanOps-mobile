import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = 'Loading…' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.blue600} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.bg,
  },
  text: {
    fontSize: 14,
    color: Colors.text3,
    fontWeight: '500',
  },
});
