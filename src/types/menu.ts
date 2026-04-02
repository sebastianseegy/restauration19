export type Language = 'de' | 'en';

export type MenuCategory =
  | 'vorspeise'
  | 'hauptgericht'
  | 'dessert'
  | 'wein'
  | 'getraenke'
  | 'snacks';

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  vorspeise: 'Vorspeise',
  hauptgericht: 'Hauptgericht',
  dessert: 'Dessert',
  wein: 'Wein',
  getraenke: 'Getränke',
  snacks: 'Snacks',
};

export const EU_ALLERGENS = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'krebstiere', label: 'Krebstiere' },
  { id: 'eier', label: 'Eier' },
  { id: 'fisch', label: 'Fisch' },
  { id: 'erdnuesse', label: 'Erdnüsse' },
  { id: 'soja', label: 'Soja' },
  { id: 'milch', label: 'Milch / Laktose' },
  { id: 'nuesse', label: 'Schalenfrüchte (Nüsse)' },
  { id: 'sellerie', label: 'Sellerie' },
  { id: 'senf', label: 'Senf' },
  { id: 'sesam', label: 'Sesam' },
  { id: 'sulfite', label: 'Schwefeldioxid / Sulfite' },
  { id: 'lupinen', label: 'Lupinen' },
  { id: 'weichtiere', label: 'Weichtiere' },
] as const;

export type AllergenId = typeof EU_ALLERGENS[number]['id'];

export interface MenuItem {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  price: number;
  category: MenuCategory;
  allergens: AllergenId[];
  imageUrl?: string;
  isActive: boolean;
  activeFrom?: string;
  activeUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageView {
  path: string;
  count: number;
  lastVisited: string;
}
