// frontend/src/utils.js
export const buildImg = (url) => {
  if (!url) return 'https://placehold.co/600x400'; // fallback placeholder
  if (/^https?:\/\//i.test(url)) return url;
  // VITE_API_BASE should be like http://localhost:4000/api
  const origin = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${origin}/${url.replace(/^\/+/, '')}`;
};
