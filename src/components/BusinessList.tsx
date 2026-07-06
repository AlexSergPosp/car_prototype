import { Check, ChevronRight, Clock, Lock, Tv, UserPlus } from "lucide-react";
import { CATEGORIES, COLLECT_TIME, RARITY_CLASS, RARITY_NAME } from "../data";
import { effectiveIncome, expansionProgress, formatMoney } from "../game";
import type { Business, Manager } from "../types";

interface IncomeBurst {
  id: number;
  businessId: number;
  amount: number;
  mode: "manual" | "auto";
}

interface BusinessListProps {
  businesses: Business[];
  activeCategory: number;
  selectedId: number | null;
  soft: number;
  hasFreeManager: boolean;
  hasStoredManager: boolean;
  incomeBursts: IncomeBurst[];
  onSelect: (id: number) => void;
  onCollect: (id: number) => void;
  onOpenAssign: (id: number) => void;
  onRemoveManager: (id: number) => void;
  onOpenBusiness: (id: number) => void;
  onSkipUnlock: (id: number) => void;
}

export function BusinessList(props: BusinessListProps) {
  const items = props.businesses.filter((business) => business.catIdx === props.activeCategory);
  const opened = items.filter((business) => business.opened).length;
  return (
    <section className="business-list-panel">
      <div className="business-list-head">
        <div>
          <div className="section-title">Бизнесы уровня</div>
          <strong>{CATEGORIES[props.activeCategory].name}</strong>
        </div>
        <span className="bench-count">{opened}/{items.length}</span>
      </div>
      <div className="business-list">
        {items.map((business) => (
          <BusinessCard key={business.id} business={business} {...props} />
        ))}
      </div>
    </section>
  );
}

function BusinessCard(props: BusinessListProps & { business: Business }) {
  const { business, soft, hasFreeManager, hasStoredManager, incomeBursts, onSelect, onCollect, onOpenAssign, onRemoveManager, onOpenBusiness, onSkipUnlock } = props;
  if (!business.opened) {
    return <LockedBusinessCard business={business} soft={soft} onOpenBusiness={onOpenBusiness} onSkipUnlock={onSkipUnlock} />;
  }

  const income = effectiveIncome(business);
  const expansion = expansionProgress(business);
  const tier = business.maxed ? "MAX" : `T${business.tier}/4`;
  const manualCollect = income * COLLECT_TIME;
  const bursts = incomeBursts.filter((burst) => burst.businessId === business.id);
  const readyToCollect = !business.manager && business.collectReady;
  const statusClass = business.manager ? "auto" : readyToCollect ? "ready" : "manual";
  const statusText = business.manager ? "Авто" : readyToCollect ? "Готово" : "Ручной";
  const handleCardClick = () => {
    if (readyToCollect) onCollect(business.id);
    else onSelect(business.id);
  };
  return (
    <article className={`business-card ${business.manager ? "auto-active" : ""} ${readyToCollect ? "collectable" : ""}`} onClick={handleCardClick}>
      <div className="biz-icon">{business.icon}</div>
      <div className="min-w-0 flex-1">
        <div className="business-card-head">
          <h3 className="truncate text-lg font-black">{business.name}</h3>
          <span className={`status-pill ${statusClass}`}>{statusText}</span>
        </div>
        <div className="business-card-meta">
          <span>
            <small>Доход</small>
            <strong>${income.toFixed(1)}/сек</strong>
          </span>
          <span>
            <small>Рост</small>
            <strong>{tier} · {expansion.done}/{expansion.total}</strong>
          </span>
        </div>
        <BusinessProgress business={business} />
      </div>
      <div className="business-card-side">
        {business.manager ? (
          <ManagerBadge manager={business.manager} onRemove={() => onRemoveManager(business.id)} />
        ) : (
          <ManagerFrame isCollectable={readyToCollect} hasStoredManager={hasStoredManager} onOpenAssign={() => onOpenAssign(business.id)} />
        )}
        <button
          className="business-card-open"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(business.id);
          }}
          title="Открыть бизнес"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      {!hasFreeManager && business.manager && <div className="absolute right-3 top-3 text-[10px] font-black text-red-300">мест нет</div>}
      {readyToCollect && <div className="collect-hint">Собрать ${formatMoney(manualCollect)}</div>}
      <IncomeBursts bursts={bursts} />
    </article>
  );
}

