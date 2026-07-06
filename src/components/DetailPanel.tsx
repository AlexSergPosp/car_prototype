import { ArrowLeft, Check, Clock, Gem, Layers, PackageCheck, Rocket, Timer, TrendingUp, Trophy, Tv, UserMinus, UserPlus, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { carArtForBusiness } from "../carArt";
import { EQUIPMENT_OPTIONS, LONG_ACTION_OPTIONS, MAX_BUSINESS_TIER, PRESTIGE_LEVELS, RARITY_CLASS, RARITY_NAME, vehicleLevelFactFor } from "../data";
import { effectiveIncome, expansionProgress, isRequirementDone, managerSalary, nextOptimizationBonus, nextOptimizationCost, optimizationBonus } from "../game";
import type { Business, ExpansionRequirement, ExpansionReward } from "../types";
import { vehicleConditionForTier } from "../vehicleConcept";
import { BusinessLevelStars } from "./BusinessLevelStars";
import { managerDisplayName, managerEfficiencyClass } from "./managerUi";

interface DetailPanelProps {
  business: Business | null;
  soft: number;
  hard: number;
  onBuyEquipment: (id: number, requirementId: string, equipmentId: string) => void;
  onStartAction: (id: number, requirementId: string) => void;
  onExpand: (id: number) => void;
  onSkipExpansion: (id: number) => void;
  onClaimExpansionReward: (id: number, reward: ExpansionReward) => void;
  onOptimize: (id: number) => void;
  onOptimizeAd: (id: number) => void;
  onOpenAssign: (id: number) => void;
  onRemoveManager: (id: number) => void;
  onBack: () => void;
}

export function DetailPanel(props: DetailPanelProps) {
  const { business, soft, hard, onBack, onBuyEquipment, onStartAction, onExpand, onSkipExpansion, onClaimExpansionReward, onOptimize, onOptimizeAd, onOpenAssign, onRemoveManager } = props;
  const [equipmentReqId, setEquipmentReqId] = useState<string | null>(null);
  const [managerInfoOpen, setManagerInfoOpen] = useState(false);
  const [rewardPopup, setRewardPopup] = useState<(ExpansionReward & { businessId: number; businessName: string }) | null>(null);

  useEffect(() => {
    if (!business?.pendingExpansionReward) return;
    setRewardPopup({ ...business.pendingExpansionReward, businessId: business.id, businessName: business.name });
    onClaimExpansionReward(business.id, business.pendingExpansionReward);
  }, [business?.id, business?.pendingExpansionReward, business?.name, onClaimExpansionReward]);

  if (!business) {
    return <section className="detail-panel empty-detail"><button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Назад</button><span>Выберите авто.</span></section>;
  }

  const income = effectiveIncome(business);
  const progress = expansionProgress(business);
  const restorationComplete = business.maxed || business.tier >= MAX_BUSINESS_TIER;
  const nextTierBusiness = { ...business, tier: business.tier + 1 };
  const nextIncome = restorationComplete ? income : effectiveIncome(nextTierBusiness);
  const tierGain = Math.max(0, nextIncome - income);
  const equipmentMatch = business.requirements.find((req) => req.id === equipmentReqId);
  const equipmentReq = equipmentMatch?.type === "equipment" ? equipmentMatch : null;

  return (
    <section className="detail-panel business-page">
      <div className="business-page-head">
        <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Назад</button>
        <div className="level-badge"><BusinessLevelStars level={business.tier} /></div>
      </div>
      <DetailBlock title="Автомобиль" meta={`$${income.toFixed(2)}/сек`}>
        <VehicleShowcase business={business} income={income} />
        <BusinessInfo business={business} onHire={() => onOpenAssign(business.id)} onInfo={() => setManagerInfoOpen(true)} />
      </DetailBlock>
      <DetailBlock title="Реставрация" meta={restorationComplete ? "MAX" : `${progress.done}/${progress.total}`}>
        {!restorationComplete ? (
          <>
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
          <UpgradeAction business={business} progressReady={progress.ready} tierGain={tierGain} onExpand={onExpand} onSkipExpansion={onSkipExpansion} />
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
        ) : (
          <div className="expansion-complete">Авто доведено до выставочного состояния.</div>
        )}
      </DetailBlock>
      <DetailBlock title="Престиж авто" meta={`${business.optimizationLevel}/${PRESTIGE_LEVELS.length}`} className="prestige-detail-block">
        <BusinessOptimization business={business} hard={hard} onOptimize={onOptimize} onOptimizeAd={onOptimizeAd} />
      </DetailBlock>
      {managerInfoOpen && business.manager && (
        <ManagerInfoModal
          business={business}
          onClose={() => setManagerInfoOpen(false)}
          onFire={() => {
            onRemoveManager(business.id);
            setManagerInfoOpen(false);
          }}
        />
      )}
      {rewardPopup && <UpgradeRewardModal reward={rewardPopup} onClose={() => setRewardPopup(null)} />}
    </section>
  );
}

function VehicleShowcase({ business, income }: { business: Business; income: number }) {
  const condition = vehicleConditionForTier(business.tier);
  const art = carArtForBusiness(business);
  return (
    <div className={`vehicle-showcase condition-${condition.tone}`}>
      <div className="vehicle-hero">
        <div className="vehicle-hero-glow" />
        {art ? (
          <img className="vehicle-stage-art" src={art} alt={`${business.name}: ${condition.label}`} />
        ) : (
          <div className="vehicle-hero-visual" aria-hidden="true">
            <div className="vehicle-cabin" />
            <div className="vehicle-body" />
            <div className="vehicle-wheel left" />
            <div className="vehicle-wheel right" />
            <div className="vehicle-light front" />
            <div className="vehicle-light rear" />
          </div>
        )}
        <div className="vehicle-hero-mark">{business.icon}</div>
        <div className="vehicle-hero-state">{condition.label}</div>
      </div>
      <div className="vehicle-showcase-copy">
        <h2>{business.name}</h2>
        <div className="business-summary-text">
          {business.manager ? "Механик ведет стенд" : "Ручной сбор выручки"} · выручка ${income.toFixed(2)}/сек
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ title, meta, children, className = "" }: { title: string; meta: string; children: ReactNode; className?: string }) {
  return (
    <section className={`detail-block ${className}`.trim()}>
      <div className="detail-block-head">
        <div>
          <strong>{title}</strong>
        </div>
        <em>{meta}</em>
      </div>
      <div className="detail-block-body">{children}</div>
    </section>
  );
}

function BusinessInfo({ business, onHire, onInfo }: { business: Business; onHire: () => void; onInfo: () => void }) {
  if (!business.manager) {
    return (
      <button className="business-manager-row empty manager-action-row" onClick={onHire}>
        <div className="empty-portrait"><UserPlus size={19} /></div>
        <div className="min-w-0">
          <div className="text-sm font-black">Назначить автомеханика</div>
          <div className="text-xs font-bold text-slate-500">Выбрать из бригады или взять премиум</div>
        </div>
      </button>
    );
  }
  return (
    <button className="business-manager-row manager-action-row" onClick={onInfo}>
      <div className={`portrait sm ${RARITY_CLASS[business.manager.rarity]}`}>{business.manager.face}</div>
      <div className="min-w-0">
        <div className="text-sm font-black">{managerDisplayName(business.manager)}</div>
        <div className="text-xs font-black text-slate-500">{RARITY_NAME[business.manager.rarity]} автомеханик</div>
        <div className={`text-xs font-bold ${managerEfficiencyClass(business.manager)}`}>Эффективность {Math.round(business.manager.efficiency * 100)}%</div>
        <div className="text-xs font-bold text-slate-500">Оплата ${managerSalary(business, business.manager).toFixed(2)}/сек</div>
      </div>
    </button>
  );
}

function ManagerInfoModal({ business, onClose, onFire }: { business: Business; onClose: () => void; onFire: () => void }) {
  if (!business.manager) return null;
  const income = effectiveIncome(business);
  const name = managerDisplayName(business.manager);
  return (
    <div className="modal-overlay">
      <div className="modal-box manager-info-modal">
        <div className="row-between mb-4">
          <h2>{name}</h2>
          <button className="icon-quiet" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="manager-info-card">
          <div className={`portrait ${RARITY_CLASS[business.manager.rarity]}`}>{business.manager.face}</div>
          <div className="min-w-0">
            <div className="text-base font-black">{RARITY_NAME[business.manager.rarity]} автомеханик</div>
            <div className={`text-sm font-bold ${managerEfficiencyClass(business.manager)}`}>Эффективность {Math.round(business.manager.efficiency * 100)}%</div>
            <div className="text-sm font-bold text-slate-500">Оплата ${managerSalary(business, business.manager).toFixed(2)}/сек</div>
            <div className="text-sm font-bold text-emerald-300">Выручка авто ${income.toFixed(2)}/сек</div>
          </div>
        </div>
        <button className="primary-button danger" onClick={onFire}>
          <UserMinus size={18} /> Снять с авто
        </button>
      </div>
    </div>
  );
}

function UpgradeRewardModal({ reward, onClose }: { reward: ExpansionReward & { businessId: number; businessName: string }; onClose: () => void }) {
  const incomeGain = Math.max(0, reward.incomeAfter - reward.incomeBefore);
  const levelFact = vehicleLevelFactFor(reward.businessId, reward.toTier);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box upgrade-reward-modal">
        <div className="reward-burst-icon"><Rocket size={34} /></div>
        <h2>{reward.businessName}</h2>
        <div className="reward-tier">{vehicleConditionForTier(reward.fromTier).label} → {vehicleConditionForTier(reward.toTier).label}</div>
        {levelFact && (
          <div className="reward-history">
            <span>Факт легенды</span>
            <p>{levelFact}</p>
          </div>
        )}
        <div className="reward-income-flow">
          <span>${reward.incomeBefore.toFixed(2)}/сек</span>
          <TrendingUp size={22} />
          <strong>${reward.incomeAfter.toFixed(2)}/сек</strong>
        </div>
        <div className="reward-gain">+${incomeGain.toFixed(2)}/сек выручки</div>
        <div className="reward-gem"><Gem size={22} /> +{reward.gems} гем начислен</div>
        <button className="primary-button expand" onClick={onClose}>Продолжить</button>
      </div>
    </div>
  );
}

