import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Category, getCategories, setCategories } from '../lib/storage';

export default function CategoriesScreen() {
  const [categories, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      setCats(await getCategories());
    })();
  }, []);

  const addCategory = async () => {
    if (!name.trim()) return;
    const next = [...categories, { id: String(Date.now()), name: name.trim(), createdAt: Date.now() }];
    await setCategories(next);
    setCats(next);
    setName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Categories</Text>

        <View style={styles.card}>
          <TextInput
            placeholder="New category name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Pressable onPress={addCategory} style={styles.button}>
            <Text style={styles.buttonText}>Add category</Text>
          </Pressable>
        </View>

        {categories.map((cat) => (
          <View key={cat.id} style={styles.row}>
            <Text style={styles.rowText}>{cat.name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 24, gap: 16 },
  title: { fontSize: 32, fontWeight: '800' },
  card: { backgroundColor: '#F9FAFB', borderRadius: 20, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, padding: 14, backgroundColor: '#fff' },
  button: { backgroundColor: '#111827', padding: 14, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  rowText: { fontSize: 16, color: '#111827' },
});