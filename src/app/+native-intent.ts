export async function redirectSystemPath({ path }: { path: string }) {
  try {
    const url = new URL(path);
    if (url.hostname === 'expo-sharing') {
      return '/';
    }
  } catch {}
  return path;
}