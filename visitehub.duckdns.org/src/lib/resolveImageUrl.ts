export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = String(url).trim();
  if (!trimmed) return undefined;

  // Common bad serialized values from APIs/DB.
  if (trimmed === 'null' || trimmed === 'undefined') return undefined;

  // Normalize Windows paths and other backslash-separated strings.
  let normalized = trimmed.replace(/\\/g, '/');

  // Some fields may be stored as JSON-stringified values (extra quotes), e.g. "\/uploads\/x.jpg".
  // Strip one layer of wrapping quotes.
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith('\'') && normalized.endsWith('\''))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  // Some fields may be stored as JSON (array/object) in string form.
  // Examples:
  // - '["/uploads/x.jpg"]'
  // - '{"url":"/uploads/x.jpg"}'
  // Parse those first so we don't accidentally return '/uploads/x.jpg"]'.
  if (
    (normalized.startsWith('[') && normalized.endsWith(']')) ||
    (normalized.startsWith('{') && normalized.endsWith('}'))
  ) {
    try {
      const parsed = JSON.parse(normalized);

      if (typeof parsed === 'string') {
        return resolveImageUrl(parsed);
      }

      if (Array.isArray(parsed)) {
        const first = parsed.find((v) => typeof v === 'string' && v.trim().length > 0);
        if (typeof first === 'string') return resolveImageUrl(first);

        const firstObj = parsed.find((v) => v && typeof v === 'object');
        if (firstObj && typeof firstObj === 'object') {
          const maybeUrl = (firstObj as any).url || (firstObj as any).path || (firstObj as any).src;
          if (typeof maybeUrl === 'string') return resolveImageUrl(maybeUrl);
        }
      }

      if (parsed && typeof parsed === 'object') {
        const maybeUrl = (parsed as any).url || (parsed as any).path || (parsed as any).src;
        if (typeof maybeUrl === 'string') return resolveImageUrl(maybeUrl);
      }
    } catch {
      // If JSON parsing fails, continue with string heuristics.
    }
  }

  // If the string contains an uploads path anywhere (even without a URL scheme),
  // always return a relative "/uploads/*" so Next.js can proxy it via rewrites.
  // Examples:
  // - "visiteapihub.duckdns.org/uploads/x.jpg" => "/uploads/x.jpg"
  // - "localhost:4001/uploads/x.jpg" => "/uploads/x.jpg"
  // - "http://host/uploads/x.jpg" => "/uploads/x.jpg"
  const uploadsIndex = normalized.toLowerCase().indexOf('/uploads/');
  if (uploadsIndex !== -1) {
    return normalized.slice(uploadsIndex);
  }

  // If the DB stored only the filename (no /uploads prefix), assume it's an uploads asset.
  // Example: "1766066835206-749780310.jpeg" => "/uploads/1766066835206-749780310.jpeg"
  if (/^[^/\\?#]+\.(png|jpe?g|webp|gif|svg)$/i.test(normalized)) {
    return `/uploads/${normalized}`;
  }

  // If the backend stored a full absolute URL for a locally served upload,
  // rewrite it to a relative /uploads/* path so the frontend can proxy it.
  // This avoids Next/Image trying to fetch "localhost" from inside Docker.
  try {
    const parsed = new URL(normalized);
    if (parsed.pathname?.startsWith('/uploads/')) {
      return parsed.pathname;
    }
  } catch {
    // Not an absolute URL; keep processing below.
  }

  // If it's an uploads path, keep it relative so Next.js can proxy it via rewrites.
  if (normalized.startsWith('/uploads/')) return normalized;
  if (normalized.startsWith('uploads/')) return `/${normalized}`;

  if (/^https?:\/\//i.test(normalized)) return normalized;
  if (normalized.startsWith('//')) return `https:${normalized}`;

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
  if (!base) return normalized;

  // For other relative paths, prefix with the configured API base.
  if (normalized.startsWith('/')) return `${base}${normalized}`;
  return `${base}/${normalized}`;
}
