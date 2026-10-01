import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCategories, getPosts, SavedPost, Category } from '../lib/storage';

export default function LibraryScreen() {
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  useEffect(() => {
    (async () => {
      setPosts(await getPosts());
      setCategoriesState(await getCategories());
    })();
  }, []);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  const filteredPosts =
    selectedCategoryId === 'all'
      ? posts
      : posts.filter((p) => p.categoryId === selectedCategoryId);

  const randomPost = () => {
    if (!filteredPosts.length) return null;
    return filteredPosts[Math.floor(Math.random() * filteredPosts.length)];
  };

  const picked = randomPost();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>Browse by category or pick one randomly.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable
            onPress={() => setSelectedCategoryId('all')}
            style={[styles.chip, selectedCategoryId === 'all' && styles.chipActive]}
          >
            <Text style={selectedCategoryId === 'all' ? styles.chipTextActive : styles.chipText}>All</Text>
          </Pressable>

          {categories.map((cat) => {
            const active = selectedCategoryId === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={active ? styles.chipTextActive : styles.chipText}>{cat.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.randomCard}>
          <Text style={styles.sectionTitle}>Random pick</Text>
          {picked ? (
            <>
              <Text style={styles.randomCategory}>{categoryMap[picked.categoryId] ?? 'Uncategorized'}</Text>
              <Text style={styles.randomUrl} numberOfLines={2}>
                {picked.note || picked.url}
              </Text>
            </>
          ) : (
            <Text style={styles.empty}>No posts yet.</Text>
          )}
        </View>

        <View style={{ marginTop: 18 }}>
          {filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postCategory}>{categoryMap[post.categoryId] ?? 'Uncategorized'}</Text>
              <Text style={styles.postText} numberOfLines={3}>
                {post.note || post.url}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#111827' },
  subtitle: { marginTop: 6, color: '#6B7280' },
  chips: { gap: 10, paddingVertical: 16 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#E5E7EB' },
  chipActive: { backgroundColor: '#111827' },
  chipText: { color: '#111827', fontWeight: '600' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  randomCard: { backgroundColor: '#F9FAFB', borderRadius: 24, padding: 18, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  randomCategory: { fontSize: 13, color: '#6B7280', textTransform: 'uppercase' },
  randomUrl: { fontSize: 16, lineHeight: 24, color: '#111827' },
  postCard: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    gap: 6,
  },
  postCategory: { fontSize: 13, color: '#6B7280', fontWeight: '700' },
  postText: { fontSize: 15, lineHeight: 22, color: '#111827' },
  empty: { color: '#6B7280' },
});