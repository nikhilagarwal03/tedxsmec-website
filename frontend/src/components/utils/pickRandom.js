// src/components/utils/pickRandom.js
export default function pickRandom(arr = [], n = 5) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  if (arr.length <= n) return arr.slice();
  const a = arr.slice();
  // Fisher-Yates partial shuffle
  for (let i = a.length - 1; i > 0 && a.length - i - 1 < n; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(a.length - n);
}
