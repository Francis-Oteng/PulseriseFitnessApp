import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

const MOCK_POSTS = [
  {
    id: '1',
    user: { name: 'Sarah K.', avatar: '🧑‍🦰', isVerified: false },
    content: 'Just crushed my first 5K run in under 25 minutes! Six months ago I couldn\'t run for 5 minutes straight 🎉',
    likes: 42,
    comments: 8,
    time: '2h ago',
    tags: ['Running', 'Progress'],
    liked: false,
  },
  {
    id: '2',
    user: { name: 'Marcus T.', avatar: '👨‍🦱', isVerified: true },
    content: 'New PR on deadlift today - 140kg! Remember folks: progressive overload + consistency = results 💪',
    likes: 89,
    comments: 23,
    time: '4h ago',
    tags: ['Powerlifting', 'PR'],
    liked: true,
  },
  {
    id: '3',
    user: { name: 'Emma R.', avatar: '👩', isVerified: false },
    content: 'Completed the 30-day yoga challenge! Flexibility improved massively. Who wants to join me for the next one? 🧘',
    likes: 34,
    comments: 12,
    time: '6h ago',
    tags: ['Yoga', 'Challenge'],
    liked: false,
  },
  {
    id: '4',
    user: { name: 'James O.', avatar: '👨', isVerified: false },
    content: 'Morning workout done before 6am. Early bird gets the gains! Who else is part of the 5am club? 🌅',
    likes: 56,
    comments: 17,
    time: '8h ago',
    tags: ['Morning', 'Motivation'],
    liked: false,
  },
];

export default function CommunityScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [postText, setPostText] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'leaderboard'>('feed');

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handlePost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      user: { name: user?.displayName ?? 'You', avatar: '👤', isVerified: false },
      content: postText.trim(),
      likes: 0,
      comments: 0,
      time: 'Just now',
      tags: [],
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setPostText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect with fellow athletes</Text>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(['feed', 'challenges', 'leaderboard'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' && (
          <>
            {/* Post composer */}
            <View style={styles.composer}>
              <Text style={styles.composerAvatar}>👤</Text>
              <TextInput
                style={styles.composerInput}
                placeholder="Share your fitness journey..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={postText}
                onChangeText={setPostText}
                multiline
                maxLength={280}
              />
              <TouchableOpacity
                style={[styles.postBtn, !postText.trim() && styles.postBtnDisabled]}
                onPress={handlePost}
                disabled={!postText.trim()}
              >
                <Text style={styles.postBtnText}>Post</Text>
              </TouchableOpacity>
            </View>

            {/* Posts */}
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Text style={styles.postAvatar}>{post.user.avatar}</Text>
                  <View style={styles.postUserInfo}>
                    <View style={styles.postNameRow}>
                      <Text style={styles.postName}>{post.user.name}</Text>
                      {post.user.isVerified && <Text style={styles.verified}>✓</Text>}
                    </View>
                    <Text style={styles.postTime}>{post.time}</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                {post.tags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {post.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleLike(post.id)}
                  >
                    <Text style={[styles.actionIcon, post.liked && styles.actionIconLiked]}>
                      {post.liked ? '❤️' : '🤍'}
                    </Text>
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>↗️</Text>
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'challenges' && (
          <View style={styles.challengesContainer}>
            {[
              { name: '30-Day Push-Up Challenge', participants: 1243, daysLeft: 18, emoji: '💪' },
              { name: '5K Running Challenge', participants: 876, daysLeft: 7, emoji: '🏃' },
              { name: '100 Day Fitness Streak', participants: 2100, daysLeft: 65, emoji: '🔥' },
              { name: 'Yoga Every Day', participants: 534, daysLeft: 22, emoji: '🧘' },
            ].map((challenge, index) => (
              <View key={index} style={styles.challengeCard}>
                <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeName}>{challenge.name}</Text>
                  <Text style={styles.challengeMeta}>
                    {challenge.participants.toLocaleString()} participants · {challenge.daysLeft} days left
                  </Text>
                </View>
                <TouchableOpacity style={styles.joinBtn}>
                  <Text style={styles.joinBtnText}>Join</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'leaderboard' && (
          <View style={styles.leaderboardContainer}>
            {[
              { rank: 1, name: 'Alex M.', points: 2840, avatar: '🥇' },
              { rank: 2, name: 'Sophie L.', points: 2650, avatar: '🥈' },
              { rank: 3, name: 'Carlos R.', points: 2490, avatar: '🥉' },
              { rank: 4, name: user?.displayName?.split(' ')[0] ?? 'You', points: 1820, avatar: '👤', isUser: true },
              { rank: 5, name: 'Nina K.', points: 1740, avatar: '👩' },
            ].map((entry) => (
              <View key={entry.rank} style={[styles.leaderRow, (entry as any).isUser && styles.leaderRowUser]}>
                <Text style={styles.leaderRank}>#{entry.rank}</Text>
                <Text style={styles.leaderAvatar}>{entry.avatar}</Text>
                <Text style={[styles.leaderName, (entry as any).isUser && styles.leaderNameUser]}>
                  {entry.name}
                </Text>
                <Text style={styles.leaderPoints}>{entry.points.toLocaleString()} pts</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  header: { padding: 20, paddingTop: 12 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.brand.white },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 4 },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabActive: { backgroundColor: Colors.brand.white },
  tabText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: Colors.brand.primary },
  composer: {
    margin: 16,
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  composerAvatar: { fontSize: 28 },
  composerInput: {
    flex: 1,
    color: Colors.brand.white,
    fontSize: 14,
    minHeight: 40,
    maxHeight: 100,
  },
  postBtn: {
    backgroundColor: Colors.brand.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { color: Colors.brand.primary, fontWeight: '700', fontSize: 13 },
  postCard: {
    backgroundColor: Colors.brand.cardBackground,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
  },
  postHeader: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  postAvatar: { fontSize: 32 },
  postUserInfo: { flex: 1 },
  postNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postName: { color: Colors.brand.white, fontWeight: '700', fontSize: 14 },
  verified: { color: Colors.brand.accent, fontSize: 12 },
  postTime: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  postContent: { color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 20, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  tag: { backgroundColor: 'rgba(74,144,217,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { color: Colors.brand.accent, fontSize: 12 },
  postActions: { flexDirection: 'row', gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon: { fontSize: 16 },
  actionIconLiked: { opacity: 1 },
  actionText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  challengesContainer: { padding: 16, gap: 12 },
  challengeCard: {
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  challengeEmoji: { fontSize: 32 },
  challengeInfo: { flex: 1 },
  challengeName: { color: Colors.brand.white, fontWeight: '700', fontSize: 14 },
  challengeMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  joinBtn: { backgroundColor: Colors.brand.white, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  joinBtnText: { color: Colors.brand.primary, fontWeight: '700', fontSize: 13 },
  leaderboardContainer: { padding: 16, gap: 8 },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  leaderRowUser: { backgroundColor: Colors.brand.white },
  leaderRank: { color: 'rgba(255,255,255,0.6)', fontWeight: '700', width: 28, fontSize: 14 },
  leaderAvatar: { fontSize: 24 },
  leaderName: { flex: 1, color: Colors.brand.white, fontWeight: '600', fontSize: 14 },
  leaderNameUser: { color: Colors.brand.primary },
  leaderPoints: { color: Colors.brand.accent, fontWeight: '700', fontSize: 14 },
});
