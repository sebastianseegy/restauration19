import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { MenuTyp } from '../types/menu';

const MENU_META_REF = doc(db, 'settings', 'menuMeta');

export interface MenuMeta {
  customSpeiseKategorien: string[];
  customWeinKategorien: string[];
}

export async function getMenuMeta(): Promise<MenuMeta> {
  const snap = await getDoc(MENU_META_REF);
  if (!snap.exists()) {
    return { customSpeiseKategorien: [], customWeinKategorien: [] };
  }
  const d = snap.data();
  return {
    customSpeiseKategorien: Array.isArray(d.customSpeiseKategorien) ? d.customSpeiseKategorien : [],
    customWeinKategorien: Array.isArray(d.customWeinKategorien) ? d.customWeinKategorien : [],
  };
}

export async function saveCustomCategory(typ: MenuTyp, name: string): Promise<void> {
  const trimmed = name.trim().toUpperCase();
  if (!trimmed) return;
  const meta = await getMenuMeta();
  const key = typ === 'Speise' ? 'customSpeiseKategorien' : 'customWeinKategorien';
  const next = [...new Set([...meta[key], trimmed])].sort();
  await setDoc(MENU_META_REF, { ...meta, [key]: next }, { merge: true });
}
