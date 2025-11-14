export const isMobile = () => {
  if (typeof window === 'undefined') return false; // SSR fallback
  return window.innerWidth <= 992;
};