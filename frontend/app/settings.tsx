import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [metricUnits, setMetricUnits] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'This will delete all your locally stored workout data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Done', 'App data cleared.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Email</Text>
              <Text style={styles.settingValue}>{user?.email}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Display Name</Text>
              <Text style={styles.settingValue}>{user?.displayName}</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingHint}>Workout reminders and updates</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.brand.accent }}
                thumbColor={Colors.brand.white}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Text style={styles.settingLabel}>Sound Effects</Text>
                <Text style={styles.settingHint}>Rest timer and workout audio</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.brand.accent }}
                thumbColor={Colors.brand.white}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
                <Text style={styles.settingHint}>Vibration on interactions</Text>
              </View>
              <Switch
                value={haptics}
                onValueChange={setHaptics}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.brand.accent }}
                thumbColor={Colors.brand.white}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Text style={styles.settingLabel}>Metric Units</Text>
                <Text style={styles.settingHint}>kg and cm (vs lbs and ft)</Text>
              </View>
              <Switch
                value={metricUnits}
                onValueChange={setMetricUnits}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.brand.accent }}
                thumbColor={Colors.brand.white}
              />
            </View>
          </View>
        </View>

        {/* Workout Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Default Rest Time</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>60s</Text>
                <Text style={styles.settingArrow}>›</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Training Days</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>Mon, Wed, Fri</Text>
                <Text style={styles.settingArrow}>›</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Fitness Level</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>Intermediate</Text>
                <Text style={styles.settingArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
              <Text style={styles.settingLabel}>Clear App Data</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteAccount}>
            <Text style={styles.dangerBtnText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { color: Colors.brand.white, fontSize: 24 },
  navTitle: { color: Colors.brand.white, fontSize: 16, fontWeight: '700' },
  section: { padding: 20, paddingTop: 0 },
  sectionTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: Colors.brand.cardBackground, borderRadius: 16, overflow: 'hidden' },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabel: { color: Colors.brand.white, fontSize: 15 },
  settingValue: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  settingHint: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  settingArrow: { color: 'rgba(255,255,255,0.4)', fontSize: 20 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  toggleInfo: { flex: 1 },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 16 },
  dangerBtn: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.brand.error,
  },
  dangerBtnText: { color: Colors.brand.error, fontSize: 15, fontWeight: '600' },
});
