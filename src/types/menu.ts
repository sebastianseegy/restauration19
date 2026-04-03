export type MenuTyp = 'Speise' | 'Wein';

export type WeinGlasMl = '0,125'; // Festgelegt auf 0,125L

export const SPEISE_KATEGORIEN = ['KLEINIGKEITEN', 'WARME GERICHTE', 'SÜSSES'];
export const WEIN_KATEGORIEN = ['SCHAUMWEIN', 'WEISSWEIN', 'ROTWEIN'];

/** Formatiert z. B. "7,50" → "7,50 €" wenn noch kein € */
export function formatEurSuffix(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  return t.includes('€') ? t : `${t} €`;
}

/** Entfernt € am Anfang/Ende; für Speicherung und Eingabefelder ohne Währungssymbol. */
export function stripEurAmount(raw: string): string {
  return raw
    .trim()
    .replace(/^\s*€\s*/u, '')
    .replace(/\s*€\s*$/u, '')
    .trim();
}

/** Öffentliche Darstellung eines Speisenpreises (Betrag in Firestore ohne €). */
export function displaySpeisePreis(stored: string): string {
  const s = stripEurAmount(stored);
  if (!s) return '';
  return formatEurSuffix(s);
}

/** Öffentliche Darstellung der Glas-Zeile (Erkennt 0,1L, 0,2L und das neue 0,125L). */
export function displayWeinPreisLine(stored: string): string {
  const t = stored.trim();
  if (!t) return '';
  const m = t.match(/^(0,125L|0,1L|0,2L)\s*\|\s*(.+)$/i);
  if (m) return `0,125L | ${formatEurSuffix(stripEurAmount(m[2]))}`;
  return formatEurSuffix(stripEurAmount(t));
}

/** Öffentliche Darstellung der Flaschen-Zeile (z. B. "FL. | 26,00"). */
export function displayWeinFlascheLine(stored: string): string {
  const t = stored.trim();
  if (!t) return '';
  const m = t.match(/^(FL\.\s*\|\s*)(.+)$/i);
  if (m) return m[1] + formatEurSuffix(stripEurAmount(m[2]));
  return formatEurSuffix(stripEurAmount(t));
}

const KATEGORIE_RANK_FALLBACK = 999;

function kategorieRank(typ: MenuTyp, k: string): number {
  const order = typ === 'Speise' ? SPEISE_KATEGORIEN : WEIN_KATEGORIEN;
  const i = order.indexOf(k);
  return i === -1 ? KATEGORIE_RANK_FALLBACK : i;
}

/** Feste Reihenfolge der Kategorien für die Sortierung. */
export function compareMenuKategorie(typ: MenuTyp, a: string, b: string): number {
  const ra = kategorieRank(typ, a);
  const rb = kategorieRank(typ, b);
  if (ra !== rb) return ra - rb;
  return a.localeCompare(b, 'de');
}

/** Setzt den String für die Datenbank zusammen (Immer 0,125L). */
export function composeWeinPreisString(eurGlas: string): string {
  const cleaned = stripEurAmount(eurGlas);
  if (!cleaned) return '';
  return `0,125L | ${cleaned}`;
}

/** Setzt den Flaschen-String für die Datenbank zusammen. */
export function composeWeinFlascheString(eurFlasche: string): string {
  return `FL. | ${stripEurAmount(eurFlasche)}`;
}

/** Liest gespeicherte Preis-Strings in Formularfelder (Glas-Größe + EUR-Teile). */
export function parseWeinPrices(preis: string, preisFlasche: string): {
  glas: WeinGlasMl;
  eurGlas: string;
  eurFlasche: string;
} {
  const g = preis.match(/(0,1L|0,2L|0,125L)\s*\|\s*(.+)/i);
  const eurGlas = g ? stripEurAmount(g[2]) : stripEurAmount(preis);
  const fb = (preisFlasche || '').match(/FL\.\s*\|\s*(.+)/i);
  const eurFlasche = fb ? stripEurAmount(fb[1]) : stripEurAmount(preisFlasche || '');
  return { glas: '0,125', eurGlas, eurFlasche };
}

export interface MenuItem {
  id: string;
  Typ: MenuTyp;
  Kategorie: string;
  Titel: string;
  Beschreibung?: string;
  Preis: string;
  Preis_Flasche?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}