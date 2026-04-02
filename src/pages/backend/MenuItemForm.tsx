import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { MenuItem, MenuCategory, CATEGORY_LABELS, EU_ALLERGENS, AllergenId } from '../../types/menu';

const EMPTY_FORM: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> = {
  name: { de: '', en: '' },
  description: { de: '', en: '' },
  price: 0,
  category: 'hauptgericht',
  allergens: [],
  imageUrl: '',
  isActive: true,
  activeFrom: '',
  activeUntil: '',
};

export default function MenuItemForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [lang, setLang] = useState<'de' | 'en'>('de');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      getDoc(doc(db, 'menuItems', id)).then(snap => {
        if (snap.exists()) {
          const data = snap.data() as MenuItem;
          setForm({
            name: data.name || { de: '', en: '' },
            description: data.description || { de: '', en: '' },
            price: data.price || 0,
            category: data.category || 'hauptgericht',
            allergens: data.allergens || [],
            imageUrl: data.imageUrl || '',
            isActive: data.isActive ?? true,
            activeFrom: data.activeFrom || '',
            activeUntil: data.activeUntil || '',
          });
          if (data.imageUrl) setImagePreview(data.imageUrl);
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleAllergen = (allergen: AllergenId) => {
    setForm(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.de.trim()) { setError('Name (DE) ist erforderlich.'); return; }
    setSaving(true);
    setError('');
    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `menu/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const now = new Date().toISOString();
      const docId = isNew ? `${Date.now()}` : id!;
      const data: MenuItem = {
        id: docId,
        ...form,
        imageUrl,
        updatedAt: now,
        createdAt: isNew ? now : form.activeFrom || now,
      };

      if (isNew) {
        await setDoc(doc(db, 'menuItems', docId), data);
      } else {
        await updateDoc(doc(db, 'menuItems', docId), { ...data });
      }

      navigate('/backend/menu');
    } catch (err) {
      setError('Fehler beim Speichern. Bitte erneut versuchen.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xs tracking-widest text-gray-400 mb-1">
            {isNew ? 'NEUES ITEM' : 'ITEM BEARBEITEN'}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/backend/menu')}
          className="text-xs tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
        >
          ← ZURÜCK
        </button>
      </div>

      {/* Language tabs */}
      <div className="flex gap-2">
        {(['de', 'en'] as const).map(l => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`text-xs tracking-widest px-4 py-2 rounded-lg transition-colors ${
              lang === l ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {l === 'de' ? 'DEUTSCH' : 'ENGLISH'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-gray-400">
              NAME ({lang.toUpperCase()}) *
            </label>
            <input
              type="text"
              value={form.name[lang]}
              onChange={e => setForm(prev => ({ ...prev, name: { ...prev.name, [lang]: e.target.value } }))}
              placeholder={lang === 'de' ? 'z.B. Burrata mit Tomaten' : 'e.g. Burrata with tomatoes'}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-gray-400">
              BESCHREIBUNG ({lang.toUpperCase()})
            </label>
            <textarea
              value={form.description[lang]}
              onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, [lang]: e.target.value } }))}
              rows={3}
              placeholder={lang === 'de' ? 'Kurze Beschreibung...' : 'Short description...'}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-gray-400">PREIS (€)</label>
            <input
              type="number"
              value={form.price || ''}
              onChange={e => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              step="0.50"
              min="0"
              placeholder="0.00"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-gray-400">KATEGORIE</label>
            <select
              value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value as MenuCategory }))}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white"
            >
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Active status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-gray-900' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <label className="text-xs tracking-widest text-gray-500">
              {form.isActive ? 'AKTIV (auf der Karte)' : 'INAKTIV (nicht sichtbar)'}
            </label>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-widest text-gray-400">AKTIV AB</label>
              <input
                type="date"
                value={form.activeFrom}
                onChange={e => setForm(prev => ({ ...prev, activeFrom: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-widest text-gray-400">AKTIV BIS</label>
              <input
                type="date"
                value={form.activeUntil}
                onChange={e => setForm(prev => ({ ...prev, activeUntil: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-gray-400">BILD</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="" className="w-full h-48 object-cover" />
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-300 gap-2">
                  <span className="text-3xl">+</span>
                  <span className="text-xs tracking-widest">BILD HOCHLADEN</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(''); setForm(prev => ({ ...prev, imageUrl: '' })); }}
                className="text-xs text-red-300 hover:text-red-500 transition-colors text-left"
              >
                Bild entfernen
              </button>
            )}
          </div>

          {/* Allergens */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-widest text-gray-400">ALLERGENE</label>
            <div className="grid grid-cols-2 gap-1.5">
              {EU_ALLERGENS.map(a => (
                <label key={a.id} className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => toggleAllergen(a.id)}
                    className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                      form.allergens.includes(a.id)
                        ? 'bg-gray-900 border-gray-900'
                        : 'border-gray-200 group-hover:border-gray-400'
                    }`}
                  >
                    {form.allergens.includes(a.id) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 leading-tight">{a.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white text-xs tracking-widest px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'SPEICHERN...' : 'SPEICHERN'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/backend/menu')}
          className="text-xs tracking-widest text-gray-500 hover:text-gray-900 px-4 py-3 transition-colors"
        >
          ABBRECHEN
        </button>
      </div>
    </form>
  );
}
