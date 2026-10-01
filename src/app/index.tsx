import { useIncomingShare } from "expo-sharing";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { parseSharedText } from "../lib/share/parser";
import {
  Category,
  SavedPost,
  getCategories,
  getPosts,
  setCategories,
  setPosts,
} from "../lib/storage";

export default function HomeScreen() {
  if (Platform.OS === "web") return null;

  const { sharedPayloads, isResolving } = useIncomingShare();

  const sharedContent = useMemo(() => {
    const firstPayload = sharedPayloads[0];
    return parseSharedText(firstPayload?.value);
  }, [sharedPayloads]);

  const [note, setNote] = useState("");
  const [categories, setCategoryState] = useState<Category[]>([]);
  const [posts, setPostsState] = useState<SavedPost[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const loadedCategories = await getCategories();
      const loadedPosts = await getPosts();

      if (loadedCategories.length === 0) {
        const seed = [
          { id: "ideas", name: "Ideas", createdAt: Date.now() },
          { id: "try-later", name: "Try Later", createdAt: Date.now() + 1 },
          { id: "inspo", name: "Inspiration", createdAt: Date.now() + 2 },
        ];
        await setCategories(seed);
        setCategoryState(seed);
        setSelectedCategoryId(seed[0].id);
      } else {
        setCategoryState(loadedCategories);
        setSelectedCategoryId(loadedCategories[0].id);
      }

      setPostsState(loadedPosts);
    })();
  }, []);

  const canSave =
    !!sharedContent?.url && (selectedCategoryId || newCategoryName.trim());

  const handleSave = async () => {
    let categoryId = selectedCategoryId;

    if (!categoryId) {
      const newCategory: Category = {
        id: String(Date.now()),
        name: newCategoryName.trim(),
        createdAt: Date.now(),
      };
      const nextCategories = [...categories, newCategory];
      await setCategories(nextCategories);
      setCategoryState(nextCategories);
      categoryId = newCategory.id;
      setSelectedCategoryId(newCategory.id);
      setNewCategoryName("");
    }

    const post: SavedPost = {
      id: String(Date.now()),
      url: sharedContent!.url,
      platform: sharedContent!.platform,
      note: note.trim() || undefined,
      categoryId,
      createdAt: Date.now(),
    };

    const nextPosts = [post, ...posts];
    await setPosts(nextPosts);
    setPostsState(nextPosts);
    setSaved(true);
    setNote("");
  };

  if (isResolving) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>SaveIdeas</Text>
        <Text style={styles.subtitle}>
          Save posts, organize them, and pick one later.
        </Text>

        {saved ? (
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>Saved</Text>
            <Text style={styles.successText}>
              You can return to your app now.
            </Text>
          </View>
        ) : sharedContent ? (
          <View style={styles.card}>
            <Text style={styles.heading}>New save</Text>

            <View style={styles.preview}>
              <Text style={styles.previewLabel}>
                Received from {sharedContent.platform}
              </Text>
              <Text selectable style={styles.url}>
                {sharedContent.url}
              </Text>
            </View>

            <Text style={styles.label}>Optional note</Text>
            <TextInput
              placeholder="Add a quick note..."
              value={note}
              onChangeText={setNote}
              style={styles.input}
              multiline
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {categories.map((cat) => {
                const active = selectedCategoryId === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategoryId(cat.id)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={active ? styles.chipTextActive : styles.chipText}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              placeholder="Or create a new category"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={styles.input}
            />

            <Pressable
              disabled={!canSave}
              onPress={handleSave}
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.empty}>
              Share something from another app to save it here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 34, fontWeight: "800", color: "#111827" },
  subtitle: { marginTop: 6, fontSize: 15, color: "#6B7280" },
  card: {
    marginTop: 24,
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  heading: { fontSize: 22, fontWeight: "700", color: "#111827" },
  preview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  previewLabel: {
    fontSize: 12,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  url: { fontSize: 15, lineHeight: 22, color: "#2563EB" },
  label: { marginTop: 4, fontSize: 13, color: "#6B7280", fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    color: "#111827",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  chipActive: { backgroundColor: "#111827" },
  chipText: { color: "#111827", fontWeight: "600" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  saveButton: {
    marginTop: 8,
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  saveButtonDisabled: { backgroundColor: "#9CA3AF" },
  saveButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  empty: { fontSize: 16, lineHeight: 24, color: "#4B5563" },
  successCard: {
    marginTop: 24,
    backgroundColor: "#ECFDF5",
    borderRadius: 24,
    padding: 18,
  },
  successTitle: { fontSize: 22, fontWeight: "800", color: "#065F46" },
  successText: { marginTop: 6, color: "#065F46" },
});
