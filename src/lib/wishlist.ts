export function getWishlistIds(): string[] {
  try {
    const saved = localStorage.getItem("wayzyy_wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function isPropertyWishlisted(id: string): boolean {
  return getWishlistIds().includes(id);
}

export function toggleWishlist(id: string): boolean {
  const current = getWishlistIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter((item) => item !== id) : [...current, id];
  localStorage.setItem("wayzyy_wishlist", JSON.stringify(updated));
  window.dispatchEvent(new Event("wayzyy_wishlist_updated"));
  return !exists;
}
