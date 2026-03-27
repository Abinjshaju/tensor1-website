const FALLBACK = "post";

export function slugify(title) {
  if (!title || typeof title !== "string") return FALLBACK;
  const s = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || FALLBACK;
}

export function uniqueSlugPart() {
  return Math.random().toString(36).slice(2, 8);
}
