export function buildQuery(params?: Record<string, any>) {
  const query = new URLSearchParams();

  query.append("format", "webp");

  if (params) {
    for (const [ key, value ] of Object.entries(params)) {
      query.append(key, String(value));
    }
  }
  return `&${query.toString()}`;
}