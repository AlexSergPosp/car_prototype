import { ArrowLeft, Check, Clock, Gauge, PackageCheck, Rocket, Timer, TrendingUp, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { EQUIPMENT_OPTIONS, LONG_ACTION_OPTIONS, OPTIMIZATION_COSTS, RARITY_CLASS, RARITY_NAME } from "../data";
import { effectiveIncome, expansionProgress, isRequirementDone, nextOptimizationCost } from "../game";
import type { Business, ExpansionRequirement } from "../types";

interface DetailPanelProps {
  business: Business | null;
  soft: number;
  hard: number;
  onBuyEquipment: (id: number, requirementId: string, equipmentId: string) => void;
  onStartAction: (id: number, requirementId: string) => void;
  onExpand: (id: number) => void;
  onOptimize: (id: number) => void;
  onBack: () => void;
}

export function DetailPanel(props: DetailPanelProps) {
  const { business, soft, hard, onBack, onBuyEquipment, onStartAction, onExpand, onOptimize } = props;
  const [equipmentReqId, setEquipmentReqId] = useState<string | null>(null);
  if (!business) {
    return <section className="detail-panel empty-detail"><button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Назад</button><span>Выберите бизнес, чтобы смотреть условия расширения.</span></section>;
  }

  const income = effectiveIncome(business);
  const tierTitle = business.maxed ? "МАКС" : `Тир ${business.tier}/4`;
  const progress = expansionProgress(business);
  const equipmentMatch = business.requirements.find((req) => req.id === equipmentReqId);
  const equipmentReq = equipmentMatch?.type === "equipment" ? equipmentMatch : null;

  return (
    <section className="detail-panel business-page">
      <div className="business-page-head">
        <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Назад</button>
        <div className="level-badge">{tierTitle}</div>
      </div>
      <div className="business-summary">
        <div className="business-summary-icon">{business.icon}</div>
        <div className="min-w-0">
          <h2>{business.name}</h2>
          <div className="business-summary-text">{business.manager ? "Автоматический сбор после зарплаты" : "Ручной сбор дохода"}</div>
        </div>
      </div>
      <div className="summary-stats">
        <SummaryStat icon={<TrendingUp size={15} />} label="Доход" value={`$${income.toFixed(2)}/сек`} />
        <SummaryStat icon={<Gauge size={15} />} label="Расширение" value={business.maxed ? "Максимум" : `${progress.done}/${progress.total}`} />
        <SummaryStat icon={<Users size={15} />} label="Менеджер" value={business.manager ? RARITY_NAME[business.manager.rarity] : "Не назначен"} />
      </div>
      <BusinessInfo business={business} />
      {business.maxed ? (
        <BusinessOptimization business={business} hard={hard} onOptimize={onOptimize} />
      ) : (
        <>
          <div className="mb-3 text-sm font-black text-slate-300">Условия расширения: {progress.done}/{progress.total}</div>
          <div className="requirement-list">
            {business.requirements.map((req) => (
              <RequirementCard
                business={business}
                key={req.id}
                req={req}
                soft={soft}
                onOpenEquipment={() => setEquipmentReqId(req.id)}
                onStartAction={onStartAction}
              />
            ))}
          </div>
          {progress.ready && <div className="upgrade-reward">+1 кристалл за уровень бизнеса</div>}
          <button className="primary-button expand" disabled={!progress.ready} onClick={() => onExpand(business.id)}>
            <Rocket size={18} /> {progress.ready ? `Upgrade до тира ${business.tier + 1}` : `Выполните условия ${progress.done}/${progress.total}`}
          </button>
          {equipmentReq && (
            <EquipmentPicker
              business={business}
              req={equipmentReq}
              soft={soft}
              onBuyEquipment={onBuyEquipment}
              onClose={() => setEquipmentReqId(null)}
            />
          )}
        </>
      )}
    </section>
  );
}

function SummaryStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="summary-stat">
      <span>{icon}{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BusinessInfo({ business }: { business: Business }) {
  if (!business.manager) return null;

  return (
    <div className="business-info-block">
      <div className="business-manager-row">
        <div className={`portrait sm ${RARITY_CLASS[business.manager.rarity]}`}>{business.manager.face}</div>
        <div className="min-w-0">
          <div className="text-sm font-black">{RARITY_NAME[business.manager.rarity]} менеджер</div>
          <div className="text-xs font-bold text-slate-300">Эффективность {Math.round(business.manager.efficiency * 100)}%</div>
          <div className="text-xs font-bold text-slate-500">Зарплата ${business.manager.salary.toFixed(2)}/сек</div>
        </div>
      </div>
    </div>
  );
}

function RequirementCard({ business, req, soft, onOpenEquipment, onStartAction }: { business: Business; req: ExpansionRequirement; soft: number; onOpenEquipment: () => void; onStartAction: (id: number, requirementId: string) => void }) {
  if (req.type === "work") return <WorkRequirement business={business} req={req} />;
  if (req.type === "equipment") return <EquipmentRequirement req={req} soft={soft} onOpenEquipment={onOpenEquipment} />;
  return <ActionRequirement business={business} req={req} soft={soft} onStartAction={onStartAction} />;
}

function WorkRequirement({ business, req }: { business: Business; req: Extract<ExpansionRequirement, { type: "work" }> }) {
  const done = isRequirementDone(business, req);
  const pct = Math.min(100, (business.workedSeconds / req.requiredSeconds) * 100);
  return (
    <div className="requirement-card">
      <RequirementHead done={done} icon={<Clock size={17} />} title="Наработка бизнеса" />
      <div className="requirement-text">{Math.floor(business.workedSeconds)} / {req.requiredSeconds} сек</div>
      <div className="requirement-bar"><div style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function EquipmentRequirement({ req, soft, onOpenEquipment }: { req: Extract<ExpansionRequirement, { type: "equipment" }>; soft: number; onOpenEquipment: () => void }) {
  const item = EQUIPMENT_OPTIONS.find((option) => option.id === req.equipmentId);
  const done = req.owned >= req.quantity;
  return (
    <div className="requirement-card">
      <RequirementHead done={done} icon={<PackageCheck size={17} />} title="Оборудование" />
      <div className="requirement-text">{item?.icon} {item?.name}: {req.owned}/{req.quantity} · ${req.unitCost} за шт.</div>
      <div className="requirement-bar"><div style={{ width: `${Math.min(100, (req.owned / req.quantity) * 100)}%` }} /></div>
      {!done && <button className="requirement-action" onClick={onOpenEquipment}>Выбрать оборудование</button>}
    </div>
  );
}

function ActionRequirement({ business, req, soft, onStartAction }: { business: Business; req: Extract<ExpansionRequirement, { type: "action" }>; soft: number; onStartAction: (id: number, requirementId: string) => void }) {
  const item = LONG_ACTION_OPTIONS.find((option) => option.id === req.actionId);
  const active = req.remaining > 0;
  const pct = active ? 100 - (req.remaining / req.duration) * 100 : req.done ? 100 : 0;
  return (
    <div className="requirement-card">
      <RequirementHead done={req.done} icon={<Timer size={17} />} title={item?.name ?? "Длительное действие"} />
      <div className="requirement-text">{req.done ? "Готово" : active ? `Осталось ${formatSeconds(req.remaining)}` : `${item?.icon ?? "⏱️"} $${req.cost} · ${formatSeconds(req.duration)}`}</div>
      <div className="requirement-bar"><div style={{ width: `${pct}%` }} /></div>
      {!req.done && !active && <button className="requirement-action" disabled={soft < req.cost} onClick={() => onStartAction(business.id, req.id)}>Начать действие</button>}
    </div>
  );
}

function EquipmentPicker({ business, req, soft, onBuyEquipment, onClose }: { business: Business; req: Extract<ExpansionRequirement, { type: "equipment" }>; soft: number; onBuyEquipment: (id: number, requirementId: string, equipmentId: string) => void; onClose: () => void }) {
  const required = EQUIPMENT_OPTIONS.find((item) => item.id === req.equipmentId);
  const catalog = [
    ...EQUIPMENT_OPTIONS.filter((item) => item.id === req.equipmentId),
    ...EQUIPMENT_OPTIONS.filter((item) => item.id !== req.equipmentId),
  ];
  const done = req.owned >= req.quantity;
  return (
    <div className="modal-overlay">
      <div className="modal-box equipment-picker">
        <div className="row-between mb-3">
          <h2>Выбор оборудования</h2>
          <button className="icon-quiet" onClick={onClose} title="Закрыть"><X size={17} /></button>
        </div>
        <div className="requirement-text mb-3">Нужно: {required?.icon} {required?.name} · {req.owned}/{req.quantity}</div>
        <div className="equipment-picker-list">
          {catalog.map((item) => {
            const isRequired = item.id === req.equipmentId;
            return (
              <button
                className={`catalog-option ${isRequired ? "required" : ""}`}
                disabled={!isRequired || done || soft < req.unitCost}
                key={item.id}
                onClick={() => onBuyEquipment(business.id, req.id, item.id)}
              >
                <span>{item.icon}</span>
                <strong>{item.name}</strong>
                <small>{isRequired ? `$${req.unitCost}` : "не требуется"}</small>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RequirementHead({ done, icon, title }: { done: boolean; icon: ReactNode; title: string }) {
  return <div className="requirement-head"><span>{icon}{title}</span>{done && <Check size={18} />}</div>;
}

function formatSeconds(seconds: number): string {
  const total = Math.ceil(seconds);
  const minutes = Math.floor(total / 60);
  const rest = String(total % 60).padStart(2, "0");
  return minutes > 0 ? `${minutes}:${rest}` : `${total} сек`;
}

function BusinessOptimization({ business, hard, onOptimize }: { business: Business; hard: number; onOptimize: (id: number) => void }) {
  const cost = nextOptimizationCost(business.optimizationLevel);
  const pct = (business.optimizationLevel / OPTIMIZATION_COSTS.length) * 100;
  return (
    <div className="business-optimization">
      <div className="row-between mb-3">
        <div className="section-title"><TrendingUp size={17} /> Оптимизация бизнеса</div>
        <div className="level-badge">{business.optimizationLevel}/5</div>
      </div>
      <div className="progress-track">
        <div className="group-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-bold text-slate-500">
        <span>+5%</span><span>+10%</span><span>+15%</span><span>+20%</span><span>+25%</span>
      </div>
      <button className="primary-button expand" disabled={cost == null || hard < cost} onClick={() => onOptimize(business.id)}>
        {cost == null ? "Оптимизация на максимуме" : `Улучшить оптимизацию — ${cost} 💎`}
      </button>
    </div>
  );
}
