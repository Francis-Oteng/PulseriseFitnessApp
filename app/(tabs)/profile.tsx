import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarStreak() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return { date: d, active: i < today.getDay() };
  });

  return (
    <View style={calStyles.container}>
      {days.map((item, index) => (
        <View key={index} style={calStyles.dayCol}>
          <Text style={calStyles.dayLabel}>{DAYS_OF_WEEK[index]}</Text>
          <View style={[calStyles.dayCircle, item.active && calStyles.dayCircleActive]}>
            <Text style={[calStyles.dayNum, item.active && calStyles.dayNumActive]}>
              {item.date.getDate()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const calStyles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', padding: 4 },
  dayCol: { alignItems: 'center', gap: 6 },
  dayLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: { backgroundColor: Colors.brand.white },
  dayNum: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  dayNumActive: { color: Colors.brand.primary },
});

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const menuItems = [
    { icon: '⚙️', label: 'Settings', onPress: () => router.push('/settings') },
    { icon: '🏆', label: 'Achievements', onPress: () => {} },
    { icon: '📊', label: 'Detailed Stats', onPress: () => {} },
    { icon: '🔔', label: 'Notifications', onPress: () => {} },
    { icon: '🔒', label: 'Privacy', onPress: () => {} },
    { icon: '❓', label: 'Help & Support', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
                </Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user?.displayName ?? 'Athlete'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.isOffline && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>Offline Mode</Text>
            </View>
          )}
        </View>

        {/* Weekly Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.card}>
            <CalendarStreak />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsRow}>
            {[
              { label: 'Workouts', value: '24' },
              { label: 'Streak', value: '5 🔥' },
              { label: 'Hours', value: '16h' },
            ].map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
                onPress={item.onPress}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.version}>Pulserise v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  header: { alignItems: 'center', padding: 24, paddingBottom: 16 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: Colors.brand.white },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.brand.cardBackground,
    borderWidth: 3,
    borderColor: Colors.brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: Colors.brand.white, fontSize: 36, fontWeight: '700' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.brand.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadgeText: { fontSize: 12 },
  name: { color: Colors.brand.white, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  email: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  offlineBadge: {
    marginTop: 8,
    backgroundColor: Colors.brand.warning,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  offlineBadgeText: { color: Colors.brand.black, fontSize: 12, fontWeight: '600' },
  section: { padding: 20, paddingTop: 0 },
  sectionTitle: { color: Colors.brand.white, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: Colors.brand.cardBackground, borderRadius: 16, overflow: 'hidden' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', padding: 16 },
  statValue: { color: Colors.brand.white, fontSize: 22, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  menuIcon: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, color: Colors.brand.white, fontSize: 15 },
  menuArrow: { color: 'rgba(255,255,255,0.4)', fontSize: 22 },
  signOutBtn: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.brand.error,
  },
  signOutText: { color: Colors.brand.error, fontSize: 16, fontWeight: '700' },
  version: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 12 },
});
