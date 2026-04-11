import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../src/context/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import OnboardingHeader from '../../src/components/onboarding/OnboardingHeader';
import { validateEmail, getPasswordStrength } from '../../src/utils/validators';

export default function AccountScreen() {
  const { updateProfile } = useUser();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const strength = getPasswordStrength(password);
  const valid = name.trim().length >= 2 && validateEmail(email) && password.length >= 6 && agreed;

  const handleCreate = async () => {
    if (!valid) return;
    setLoading(true);
    try {
      const username = name.trim().replace(/\s+/g, '_').toLowerCase().slice(0, 20);
      await signUp({ username, email, password });
      await updateProfile({ name: name.trim(), email, onboardingComplete: false });
      router.push('/(onboarding)/generating');
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader step={8} total={8} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Almost there! Set up your account to save your progress.</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Alex Johnson" value={name} onChangeText={setName} autoCapitalize="words" />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput style={styles.input} placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.passRow}>
            <TextInput style={[styles.input, styles.passInput]} placeholder="Min. 6 characters" value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
            <TouchableOpacity onPress={() => setShowPass((p) => !p)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {password.length > 0 && (
            <View style={styles.strengthRow}>
              {[1,2,3,4,5].map((s) => (
                <View key={s} style={[styles.strengthBar, { backgroundColor: s <= strength.score ? strength.color : '#E5E7EB' }]} />
              ))}
              <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.agreeRow} onPress={() => setAgreed((a) => !a)}>
          <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
            {agreed && <Text style={styles.checkTick}>✓</Text>}
          </View>
          <Text style={styles.agreeText}>I agree to the <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, (!valid || loading) && styles.btnDisabled]} onPress={handleCreate} disabled={!valid || loading}>
          <Text style={styles.btnText}>{loading ? 'Creating Account…' : 'Create Account & Continue'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.signinLink}>
          <Text style={styles.signinText}>Already have an account? <Text style={styles.signinBold}>Sign in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 6, marginTop: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 20 },
  field: { marginBottom: 18 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { height: 50, borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB', paddingHorizontal: 14, fontSize: 15, color: '#111827', backgroundColor: '#F9FAFB', flex: 1 },
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  passInput: { flex: 1 },
  eyeBtn: { width: 44, height: 50, alignItems: 'center', justifyContent: 'center' },
  eyeText: { fontSize: 20 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '600', marginLeft: 4, minWidth: 44 },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 28, marginTop: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  checkTick: { color: '#fff', fontSize: 12, fontWeight: '700' },
  agreeText: { flex: 1, fontSize: 13, color: '#6B7280', lineHeight: 20 },
  link: { color: '#2563EB', fontWeight: '600' },
  btn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  btnDisabled: { backgroundColor: '#93C5FD' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  signinLink: { alignItems: 'center' },
  signinText: { fontSize: 14, color: '#6B7280' },
  signinBold: { fontWeight: '700', color: '#2563EB' },
});
