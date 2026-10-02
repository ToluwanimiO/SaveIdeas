import { useEffect, useMemo, useState } from "react";
import {
    Linking,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Category, getCategories, getPosts, SavedPost } from "../lib/storage";

export default function LibraryScreen() {
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [pickedPost, setPickedPost] = useState<SavedPost | null>(null);

  useEffect(() => {
    (async () => {
      const loadedPosts = await getPosts();
      const loadedCategories = await getCategories();
      setPosts(loadedPosts);
      setCategoriesState(loadedCategories);
      setPickedPost(loadedPosts[0] ?? null);
    })();
  }, []);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const filteredPosts =
    selectedCategoryId === "all"
      ? posts
      : posts.filter((p) => p.categoryId === selectedCategoryId);

  const pickRandomPost = () => {
    if (!filteredPosts.length) {
      setPickedPost(null);
      return;
    }
    const random =
      filteredPosts[Math.floor(Math.random() * filteredPosts.length)];
    setPickedPost(random);
  };

  const openUrl = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>
          Browse by category or pick one randomly.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Pressable
            onPress={() => setSelectedCategoryId("all")}
            style={[
              styles.chip,
              selectedCategoryId === "all" && styles.chipActive,
            ]}
          >
            <Text
              style={
                selectedCategoryId === "all"
                  ? styles.chipTextActive
                  : styles.chipText
              }
            >
              All
            </Text>
          </Pressable>

          {categories.map((cat) => {
            const active = selectedCategoryId === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={active ? styles.chipTextActive : styles.chipText}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable style={styles.randomButton} onPress={pickRandomPost}>
          <Text style={styles.randomButtonText}>Pick random post</Text>
        </Pressable>

        <View style={styles.randomCard}>
          <Text style={styles.sectionTitle}>Random pick</Text>
          {pickedPost ? (
            <>
              <Text style={styles.meta}>
                {categoryMap[pickedPost.categoryId] ?? "Uncategorized"}
              </Text>
              <Text style={styles.platform}>
                {pickedPost.platform ?? "Unknown platform"}
              </Text>
              {pickedPost.note ? (
                <Text style={styles.note}>{pickedPost.note}</Text>
              ) : null}
              <Pressable onPress={() => openUrl(pickedPost.url)} hitSlop={8}>
                <Text style={styles.link} numberOfLines={2}>
                  {pickedPost.url}
                </Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.empty}>No posts yet.</Text>
          )}
        </View>

        <View style={{ marginTop: 18, gap: 14 }}>
          {filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.meta}>
                {categoryMap[post.categoryId] ?? "Uncategorized"}
              </Text>
              <Text style={styles.platform}>
                {post.platform ?? "Unknown platform"}
              </Text>
              {post.note ? <Text style={styles.note}>{post.note}</Text> : null}
              <Pressable onPress={() => openUrl(post.url)} hitSlop={8}>
                <Text style={styles.link} numberOfLines={2}>
                  {post.url}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  scroll: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: "800", color: "#111827" },
  subtitle: { marginTop: 6, color: "#6B7280" },
  chips: { gap: 10, paddingVertical: 16 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  chipActive: { backgroundColor: "#111827" },
  chipText: { color: "#111827", fontWeight: "600" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  randomButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  randomButtonText: { color: "#fff", fontWeight: "700" },
  randomCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  platform: { fontSize: 13, color: "#2563EB", fontWeight: "700" },
  note: { fontSize: 13, lineHeight: 19, color: "#4B5563" },
  link: {
    fontSize: 15,
    lineHeight: 22,
    color: "#0F172A",
    textDecorationLine: "underline",
  },
  empty: { color: "#6B7280" },
});
