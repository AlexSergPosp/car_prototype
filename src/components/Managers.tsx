import { Search, UserMinus } from "lucide-react";
import { RARITY_CLASS, RARITY_NAME } from "../data";
import type { Manager } from "../types";

interface ManagersProps {
  managers: Array<Manager | null>;
  searchCount: number;
  onSearch: (slot: number) => void;
  onFire: (slot: number) => void;
}

export function Managers({ managers, searchCount, onSearch, onFire }: ManagersProps) {
  const firstEmptySlot = managers.findIndex((manager) => !manager);
  const filledCount = managers.filter(Boolean).length;

  return (
    <section className="panel">
      <div className="row-between mb-3">
        <div className="section-title">👔 Резерв менеджеров</div>
        <span className="bench-count">{filledCount}/{managers.length}</span>
      </div>
      {filledCount === 0 ? (
        <button className="manager-search-wide" onClick={() => onSearch(firstEmptySlot)}>
          <Search size={22} />
          <span>Найти первого менеджера</span>
          <small>{searchCount === 0 ? "Бесплатно" : "Реклама"}</small>
        </button>
      ) : (
        <div className="manager-bench">
          {managers.map((manager, slot) => (
            <div className="manager-slot" key={slot}>
              {manager ? (
                <ManagerCard manager={manager} onFire={() => onFire(slot)} />
              ) : (
                <button className="empty-manager" onClick={() => onSearch(slot)}>
                  <Search size={22} />
                  <span>Искать</span>
                  <small>{searchCount === 0 ? "Бесплатно" : "Реклама"}</small>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ManagerCard({ manager, onFire }: { manager: Manager; onFire: () => void }) {
  return (
    <div className="manager-card">
      <div className={`portrait sm ${RARITY_CLASS[manager.rarity]}`}>{manager.face}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-black">{RARITY_NAME[manager.rarity]}</div>
        <div className="truncate text-xs font-bold text-slate-300">{manager.desc}</div>
      </div>
      <button className="icon-danger" onClick={onFire} title="Отказать">
        <UserMinus size={16} />
      </button>
    </div>
  );
}
