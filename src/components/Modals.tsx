import { Search, UserMinus, X } from "lucide-react";
import { RARITY_CLASS, RARITY_NAME } from "../data";
import type { Manager } from "../types";

interface ManagerModalProps {
  managers: Array<Manager | null>;
  open: boolean;
  searchCount: number;
  onSearch: (slot: number) => void;
  onAssign: (slot: number) => void;
  onFire: (slot: number) => void;
  onClose: () => void;
}

export function ManagerModal({ managers, open, searchCount, onSearch, onAssign, onFire, onClose }: ManagerModalProps) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="row-between mb-4">
          <h2>Выберите менеджера</h2>
          <button className="icon-quiet" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="manager-modal-grid">
          {managers.map((manager, slot) => (
            <div className="manager-modal-slot" key={slot}>
              {manager ? (
                <div className="manager-choice">
                  <button className="manager-choice-main" onClick={() => onAssign(slot)}>
                    <div className={`portrait ${RARITY_CLASS[manager.rarity]}`}>{manager.face}</div>
                    <div className="min-w-0 text-left">
                      <div className="text-base font-black">{RARITY_NAME[manager.rarity]}</div>
                      <div className="text-sm font-bold text-slate-300">Эффективность {Math.round(manager.efficiency * 100)}%</div>
                      <div className="text-xs text-slate-500">Зарплата ${manager.salary.toFixed(2)}/сек</div>
                    </div>
                  </button>
                  <button className="icon-danger" onClick={() => onFire(slot)} title="Отказать">
                    <UserMinus size={16} />
                  </button>
                </div>
              ) : (
                <button className="empty-manager modal-search" onClick={() => onSearch(slot)}>
                  <Search size={22} />
                  <span>Искать</span>
                  <small>{searchCount === 0 ? "Бесплатно" : "Реклама"}</small>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdModal({ seconds }: { seconds: number | null }) {
  if (seconds == null) return null;
  return (
    <div className="modal-overlay">
      <div className="ad-box">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Реклама</div>
        <div className="mt-3 text-7xl font-black text-white">{seconds}</div>
      </div>
    </div>
  );
}

export function VictoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box victory">
        <div className="text-6xl">🏆</div>
        <h2>Цель выполнена!</h2>
        <p>Бизнесы накопили $1 000 000. Можно продолжать прокачку групп и искать сильные связки менеджеров.</p>
        <button className="primary-button expand" onClick={onClose}>Продолжить</button>
      </div>
    </div>
  );
}
