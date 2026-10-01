export function pick<T extends object>(source: unknown, fields: readonly string[]): Partial<T> {
  const result: Record<string, unknown> = {};
  if (source && typeof source === 'object') {
    for (const field of fields) {
      if (field in source) {
        result[field] = (source as Record<string, unknown>)[field];
      }
    }
  }
  return result as Partial<T>;
}
