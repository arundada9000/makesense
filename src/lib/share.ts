/**
 * Tiny helpers for shareable calculator links. Inputs travel in the URL as
 * plain query parameters, so a shared link re-opens the exact calculation
 * with no backend and no stored data.
 */

export function readShareParams(keys: string[]): Record<string, number> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, number> = {};
  for (const key of keys) {
    const raw = params.get(key);
    if (raw !== null && raw !== "" && Number.isFinite(Number(raw))) {
      out[key] = Number(raw);
    }
  }
  return out;
}

export async function copyShareUrl(params: URLSearchParams): Promise<boolean> {
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}