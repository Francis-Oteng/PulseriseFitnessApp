import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const BENEFITS = [
  { icon: '🎯', title: 'Personalized Plans', desc: 'Workouts built exactly for your goals and level' },
  { icon: '📈', title: 'Smart Progression', desc: 'Automatically adapts as you get stronger' },
  { icon: '🏆', title: 'Track & Celebrate', desc: 'Earn badges and watch your fitness grow' },
];

export default function WelcomeScreen() {
  return (
    <LinearGradient colors={['#1E40AF', '#2563EB', '#06B6D4']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Logo / Hero */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>P</Text>
            </View>
            <Text style={styles.appName}>PULSERISE</Text>
            <Text style={styles.tagline}>Your personalized fitness journey{'\n'}starts here</Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefits}>
            {BENEFITS.map((b) => (
              <View key={b.title} style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <Text style={styles.benefitEmoji}>{b.icon}</Text>
                </View>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>{b.title}</Text>
                  <Text style={styles.benefitDesc}>{b.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(onboarding)/goals')} activeOpacity={0.85}>
            <Text style={styles.btnText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', paddingVertical: 32 },
  logoSection: { alignItems: 'center', paddingTop: 24 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  appName: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 4, marginBottom: 12 },
  tagline: { fontSize: 17, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 26 },
  benefits: { gap: 16 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 16, gap: 14 },
  benefitIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  benefitEmoji: { fontSize: 22 },
  benefitText: { flex: 1 },
  benefitTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 2 },
  benefitDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 18 },
  btn: { backgroundColor: '#fff', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  btnText: { fontSize: 17, fontWeight: '700', color: '#2563EB' },
  loginLink: { alignItems: 'center', paddingBottom: 8 },
  loginText: { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  loginBold: { fontWeight: '700', color: '#fff' },
});
