/** Kanonische Domain (Apex) — muss mit Sitemap / Search Console übereinstimmen. */
export const SITE_ORIGIN = 'https://restauration19.de';

/** Einheitlicher Snippet-Text für alle öffentlichen Seiten (Meta, Open Graph, Twitter). */
export const UNIFIED_DESCRIPTION =
  'Restaurant im Bistrostil – ehrlich, einfach und geschmackvoll. Dazu eine besondere Weinauswahl und eine Atmosphäre, in der man sich wohlfühlt. Helmstraße 19.';

function canonicalUrlForPath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${normalized}`;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

/**
 * Pro Route: gleiche Beschreibung überall, korrekte canonical- und og:url-Ziel-URL.
 * Wichtig für SPA + Google (Indexing statt „Alternative page with proper canonical“).
 */
export function applySeoForPath(pathname: string) {
  const url = canonicalUrlForPath(pathname);
  setCanonical(url);
  setMeta('property', 'og:url', url);
  setMeta('name', 'description', UNIFIED_DESCRIPTION);
  setMeta('property', 'og:description', UNIFIED_DESCRIPTION);
  setMeta('name', 'twitter:description', UNIFIED_DESCRIPTION);
}
