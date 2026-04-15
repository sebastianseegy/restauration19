/** Production site URL — must match Search Console property and sitemap. */
export const SITE_ORIGIN = 'https://restauration19.de';

export function canonicalUrlForPath(pathname: string): string {
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

const DEFAULT_TITLE = 'RESTAURATION19 Nürnberg | Restaurant & Weinbar in St. Johannis';

/** Einheitlich auf allen öffentlichen Seiten (Meta, Open Graph, Twitter). */
const SITE_DESCRIPTION =
  'Restaurant im Bistrostil – ehrlich, einfach und geschmackvoll. Dazu eine besondere Weinauswahl und eine Atmosphäre, in der man sich wohlfühlt. Helmstraße 19.';

function route(title: string): { title: string; description: string } {
  return { title, description: SITE_DESCRIPTION };
}

const ROUTE_SEO: Record<string, { title: string; description: string }> = {
  '/': route(DEFAULT_TITLE),
  '/genuss': route('Aktuelle Karte & Weinauswahl | RESTAURATION19 Nürnberg'),
  '/team': route('Team | RESTAURATION19 Nürnberg'),
  '/events': route('Private Events & Home Cooking | RESTAURATION19 Nürnberg'),
  '/impressum': route('Impressum | RESTAURATION19'),
  '/datenschutz': route('Datenschutz | RESTAURATION19'),
  '/agb': route('AGB | RESTAURATION19'),
};

/**
 * Updates document head for public routes (client-side). Helps Search Console
 * see distinct URLs instead of every path sharing the homepage canonical.
 */
export function applyPublicPageSeo(pathname: string) {
  const pathKey = pathname.replace(/\/+$/, '') || '/';
  const cfg = ROUTE_SEO[pathKey] ?? ROUTE_SEO['/'];
  const url = canonicalUrlForPath(pathname);

  document.title = cfg.title;
  setCanonical(url);
  setMeta('name', 'description', cfg.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:title', cfg.title);
  setMeta('property', 'og:description', cfg.description);
  setMeta('name', 'twitter:title', cfg.title);
  setMeta('name', 'twitter:description', cfg.description);
  setMeta('name', 'robots', 'index, follow, max-image-preview:large');
}
