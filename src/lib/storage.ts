import AsyncStorage from '@react-native-async-storage/async-storage';

export type Category = {
  id: string;
  name: string;
  createdAt: number;
};

export type SavedPost = {
  id: string;
  url: string;
  platform: string;
  note?: string;
  categoryId: string;
  createdAt: number;
};

const POSTS_KEY = 'saveideas_posts';
const CATEGORIES_KEY = 'saveideas_categories';

export async function getPosts(): Promise<SavedPost[]> {
  const raw = await AsyncStorage.getItem(POSTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function setPosts(posts: SavedPost[]) {
  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export async function getCategories(): Promise<Category[]> {
  const raw = await AsyncStorage.getItem(CATEGORIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function setCategories(categories: Category[]) {
  await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}