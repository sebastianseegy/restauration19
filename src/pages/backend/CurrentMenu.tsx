import { createElement, useEffect, useMemo, useState } from 'react';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  MenuItem,
  SPEISE_KATEGORIEN,
  WEIN_KATEGORIEN,
  compareMenuItemSortInCategory,
  displaySpeisePreis,
  displayWeinFlascheLine,
  displayWeinPreisLine,
} from '../../types/menu';
import { Link } from 'react-router-dom';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

type MenuTypSpeiseWein = 'Speise' | 'Wein';

function categoryKey(typ: MenuTypSpeiseWein, kat: string) {
  return `${typ}|${kat}`;
}

function sortItemsForCategory(
  typ: MenuTypSpeiseWein,
  kat: string,
  pool: MenuItem[],
  localOrders: Record<string, string[]>
): MenuItem[] {
  const key = categoryKey(typ, kat);
  const inKat = pool.filter(i => i.Kategorie === kat);
  const order = localOrders[key];
  if (order && order.length === inKat.length) {
    const map = new Map(inKat.map(i => [i.id, i]));
    return order.map(id => map.get(id)).filter(Boolean) as MenuItem[];
  }
  return [...inKat].sort(compareMenuItemSortInCategory);
}

export default function CurrentMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [draftActive, setDraftActive] = useState<Record<string, boolean>>({});
  /** Geänderte Reihenfolge pro Kategorie: Key `Speise|KAT` bzw. `Wein|KAT` → sortierte IDs */
  const [localCategoryOrders, setLocalCategoryOrders] = useState<Record<string, string[]>>({});
  const [orderDirty, setOrderDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveBusy, setSaveBusy] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const effectiveActive = (item: MenuItem) =>
    draftActive[item.id] !== undefined ? draftActive[item.id]! : item.isActive;

  const visibilityDirty = useMemo(
    () => items.some(i => effectiveActive(i) !== i.isActive),
    [items, draftActive]
  );

  const hasUnsavedChanges = visibilityDirty || orderDirty;

  useEffect(() => {
    getDocs(collection(db, 'menuItems'))
      .then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
        setItems(data.filter(i => i.Typ && i.Titel));
        setDraftActive({});
        setLocalCategoryOrders({});
        setOrderDirty(false);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleDraft = (item: MenuItem) => {
    const cur = effectiveActive(item);
    const next = !cur;
    setDraftActive(prev => {
      const p = { ...prev };
      if (next === item.isActive) delete p[item.id];
      else p[item.id] = next;
      return p;
    });
  };

  const handleDragEnd = (typ: MenuTypSpeiseWein, kat: string, pool: MenuItem[], event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const list = sortItemsForCategory(typ, kat, pool, localCategoryOrders);
    const oldIndex = list.findIndex(i => i.id === active.id);
    const newIndex = list.findIndex(i => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextIds = arrayMove(
      list.map(i => i.id),
      oldIndex,
      newIndex
    );
    const key = categoryKey(typ, kat);
    setLocalCategoryOrders(prev => ({ ...prev, [key]: nextIds }));
    setOrderDirty(true);
  };

  const handleSave = async () => {
    const changedVisibility = items.filter(i => effectiveActive(i) !== i.isActive);
    setSaveBusy(true);
    try {
      const batch = writeBatch(db);

      changedVisibility.forEach(item => {
        batch.update(doc(db, 'menuItems', item.id), { isActive: effectiveActive(item) });
      });

      (Object.entries(localCategoryOrders) as [string, string[]][]).forEach(([, orderedIds]) => {
        orderedIds.forEach((id, index) => {
          batch.update(doc(db, 'menuItems', id), { sortOrder: index });
        });
      });

      if (changedVisibility.length > 0 || Object.keys(localCategoryOrders).length > 0) {
        await batch.commit();
      }

      setItems(prev => {
        const sortMap: Record<string, number> = {};
        (Object.entries(localCategoryOrders) as [string, string[]][]).forEach(([, ids]) => {
          ids.forEach((id, i) => {
            sortMap[id] = i;
          });
        });
        return prev.map(i => {
          let next = { ...i };
          const eff = effectiveActive(i);
          if (eff !== i.isActive) next = { ...next, isActive: eff };
          if (sortMap[i.id] !== undefined) next = { ...next, sortOrder: sortMap[i.id] };
          return next;
        });
      });
      setDraftActive({});
      setLocalCategoryOrders({});
      setOrderDirty(false);
    } finally {
      setSaveBusy(false);
    }
  };

  const speisen = items.filter(i => i.Typ === 'Speise' && effectiveActive(i));
  const weine = items.filter(i => i.Typ === 'Wein' && effectiveActive(i));
  const inactive = items.filter(i => !effectiveActive(i));

  const speisenKats = Array.from(new Set([...SPEISE_KATEGORIEN, ...speisen.map(i => i.Kategorie)]));
  const weinKats = Array.from(new Set([...WEIN_KATEGORIEN, ...weine.map(i => i.Kategorie)]));

  const discardAll = () => {
    setDraftActive({});
    setLocalCategoryOrders({});
    setOrderDirty(false);
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xs tracking-widest text-gray-400 mb-1">AKTUELLE KARTE</h1>
          <p className="text-sm text-gray-500">
            {speisen.length} Speisen · {weine.length} Weine aktiv
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!hasUnsavedChanges || saveBusy}
            onClick={handleSave}
            className={`text-xs tracking-widest px-5 py-2.5 rounded-lg transition-colors ${
              hasUnsavedChanges
                ? 'bg-gray-900 text-white hover:bg-gray-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            SPEICHERN
          </button>
          <button
            type="button"
            disabled={!hasUnsavedChanges || saveBusy}
            onClick={discardAll}
            className={`text-xs tracking-widest px-4 py-2.5 rounded-lg border transition-colors ${
              hasUnsavedChanges
                ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            VERWERFEN
          </button>
          <Link
            to="/backend/menu/new"
            className="bg-gray-900 text-white text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + HINZUFÜGEN
          </Link>
        </div>
      </div>

      {/* Infozeile — immer reserviert */}
      <p
        className={`text-xs rounded-lg px-4 py-2 border transition-all ${
          hasUnsavedChanges
            ? 'text-amber-800 bg-amber-50 border-amber-200'
            : 'text-transparent bg-transparent border-transparent select-none pointer-events-none'
        }`}
      >
        Änderungen — <strong>SPEICHERN</strong>, damit die Genuss-Seite aktualisiert wird (Sichtbarkeit
        / Reihenfolge).
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={event => {
          const id = event.active.id as string;
          const inSpeisen = speisen.find(i => i.id === id);
          if (inSpeisen) {
            handleDragEnd('Speise', inSpeisen.Kategorie, speisen, event);
            return;
          }
          const inWein = weine.find(i => i.id === id);
          if (inWein) {
            handleDragEnd('Wein', inWein.Kategorie, weine, event);
          }
        }}
      >
        <MenuSection
          title="SPEISEKARTE"
          typ="Speise"
          kategorien={speisenKats}
          pool={speisen}
          localCategoryOrders={localCategoryOrders}
          onToggle={toggleDraft}
        />
        <MenuSection
          title="WEINAUSWAHL"
          typ="Wein"
          kategorien={weinKats}
          pool={weine}
          localCategoryOrders={localCategoryOrders}
          onToggle={toggleDraft}
          isWein
        />
      </DndContext>

      {inactive.length > 0 && (
        <div>
          <h2 className="text-[10px] tracking-widest text-gray-400 mb-3">
            NICHT AUF DER KARTE ({inactive.length})
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {inactive.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 px-6 py-3 ${
                  i !== inactive.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <span
                  className={`text-[10px] tracking-widest px-2 py-0.5 rounded flex-shrink-0 ${
                    item.Typ === 'Wein' ? 'bg-purple-50 text-purple-400' : 'bg-orange-50 text-orange-400'
                  }`}
                >
                  {item.Typ.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0 opacity-50">
                  <p className="text-sm text-gray-600">{item.Titel}</p>
                  <p className="text-[10px] text-gray-400">{item.Kategorie}</p>
                </div>
                <p className="text-sm text-gray-400 flex-shrink-0">
                  {item.Typ === 'Wein' ? displayWeinPreisLine(item.Preis) : displaySpeisePreis(item.Preis)}
                  {item.Typ === 'Wein' && item.Preis_Flasche && (
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {displayWeinFlascheLine(item.Preis_Flasche)}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => toggleDraft(item)}
                  className="text-[10px] tracking-widest px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-700 transition-colors flex-shrink-0"
                >
                  AKTIVIEREN
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuSection({
  title,
  typ,
  kategorien,
  pool,
  localCategoryOrders,
  onToggle,
  isWein,
}: {
  title: string;
  typ: MenuTypSpeiseWein;
  kategorien: string[];
  pool: MenuItem[];
  localCategoryOrders: Record<string, string[]>;
  onToggle: (item: MenuItem) => void;
  isWein?: boolean;
}) {
  const activeKats = kategorien.filter(k => pool.some(i => i.Kategorie === k));

  return (
    <div>
      <h2 className="text-[10px] tracking-widest text-gray-400 mb-3">{title}</h2>
      {pool.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-xs text-gray-300 tracking-widest">NOCH KEINE EINTRÄGE</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {activeKats.map(kat => {
            const katItems = sortItemsForCategory(typ, kat, pool, localCategoryOrders);
            if (katItems.length === 0) return null;
            const ids = katItems.map(i => i.id);
            return (
              <div key={kat}>
                <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] tracking-widest text-gray-500">{kat}</span>
                  <span className="text-[10px] text-gray-400 tracking-wide">Ziehen zum Sortieren</span>
                </div>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                  {katItems.map((item, i) =>
                    createElement(DraggableMenuRow, {
                      key: item.id,
                      item,
                      isLast: i === katItems.length - 1,
                      isWein,
                      onToggle,
                    })
                  )}
                </SortableContext>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DraggableMenuRow({
  item,
  isLast,
  isWein,
  onToggle,
}: {
  item: MenuItem;
  isLast: boolean;
  isWein?: boolean;
  onToggle: (item: MenuItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
    opacity: isDragging ? 0.92 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-6 py-3 ${isLast ? '' : 'border-b border-gray-50'}`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1 touch-none shrink-0"
        aria-label="Reihenfolge ändern"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{item.Titel}</p>
        {item.Beschreibung && <p className="text-xs text-gray-400">{item.Beschreibung}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm text-gray-900">
          {isWein ? displayWeinPreisLine(item.Preis) : displaySpeisePreis(item.Preis)}
        </p>
        {isWein && item.Preis_Flasche && (
          <p className="text-xs text-gray-400">{displayWeinFlascheLine(item.Preis_Flasche)}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onToggle(item)}
        className="text-[10px] tracking-widest px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
      >
        ENTFERNEN
      </button>
    </div>
  );
}
