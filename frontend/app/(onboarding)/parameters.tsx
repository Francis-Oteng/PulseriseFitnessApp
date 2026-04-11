import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { useUser } from '@/contexts/UserContext';
import { calculateBMI, getBMICategory, kgToLbs, lbsToKg } from '@/utils/calculations';

const GENDERS = [
  { id: 'male', label: 'Male', icon: '♂' },
  { id: 'female', label: 'Female', icon: '♀' },
  { id: 'other', label: 'Prefer not to say', icon: '—' },
];

export default function ParametersScreen() {
  const { profile, updateProfile } = useUser();
  const [gender, setGender] = useState<string>(profile.gender || 'male');
  const [age, setAge] = useState<number>(profile.age || 25);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [heightCm, setHeightCm] = useState<number>(profile.height?.value || 170);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [weightKg, setWeightKg] = useState<number>(profile.currentWeight?.value || 70);

  const displayWeight = weightUnit === 'kg' ? weightKg : Math.round(kgToLbs(weightKg));
  const displayHeight = heightUnit === 'cm' ? heightCm : Math.round(heightCm / 2.54);

  const bmi = calculateBMI(weightKg, heightCm);
  const bmiCat = getBMICategory(bmi);

  const adjustAge = (d: number) => setAge((a) => Math.max(16, Math.min(80, a + d)));
  const adjustHeight = (d: number) => {
    if (heightUnit === 'cm') setHeightCm((h) => Math.max(100, Math.min(250, h + d)));
    else setHeightCm((h) => Math.max(100, Math.min(250, h + d * 2.54)));
  };
  const adjustWeight = (d: number) => {
    if (weightUnit === 'kg') setWeightKg((w) => Math.max(30, Math.min(300, w + d)));
    else setWeightKg((w) => Math.max(30, Math.min(300, w + d / 2.20462)));
  };

  const handleNext = async () => {
    await updateProfile({
      gender,
      age,
      height: { value: heightCm, unit: 'cm' },
      currentWeight: { value: weightKg, unit: 'kg' },
      bmi,
    });
    router.push('/(onboarding)/schedule');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader step={3} total={8} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Physical Information</Text>

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity key={g.id} style={[styles.genderBtn, gender === g.id && styles.genderBtnActive]} onPress={() => setGender(g.id)}>
              <Text style={styles.genderIcon}>{g.icon}</Text>
              <Text style={[styles.genderLabel, gender === g.id && styles.genderLabelActive]}>{g.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustAge(-1)}><Text style={styles.stepBtnText}>−</Text></TouchableOpacity>
          <Text style={styles.stepValue}>{age} <Text style={styles.stepUnit}>yrs</Text></Text>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustAge(1)}><Text style={styles.stepBtnText}>+</Text></TouchableOpacity>
        </View>

        {/* Height */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.unitToggle}>
            {(['cm', 'ft'] as const).map((u) => (
              <TouchableOpacity key={u} style={[styles.unitBtn, heightUnit === u && styles.unitBtnActive]} onPress={() => setHeightUnit(u)}>
                <Text style={[styles.unitBtnText, heightUnit === u && styles.unitBtnTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustHeight(-1)}><Text style={styles.stepBtnText}>−</Text></TouchableOpacity>
          <Text style={styles.stepValue}>{displayHeight} <Text style={styles.stepUnit}>{heightUnit}</Text></Text>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustHeight(1)}><Text style={styles.stepBtnText}>+</Text></TouchableOpacity>
        </View>

        {/* Weight */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>Current Weight</Text>
          <View style={styles.unitToggle}>
            {(['kg', 'lbs'] as const).map((u) => (
              <TouchableOpacity key={u} style={[styles.unitBtn, weightUnit === u && styles.unitBtnActive]} onPress={() => setWeightUnit(u)}>
                <Text style={[styles.unitBtnText, weightUnit === u && styles.unitBtnTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustWeight(-1)}><Text style={styles.stepBtnText}>−</Text></TouchableOpacity>
          <Text style={styles.stepValue}>{displayWeight} <Text style={styles.stepUnit}>{weightUnit}</Text></Text>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustWeight(1)}><Text style={styles.stepBtnText}>+</Text></TouchableOpacity>
        </View>

        {/* BMI */}
        {bmi && (
          <View style={[styles.bmiCard, { borderLeftColor: bmiCat?.color }]}>
            <Text style={styles.bmiLabel}>Your BMI</Text>
            <Text style={[styles.bmiValue, { color: bmiCat?.color }]}>{bmi} <Text style={styles.bmiCat}>{bmiCat?.label}</Text></Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 24, marginTop: 4 },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  genderBtn: { flex: 1, alignItems: 'center', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', paddingVertical: 14, backgroundColor: '#fff' },
  genderBtnActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  genderIcon: { fontSize: 22, marginBottom: 4 },
  genderLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  genderLabelActive: { color: '#2563EB' },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 8, marginBottom: 24 },
  stepBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  stepBtnText: { fontSize: 24, color: '#2563EB', fontWeight: '700' },
  stepValue: { fontSize: 28, fontWeight: '800', color: '#111827' },
  stepUnit: { fontSize: 14, fontWeight: '400', color: '#9CA3AF' },
  unitToggle: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 2 },
  unitBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  unitBtnActive: { backgroundColor: '#2563EB' },
  unitBtnText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  unitBtnTextActive: { color: '#fff' },
  bmiCard: { borderLeftWidth: 4, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginTop: 4 },
  bmiLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  bmiValue: { fontSize: 22, fontWeight: '800' },
  bmiCat: { fontSize: 14, fontWeight: '600' },
  footer: { padding: 24, paddingBottom: 32 },
  btn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
