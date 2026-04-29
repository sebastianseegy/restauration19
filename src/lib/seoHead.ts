/** Kanonische Domain (Apex) — muss mit Sitemap / Search Console übereinstimmen. */
export const SITE_ORIGIN = 'https://restauration19.de';

/** Einheitlicher Fallback-Text falls eine Route keinen eigenen Eintrag hat. */
export const UNIFIED_DESCRIPTION =
  'Restaurant im Bistrostil – ehrlich, einfach und geschmackvoll. Dazu eine besondere Weinauswahl und eine Atmosphäre, in der man sich wohlfühlt. Helmstraße 19.';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'RESTAURATION19 Nürnberg | Restaurant & Weinbar in St. Johannis',
    description: UNIFIED_DESCRIPTION,
  },
  '/genuss': {
    title: 'Speisekarte & Genussküche – RESTAURATION19 Nürnberg',
    description:
      'Unsere saisonale Speisekarte – ehrliche Küche im Bistrostil mit besonderer Weinauswahl. Helmstraße 19, St. Johannis.',
  },
  '/events': {
    title: 'Private Events & Home Cooking – RESTAURATION19 Nürnberg',
    description:
      'Samstags steht die Restauration19 für private Veranstaltungen zur Verfügung – in unserer Location oder als Home Cooking Event bei euch zu Hause.',
  },
  '/team': {
    title: 'Das Team – RESTAURATION19 Nürnberg',
    description:
      'Lernt das Team hinter der Restauration19 kennen – Leidenschaft für gutes Essen und Wein in St. Johannis, Nürnberg.',
  },
  '/impressum': {
    title: 'Impressum – RESTAURATION19 Nürnberg',
    description: UNIFIED_DESCRIPTION,
  },
  '/datenschutz': {
    title: 'Datenschutz – RESTAURATION19 Nürnberg',
    description: UNIFIED_DESCRIPTION,
  },
  '/agb': {
    title: 'AGB – RESTAURATION19 Nürnberg',
    description: UNIFIED_DESCRIPTION,
  },
};

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
 * Pro Route: setzt Title, Description, canonical und og:url korrekt.
 * Wichtig für SPA + Google (Indexing statt "Alternative page with proper canonical").
 */
export function applySeoForPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const meta = PAGE_META[normalized] ?? {
    title: 'RESTAURATION19 Nürnberg | Restaurant & Weinbar in St. Johannis',
    description: UNIFIED_DESCRIPTION,
  };
  const url = canonicalUrlForPath(pathname);

  document.title = meta.title;
  setCanonical(url);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:title', meta.title);
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'description', meta.description);
  setMeta('property', 'og:description', meta.description);
  setMeta('name', 'twitter:description', meta.description);
}
