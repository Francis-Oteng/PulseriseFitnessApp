import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { exerciseDatabase } from '../../src/data/exercises';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  lower_body: 'Lower Body',
  upper_push: 'Push',
  upper_pull: 'Pull',
  core: 'Core',
  cardio: 'Cardio',
  warmup: 'Warm-up',
  cooldown: 'Cool-down',
};

const DIFF_COLORS: Record<string, string> = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' };

export default function ExerciseLibraryScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    return exerciseDatabase.filter((ex) => {
      const matchesCat = activeCategory === 'all' || ex.category === activeCategory;
      const matchesSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Exercise Library</Text>
        <View style={{ width: 36 }} />
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search exercises…"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#9CA3AF"
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catBar} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <TouchableOpacity key={key} style={[styles.catBtn, activeCategory === key && styles.catBtnActive]} onPress={() => setActiveCategory(key)}>
            <Text style={[styles.catBtnText, activeCategory === key && styles.catBtnTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultCount}>{filtered.length} exercises</Text>
        {filtered.map((ex) => (
          <View key={ex.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.exName}>{ex.name}</Text>
              <Text style={styles.exMuscles}>{ex.muscleGroups?.primary?.join(', ')}</Text>
              <View style={styles.tagRow}>
                <View style={[styles.diffTag, { backgroundColor: DIFF_COLORS[ex.difficulty] + '20' }]}>
                  <Text style={[styles.diffText, { color: DIFF_COLORS[ex.difficulty] }]}>{ex.difficulty}</Text>
                </View>
                <Text style={styles.eqText}>{ex.equipment?.join(', ')}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.defaultReps}>{ex.type === 'timed' ? `${ex.defaultReps}s` : `${ex.defaultReps} reps`}</Text>
              <Text style={styles.sets}>{ex.defaultSets} sets</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 18, color: '#374151' },
  title: { flex: 1, fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center' },
  search: { marginHorizontal: 16, height: 46, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, fontSize: 15, color: '#111827', marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  catBar: { paddingLeft: 16, marginBottom: 8, flexGrow: 0 },
  catBtn: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
  catBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  catBtnText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  catBtnTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  resultCount: { fontSize: 13, color: '#9CA3AF', marginBottom: 8 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  cardLeft: { flex: 1 },
  exName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  exMuscles: { fontSize: 12, color: '#6B7280', marginBottom: 8, textTransform: 'capitalize' },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  diffTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  diffText: { fontSize: 11, fontWeight: '600' },
  eqText: { fontSize: 11, color: '#9CA3AF' },
  cardRight: { alignItems: 'flex-end', justifyContent: 'center', gap: 4 },
  defaultReps: { fontSize: 15, fontWeight: '700', color: '#2563EB' },
  sets: { fontSize: 12, color: '#9CA3AF' },
});
