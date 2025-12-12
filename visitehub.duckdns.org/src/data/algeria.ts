// Client-side loader for Algeria wilaya → daira dataset from our backend

export type WilayaDairasMap = Record<string, string[]>;

let cachedMap: WilayaDairasMap | null = null;

export async function fetchWilayaDairaMap(): Promise<WilayaDairasMap> {
  if (cachedMap) return cachedMap;
  // Always go through ApiService which is already configured to 3000
  const { apiService } = await import('../api');
  const data = await apiService.getWilayaDairas();
  cachedMap = data;
  return cachedMap;
}

export function getWilayasFromMap(map: WilayaDairasMap): string[] {
  return Object.keys(map).sort((a, b) => a.localeCompare(b, 'fr'));
}