function LockedBusinessCard({ business, soft, onOpenBusiness, onSkipUnlock }: { business: Business; soft: number; onOpenBusiness: (id: number) => void; onSkipUnlock: (id: number) => void }) {
  const waitingPrevious = business.unlockRemaining == null;
  const waitingTimer = business.unlockRemaining != null && business.unlockRemaining > 0;
  const ready = business.unlockRemaining === 0;
  const canOpen = ready && soft >= business.openCost;
  return (
    <article className={`business-card locked ${ready ? "unlock-ready" : ""}`}>
      <div className="biz-icon locked-icon"><Lock size={24} /></div>
      <div className="min-w-0 flex-1">
        <div className="business-card-head">
          <h3 className="truncate text-lg font-black">{business.name}</h3>
          <span className="status-pill manual">{ready ? "Доступен" : "Закрыт"}</span>
        </div>
        <div className="business-card-meta">
          <span>
            <small>Цена открытия</small>
            <strong>${formatMoney(business.openCost)}</strong>
          </span>
          <span>
            <small>Доступ</small>
            <strong>{waitingPrevious ? "после предыдущего" : waitingTimer ? formatTime(business.unlockRemaining ?? 0) : canOpen ? "можно открыть" : "нужны деньги"}</strong>
          </span>
        </div>
        <div className="business-progress locked-progress">
          <div className="business-progress-fill" style={{ width: ready ? "100%" : waitingTimer ? "35%" : "0%" }} />
          <span>{waitingPrevious ? "Сначала откройте предыдущий бизнес" : waitingTimer ? "Ждите таймер или пропустите" : canOpen ? "Готов к покупке" : "Накопите на открытие"}</span>
        </div>
      </div>
      <div className="business-card-side">
        {waitingTimer ? (
          <button className="business-open-action ad" onClick={(event) => { event.stopPropagation(); onSkipUnlock(business.id); }} title="Пропустить ожидание за рекламу">
            <Tv size={18} />
            <span>Skip</span>
          </button>
        ) : (
          <button className="business-open-action" disabled={!canOpen} onClick={(event) => { event.stopPropagation(); onOpenBusiness(business.id); }} title="Открыть бизнес">
            <ChevronRight size={18} />
            <span>Open</span>
          </button>
        )}
        {waitingTimer && <Clock size={16} className="business-card-arrow" />}
      </div>
    </article>
  );
}

function BusinessProgress({ business }: { business: Business }) {
  if (business.manager) {
    return <div className="business-progress auto"><div className="business-progress-fill" /><span>Авто сбор</span></div>;
  }
  const progress = Math.min(100, (business.collectTimer / COLLECT_TIME) * 100);
  return (
    <div className={`business-progress ${business.collectReady ? "ready" : ""}`}>
      <div className="business-progress-fill" style={{ width: `${progress}%` }} />
      <span>{business.collectReady ? "Готово к сбору" : `Сбор ${Math.floor(progress)}%`}</span>
    </div>
  );
}

function ManagerFrame({ isCollectable, hasStoredManager, onOpenAssign }: { isCollectable: boolean; hasStoredManager: boolean; onOpenAssign: () => void }) {
  if (isCollectable) {
    return <div className="manager-frame collectable"><span className="manager-frame-icon">👤</span><small>$$$</small></div>;
  }
  return (
    <button className="manager-frame action" onClick={(event) => { event.stopPropagation(); onOpenAssign(); }} title="Назначить менеджера">
      <UserPlus size={20} />
      <span>{hasStoredManager ? "Назначить" : "Найти"}</span>
    </button>
  );
}

function ManagerBadge({ manager, onRemove }: { manager: Manager; onRemove: () => void }) {
  return (
    <div className="manager-badge">
      <div className={`portrait sm ${RARITY_CLASS[manager.rarity]}`}>{manager.face}</div>
      <div className="manager-badge-text">
        <div className="truncate text-sm font-black">{RARITY_NAME[manager.rarity]}</div>
      </div>
      <button className="icon-quiet" onClick={(event) => { event.stopPropagation(); onRemove(); }} title="Убрать менеджера">
        <Check size={15} />
      </button>
    </div>
  );
}

function IncomeBursts({ bursts }: { bursts: IncomeBurst[] }) {
  return (
    <>
      {bursts.map((burst) => (
        <div className={`income-burst ${burst.mode}`} key={burst.id}>+${formatMoney(burst.amount)}</div>
      ))}
    </>
  );
}

function formatTime(seconds: number): string {
  const total = Math.ceil(seconds);
  const minutes = Math.floor(total / 60);
  const rest = String(total % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}