function UpgradeAction({ business, progressReady, tierGain, onExpand, onSkipExpansion }: { business: Business; progressReady: boolean; tierGain: number; onExpand: (id: number) => void; onSkipExpansion: (id: number) => void }) {
  const active = business.expansionRemaining > 0;
  const buildPct = active && business.expansionDuration > 0 ? 100 - (business.expansionRemaining / business.expansionDuration) * 100 : 0;
  const buttonText = active
    ? `Реставрация ${formatSeconds(business.expansionRemaining)}`
    : progressReady
      ? "Реставрировать"
      : "Закройте работы";
  return (
    <div className="upgrade-preview">
      <div className="upgrade-preview-main">
        <strong>+${tierGain.toFixed(2)}/сек</strong>
      </div>
      {active && <div className="upgrade-build-bar"><div style={{ width: `${buildPct}%` }} /></div>}
      <button className="primary-button expand" disabled={!progressReady || active} onClick={() => onExpand(business.id)}>
        <Layers size={18} /> {buttonText}
      </button>
      {active && (
        <button className="primary-button ad" onClick={() => onSkipExpansion(business.id)}>
          <Tv size={18} /> Ускорить за рекламу
        </button>
      )}
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
  const remaining = Math.max(0, req.requiredSeconds - business.workedSeconds);
  return <RequirementRow done={done} icon={<Clock size={17} />} title="Изучение чертежей" text={done ? "Готово" : `Осталось ${formatSeconds(remaining)}`} progress={pct} />;
}

function EquipmentRequirement({ req, soft, onOpenEquipment }: { req: Extract<ExpansionRequirement, { type: "equipment" }>; soft: number; onOpenEquipment: () => void }) {
  const item = EQUIPMENT_OPTIONS.find((option) => option.id === req.equipmentId);
  const done = req.owned >= req.quantity;
  return (
    <RequirementRow
      done={done}
      icon={<PackageCheck size={17} />}
      title="Запчасть"
      text={`${item?.icon ?? ""} ${item?.name ?? ""}: ${req.owned}/${req.quantity} · $${req.unitCost} за шт.`}
      progress={Math.min(100, (req.owned / req.quantity) * 100)}
      action={!done && <button className="requirement-action" disabled={soft < req.unitCost} onClick={onOpenEquipment}>Выбрать</button>}
    />
  );
}

function ActionRequirement({ business, req, soft, onStartAction }: { business: Business; req: Extract<ExpansionRequirement, { type: "action" }>; soft: number; onStartAction: (id: number, requirementId: string) => void }) {
  const item = LONG_ACTION_OPTIONS.find((option) => option.id === req.actionId);
  const active = req.remaining > 0;
  const pct = active ? 100 - (req.remaining / req.duration) * 100 : req.done ? 100 : 0;
  return (
    <RequirementRow
      done={req.done}
      icon={<Timer size={17} />}
      title={item?.name ?? "Работа с авто"}
      text={req.done ? "Готово" : active ? `Осталось ${formatSeconds(req.remaining)}` : `${item?.icon ?? "⏱️"} $${req.cost} · ${formatSeconds(req.duration)}`}
      progress={pct}
      action={!req.done && !active && <button className="requirement-action" disabled={soft < req.cost} onClick={() => onStartAction(business.id, req.id)}>Начать</button>}
    />
  );
}

function RequirementRow({ done, icon, title, text, progress, action }: { done: boolean; icon: ReactNode; title: string; text: string; progress: number; action?: ReactNode }) {
  return (
    <div className={`requirement-row ${done ? "done" : ""}`}>
      <div className="requirement-state">{done ? <Check size={17} /> : icon}</div>
      <div className="requirement-main">
        <div className="requirement-row-title">{title}</div>
        <div className="requirement-text">{text}</div>
        <div className="requirement-bar"><div style={{ width: `${progress}%` }} /></div>
      </div>
      {action && <div className="requirement-row-action">{action}</div>}
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
          <h2>Выбор запчасти</h2>
          <button className="icon-quiet" onClick={onClose} title="Закрыть"><X size={17} /></button>
        </div>
        <div className="requirement-text mb-3">Нужно: {required?.icon} {required?.name} · {req.owned}/{req.quantity}</div>
        <div className="equipment-picker-list">
          {catalog.map((item) => {
            const isRequired = item.id === req.equipmentId;
            return (
              <button className={`catalog-option ${isRequired ? "required" : ""}`} disabled={!isRequired || done || soft < req.unitCost} key={item.id} onClick={() => onBuyEquipment(business.id, req.id, item.id)}>
                <span className="catalog-option-icon">{item.icon}</span>
                <span className="catalog-option-main">
                  <strong>{item.name}</strong>
                  <small>{isRequired ? `${req.owned}/${req.quantity}` : "не требуется сейчас"}</small>
                </span>
                <span className={`catalog-option-price ${isRequired ? "" : "muted"}`}>{isRequired ? `$${req.unitCost}` : "—"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BusinessOptimization({ business, hard, onOptimize, onOptimizeAd }: { business: Business; hard: number; onOptimize: (id: number) => void; onOptimizeAd: (id: number) => void }) {
  const cost = nextOptimizationCost(business.optimizationLevel);
  const nextBonus = nextOptimizationBonus(business.optimizationLevel);
  const pct = (business.optimizationLevel / PRESTIGE_LEVELS.length) * 100;
  const canUpgrade = cost != null;
  const currentBonus = optimizationBonus(business.optimizationLevel);
  const currentPrestige = business.optimizationLevel > 0 ? PRESTIGE_LEVELS[business.optimizationLevel - 1] : null;
  const nextPrestige = PRESTIGE_LEVELS[business.optimizationLevel] ?? null;
  const nextBusiness = canUpgrade ? { ...business, optimizationLevel: business.optimizationLevel + 1 } : business;
  const currentIncome = effectiveIncome(business);
  const nextIncome = effectiveIncome(nextBusiness);
  const incomeGain = Math.max(0, nextIncome - currentIncome);
  const summaryTitle = canUpgrade && nextPrestige ? nextPrestige.name : currentPrestige?.name ?? "Витрина без престижа";
  const summaryText = canUpgrade && nextPrestige ? nextPrestige.description : currentPrestige?.description ?? "Все уровни взяты.";
  return (
    <div className={`business-optimization ${canUpgrade ? "" : "complete"}`}>
      <div className="prestige-summary">
        <div className="prestige-emblem"><Trophy size={20} /></div>
        <div className="prestige-summary-main">
          <span>{canUpgrade ? "Следующий шаг экспозиции" : "Экспозиция завершена"}</span>
          <strong>{summaryTitle}</strong>
          <p>{summaryText}</p>
        </div>
        <div className="prestige-level-pill">{business.optimizationLevel}/{PRESTIGE_LEVELS.length}</div>
      </div>

      <div className="prestige-steps" aria-label="Уровни престижа авто">
        {PRESTIGE_LEVELS.map((level, index) => {
          const step = index + 1;
          const done = business.optimizationLevel >= step;
          const active = canUpgrade && business.optimizationLevel + 1 === step;
          return (
            <div className={`prestige-step ${done ? "done" : ""} ${active ? "active" : ""}`} key={level.name}>
              <span>{done ? <Check size={13} /> : step}</span>
              <small>{level.name}</small>
            </div>
          );
        })}
      </div>

      <div className="progress-track prestige-progress"><div className="group-fill" style={{ width: `${pct}%` }} /></div>

      <div className="prestige-economy">
        <div className="prestige-economy-card">
          <span>Сейчас</span>
          <strong>+{Math.round(currentBonus * 100)}%</strong>
          <small>${currentIncome.toFixed(2)}/сек</small>
        </div>
        <TrendingUp className="prestige-economy-arrow" size={21} />
        <div className="prestige-economy-card highlighted">
          <span>{canUpgrade ? "После шага" : "Итог"}</span>
          <strong>+{Math.round((nextBonus ?? currentBonus) * 100)}%</strong>
          <small>${nextIncome.toFixed(2)}/сек</small>
        </div>
      </div>

      <div className="optimization-impact prestige-impact">
        {canUpgrade && nextPrestige ? (
          <>
            <strong>Вырастет ценность стенда</strong>
            <span>+${incomeGain.toFixed(2)}/сек к выручке · ${currentIncome.toFixed(2)} → ${nextIncome.toFixed(2)}/сек</span>
          </>
        ) : (
          <>
            <strong>Престиж на максимуме</strong>
            <span>{currentPrestige?.description ?? "Все уровни взяты."}</span>
          </>
        )}
      </div>
      <div className="optimization-actions prestige-actions">
        <button className="primary-button prestige-buy" disabled={!canUpgrade || hard < (cost ?? 0)} onClick={() => onOptimize(business.id)}>
          <Gem size={17} /> {canUpgrade ? `Поднять · ${cost}` : "MAX"}
        </button>
        <button className="primary-button prestige-ad" disabled={!canUpgrade} onClick={() => onOptimizeAd(business.id)}>
          <Tv size={17} /> Пиар за рекламу
        </button>
      </div>
    </div>
  );
}

function formatSeconds(seconds: number): string {
  const total = Math.ceil(seconds);
  const minutes = Math.floor(total / 60);
  const rest = String(total % 60).padStart(2, "0");
  return minutes > 0 ? `${minutes}:${rest}` : `${total} сек`;
}
