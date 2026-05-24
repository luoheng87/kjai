export async function withDbFallback<T>(
  query: () => Promise<T>,
  fallback: T,
  label = "query",
): Promise<T> {
  try {
    const result = await Promise.race([
      query(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`${label} timeout`)), 20000),
      ),
    ]);
    return result;
  } catch (error) {
    console.error(`[db] ${label} failed:`, error);
    return fallback;
  }
}
