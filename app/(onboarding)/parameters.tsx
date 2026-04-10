import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

const PARAMS_KEY = '@pulserise_user_params';

export default function ParametersScreen() {
  const router = useRouter();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');

  const handleNext = async () => {
    if (!age || !weight || !height) {
      Alert.alert('Required', 'Please fill in all fields to continue.');
      return;
    }
    await AsyncStorage.setItem(
      PARAMS_KEY,
      JSON.stringify({ age: Number(age), weight: Number(weight), weightUnit, height: Number(height), heightUnit })
    );
    router.push('/(onboarding)/goals');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '25%' }]} />
          </View>
          <Text style={styles.step}>Step 1 of 4</Text>
          <Text style={styles.title}>Your Parameters</Text>
          <Text style={styles.subtitle}>Help us personalize your fitness plan</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor={Colors.brand.grey}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Weight</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter weight"
                placeholderTextColor={Colors.brand.grey}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitBtn, weightUnit === 'kg' && styles.unitBtnActive]}
                  onPress={() => setWeightUnit('kg')}
                >
                  <Text style={[styles.unitText, weightUnit === 'kg' && styles.unitTextActive]}>kg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitBtn, weightUnit === 'lbs' && styles.unitBtnActive]}
                  onPress={() => setWeightUnit('lbs')}
                >
                  <Text style={[styles.unitText, weightUnit === 'lbs' && styles.unitTextActive]}>lbs</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Height</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter height"
                placeholderTextColor={Colors.brand.grey}
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
              />
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitBtn, heightUnit === 'cm' && styles.unitBtnActive]}
                  onPress={() => setHeightUnit('cm')}
                >
                  <Text style={[styles.unitText, heightUnit === 'cm' && styles.unitTextActive]}>cm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitBtn, heightUnit === 'ft' && styles.unitBtnActive]}
                  onPress={() => setHeightUnit('ft')}
                >
                  <Text style={[styles.unitText, heightUnit === 'ft' && styles.unitTextActive]}>ft</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  content: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.brand.white,
    borderRadius: 2,
  },
  step: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.brand.white, marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  form: { gap: 20 },
  field: { gap: 8 },
  label: { color: Colors.brand.white, fontSize: 14, fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 16,
    color: Colors.brand.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  unitBtn: { paddingHorizontal: 14, paddingVertical: 10 },
  unitBtnActive: { backgroundColor: Colors.brand.white },
  unitText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 13 },
  unitTextActive: { color: Colors.brand.primary },
  nextButton: {
    backgroundColor: Colors.brand.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 40,
  },
  nextButtonText: { color: Colors.brand.primary, fontSize: 16, fontWeight: '700' },
});
