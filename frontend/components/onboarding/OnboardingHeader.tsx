import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  step: number;
  total: number;
  onBack?: () => void;
  light?: boolean;
}

export default function OnboardingHeader({ step, total, onBack, light = false }: Props) {
  const progress = step / total;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={[styles.backIcon, light && styles.lightText]}>←</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={[styles.step, light && styles.lightText]}>Step {step} of {total}</Text>
      </View>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 18, color: '#374151' },
  lightText: { color: 'rgba(255,255,255,0.9)' },
  center: { flex: 1, gap: 4 },
  track: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#2563EB', borderRadius: 3 },
  step: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  spacer: { width: 36 },
});
