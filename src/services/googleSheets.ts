import Papa from 'papaparse';

// ============================================================================
// ANLEITUNG ZUR VERKNÜPFUNG MIT GOOGLE SHEETS (TABELLEN)
// ============================================================================
// 1. Erstelle eine Google Tabelle (Google Sheets) mit folgenden Spaltenüberschriften:
//    - Typ (Muss "Speise" oder "Wein" sein)
//    - Kategorie (z.B. "VORSPEISEN", "WEISSWEIN")
//    - Titel (z.B. "BURRATA MIT TOMATEN UND BASILIKUM")
//    - Beschreibung (Optional, z.B. "WEINGUT WEGELER, RHEINGAU")
//    - Preis (z.B. "12,50 €" oder "0,2L | 7,50 €")
//    - Preis2 (Optional, z.B. "FL. | 26,00 €")
//
// 2. Klicke in Google Sheets auf "Datei" -> "Teilen" -> "Im Web veröffentlichen".
// 3. Wähle "Gesamtes Dokument" (oder das spezifische Tabellenblatt) und als Format "Kommagetrennte Werte (.csv)".
// 4. Klicke auf "Veröffentlichen" und kopiere den generierten Link.
// 5. Füge den Link hier zwischen die Anführungszeichen ein:
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKw_48RiU6g4o80oxhiKPf4hcZfu16SZuoXnQdFlOAXKXAziQjF4D8fPTRyirWu4KYpsCQRgYvlpuW/pub?gid=420869367&single=true&output=csv';

export interface MenuItem {
  Typ: 'Speise' | 'Wein';
  Kategorie: string;
  Titel: string;
  Beschreibung?: string;
  Preis: string;
  Preis_Flasche?: string;
  Aktiv?: string;
}

// Fallback-Daten, falls kein Google Sheet verlinkt ist oder ein Fehler auftritt
export const fallbackMenu: MenuItem[] = [
  { Typ: 'Speise', Kategorie: 'KLEINIGKEITEN', Titel: 'BURRATA MIT TOMATEN UND BASILIKUM', Preis: '12,50 €' },
  { Typ: 'Speise', Kategorie: 'KLEINIGKEITEN', Titel: 'RINDERCARPACCIO MIT PARMESAN', Preis: '16,00 €' },
  { Typ: 'Speise', Kategorie: 'WARME GERICHTE', Titel: 'HAUSGEMACHTE PASTA MIT TRÜFFEL', Preis: '24,00 €' },
  { Typ: 'Speise', Kategorie: 'WARME GERICHTE', Titel: 'WOLFSBARSCH VOM GRILL MIT GEMÜSE', Preis: '28,50 €' },
  { Typ: 'Speise', Kategorie: 'SÜSSES', Titel: 'TIRAMISU NACH FAMILIENREZEPT', Preis: '8,50 €' },
  
  { Typ: 'Wein', Kategorie: 'SCHAUMWEIN', Titel: 'CRÉMANT DE LOIRE BRUT', Beschreibung: 'BOUVET LADUBAY, LOIRE', Preis: '0,1L | 8,50 €', Preis_Flasche: 'FL. | 32,00 €' },
  { Typ: 'Wein', Kategorie: 'WEISSWEIN', Titel: 'RIESLING TROCKEN', Beschreibung: 'WEINGUT WEGELER, RHEINGAU', Preis: '0,2L | 7,50 €', Preis_Flasche: 'FL. | 26,00 €' },
  { Typ: 'Wein', Kategorie: 'WEISSWEIN', Titel: 'GRAUBURGUNDER', Beschreibung: 'WEINGUT KNIPSER, PFALZ', Preis: '0,2L | 8,50 €', Preis_Flasche: 'FL. | 29,00 €' },
  { Typ: 'Wein', Kategorie: 'ROTWEIN', Titel: 'SPÄTBURGUNDER', Beschreibung: 'WEINGUT MEYER-NÄKEL, AHR', Preis: '0,2L | 9,50 €', Preis_Flasche: 'FL. | 34,00 €' },
  { Typ: 'Wein', Kategorie: 'ROTWEIN', Titel: 'CUVÉE X', Beschreibung: 'WEINGUT KNIPSER, PFALZ', Preis: '0,2L | 12,00 €', Preis_Flasche: 'FL. | 42,00 €' },
];

export async function fetchMenuData(): Promise<MenuItem[]> {
  if (!SHEET_CSV_URL) {
    return fallbackMenu;
  }

  return new Promise((resolve) => {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validData = (results.data as MenuItem[]).filter(item => {
          if (!item.Titel || !item.Kategorie || !item.Typ) return false;
          if (item.Aktiv !== undefined && item.Aktiv !== '') {
            const aktiv = item.Aktiv.trim().toUpperCase();
            return aktiv === 'JA' || aktiv === 'TRUE';
          }
          return true;
        });
        if (validData.length > 0) {
          resolve(validData);
        } else {
          resolve(fallbackMenu);
        }
      },
      error: (error) => {
        console.error("Fehler beim Laden der Google Tabelle:", error);
        resolve(fallbackMenu);
      }
    });
  });
}
