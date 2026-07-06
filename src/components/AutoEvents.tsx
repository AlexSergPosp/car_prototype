import { ArrowLeft, Check, ChevronRight, Clock, Flag, Lock, Send, Trophy, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { AUTO_EVENT_RECOVERY_SECONDS, autoEventById, autoEventCooldownFor, autoEventRewardSoft, autoEventSuccessChance, topContestStats, vehicleStatsForBusiness, VEHICLE_STAT_KEYS } from "../autoEvents";
import { AUTO_EVENT_CONTESTS, MAX_BUSINESS_TIER, OPTIMIZATION_COSTS, VEHICLE_STAT_LABELS, VEHICLE_STAT_SHORT_LABELS } from "../data";
import { formatMoney } from "../game";
import type { AutoEventCooldowns, AutoEventReward, AutoEventRun, Business, VehicleStatKey } from "../types";

interface AutoEventsProps {
  businesses: Business[];
  unlocked: boolean;
  run: AutoEventRun | null;
  reward: AutoEventReward | null;
  cooldowns: AutoEventCooldowns;
  onBack: () => void;
  onStart: (eventId: string, businessId: number) => void;
  onClaim: () => void;
}

interface AutoEventSummaryProps {
  unlocked: boolean;
  reward: AutoEventReward | null;
  onOpen: () => void;
}

type AutoEventCandidate = { business: Business; chance: number; cooldown: number };

export function AutoEventSummary({ unlocked, reward, onOpen }: AutoEventSummaryProps) {
  const hasUpdate = Boolean(reward);
  return (
    <section className={`panel auto-event-summary-card compact ${hasUpdate ? "has-update" : ""} ${!unlocked ? "locked" : ""}`}>
      <div className="auto-event-summary-main">
        <div className="auto-event-entry-icon">
          <Flag size={22} />
          {hasUpdate && <span className="auto-event-update-badge">!</span>}
        </div>
        <div className="section-title">Автоивенты</div>
      </div>
      <button className="auto-event-summary-button" disabled={!unlocked} onClick={onOpen}>
        Перейти <ChevronRight size={17} />
      </button>
    </section>
  );
}

export function AutoEvents({ businesses, unlocked, run, reward, cooldowns, onBack, onStart, onClaim }: AutoEventsProps) {
  const [selectedEventId, setSelectedEventId] = useState(AUTO_EVENT_CONTESTS[0]?.id ?? "");
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [carPickerOpen, setCarPickerOpen] = useState(false);
  const selectedContest = autoEventById(selectedEventId) ?? AUTO_EVENT_CONTESTS[0];
  const openedBusinesses = businesses.filter((business) => business.opened);
  const candidates = useMemo<AutoEventCandidate[]>(() => (
    selectedContest
      ? openedBusinesses
        .map((business) => ({
          business,
          chance: autoEventSuccessChance(business, selectedContest),
          cooldown: autoEventCooldownFor(cooldowns, business.id),
        }))
        .sort((left, right) => {
          const leftReady = left.cooldown <= 0;
          const rightReady = right.cooldown <= 0;
          if (leftReady !== rightReady) return leftReady ? -1 : 1;
          return right.chance - left.chance;
        })
      : []
  ), [openedBusinesses, selectedContest, cooldowns]);
  const selectedCandidate = candidates.find((candidate) => candidate.business.id === selectedBusinessId) ?? candidates[0] ?? null;
  const selectedBusiness = selectedCandidate?.business ?? null;
  const selectedChance = selectedCandidate?.chance ?? 0;
  const selectedCooldown = selectedCandidate?.cooldown ?? 0;
  const selectedReward = selectedBusiness && selectedContest ? autoEventRewardSoft(selectedBusiness, selectedContest) : 0;
  const canStartSelected = Boolean(selectedBusiness && selectedCooldown <= 0);

  let body: ReactNode = null;

  if (!unlocked) {
    body = (
      <section className="panel auto-event-panel locked">
        <div className="auto-event-lock">
          <div className="auto-event-lock-icon"><Lock size={22} /></div>
          <div>
            <div className="section-title">Автоивенты</div>
            <strong>Откроется после открытия «Гоночных мифов»</strong>
          </div>
        </div>
      </section>
    );
  } else if (reward) {
    body = <AutoEventRewardPanel reward={reward} businesses={businesses} onClaim={onClaim} />;
  } else if (run) {
    body = <AutoEventRunPanel run={run} businesses={businesses} />;
  } else if (selectedContest) {
    const targetStats = topContestStats(selectedContest, 3);
    const readyCount = candidates.filter((candidate) => candidate.cooldown <= 0).length;
    body = (
      <div className="auto-event-simple">
        <section className="auto-event-hero-card">
          <div className="auto-event-hero-main">
            <div className="auto-event-hero-icon">{selectedContest.icon}</div>
            <div>
              <span>Конкурс</span>
              <strong>{selectedContest.name}</strong>
              <small>{selectedContest.description}</small>
            </div>
          </div>
          <div className="auto-event-hero-metrics">
            <div><span>Время</span><strong>{formatSeconds(selectedContest.duration)}</strong></div>
            <div><span>Награда</span><strong>${formatMoney(selectedBusiness ? selectedReward : selectedContest.rewardSoft)}</strong></div>
            <div><span>Готово авто</span><strong>{readyCount}/{candidates.length}</strong></div>
          </div>
        </section>

        <section className="auto-event-contest-tabs" aria-label="Выбор конкурса">
          {AUTO_EVENT_CONTESTS.map((contest) => {
            const active = contest.id === selectedContest.id;
            return (
              <button
                className={`auto-event-contest-tab ${active ? "active" : ""}`}
                key={contest.id}
                onClick={() => {
                  setSelectedEventId(contest.id);
                  setSelectedBusinessId(null);
                }}
              >
                <span>{contest.icon}</span>
                <strong>{contest.name}</strong>
              </button>
            );
          })}
        </section>

        <section className="auto-event-pick-card">
          <div className="auto-event-pick-head">
            <div>
              <span>Авто для заявки</span>
              <strong>{selectedBusiness?.name ?? "Нет открытых авто"}</strong>
              <small>
                {selectedBusiness
                  ? selectedCooldown > 0
                    ? `Подготовка еще ${formatSeconds(selectedCooldown)}`
                    : `Рест. ${selectedBusiness.tier}/${MAX_BUSINESS_TIER} · Престиж ${selectedBusiness.optimizationLevel}/${OPTIMIZATION_COSTS.length}`
                  : "Открой авто, чтобы отправлять на конкурс."}
              </small>
            </div>
            {selectedBusiness && (
              <div className={chanceClass(selectedChance)}>
                <span>{formatChance(selectedChance)}</span>
                <small>шанс</small>
              </div>
            )}
          </div>

          {selectedBusiness && (
            <VehicleStatBars business={selectedBusiness} targetStats={targetStats} />
          )}

          <button className="auto-event-select-button" disabled={candidates.length === 0} onClick={() => setCarPickerOpen(true)}>
            Выбрать авто <ChevronRight size={17} />
          </button>
        </section>

        {selectedBusiness && (
          <section className="auto-event-submit-card">
            <div className="auto-event-submit-summary">
              <div><span>Конкурс</span><strong>{selectedContest.name}</strong></div>
              <div><span>Выигрыш</span><strong>${formatMoney(selectedReward)} · {selectedContest.rewardHard} 💎</strong></div>
            </div>
            {selectedCooldown > 0 && <div className="auto-event-cooldown-note">Это авто готовится еще {formatSeconds(selectedCooldown)}. Выбери другое или дождись восстановления.</div>}
            <button className="primary-button auto-event-start" disabled={!canStartSelected} onClick={() => onStart(selectedContest.id, selectedBusiness.id)}>
              <Send size={17} /> {selectedCooldown > 0 ? "Авто на подготовке" : "Отправить авто"}
            </button>
          </section>
        )}

        {carPickerOpen && (
          <AutoEventCarPicker
            candidates={candidates}
            selectedBusinessId={selectedBusiness?.id ?? null}
            targetStats={targetStats}
            onClose={() => setCarPickerOpen(false)}
            onSelect={(businessId) => {
              setSelectedBusinessId(businessId);
              setCarPickerOpen(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <section className="auto-event-screen">
      <div className="auto-event-screen-head">
        <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Назад</button>
        <div>
          <div className="section-title">Автоивенты</div>
          <strong>Задания для легендарных авто</strong>
        </div>
      </div>
      {body}
    </section>
  );
}

function AutoEventCarPicker({ candidates, selectedBusinessId, targetStats, onClose, onSelect }: {
  candidates: AutoEventCandidate[];
  selectedBusinessId: number | null;
  targetStats: VehicleStatKey[];
  onClose: () => void;
  onSelect: (businessId: number) => void;
}) {
  return (
    <div className="modal-overlay auto-event-picker-overlay" onClick={onClose}>
      <div className="modal-box auto-event-picker-modal" onClick={(event) => event.stopPropagation()}>
        <div className="auto-event-picker-head">
          <div>
            <span>Выбор авто</span>
            <strong>Кого отправить на конкурс</strong>
          </div>
          <button className="icon-quiet" onClick={onClose} title="Закрыть"><X size={18} /></button>
        </div>
        <div className="auto-event-picker-list">
          {candidates.map(({ business, chance, cooldown }) => {
            const stats = vehicleStatsForBusiness(business.id);
            return (
              <button
                className={`auto-event-picker-car ${business.id === selectedBusinessId ? "selected" : ""} ${cooldown > 0 ? "cooldown" : ""}`}
                key={business.id}
                onClick={() => onSelect(business.id)}
              >
                <span className="auto-event-car-title">
                  <strong>{business.name}</strong>
                  <small>{cooldown > 0 ? `Подготовка ${formatSeconds(cooldown)}` : `Рест. ${business.tier}/${MAX_BUSINESS_TIER} · Престиж ${business.optimizationLevel}/${OPTIMIZATION_COSTS.length}`}</small>
                  <span className="auto-event-car-tags">
                    {targetStats.map((stat) => (
                      <i key={stat}>{VEHICLE_STAT_SHORT_LABELS[stat]} {stats[stat]}</i>
                    ))}
                  </span>
                </span>
                <span className={cooldown > 0 ? "auto-event-cooldown-chip" : chanceClass(chance)}>
                  {cooldown > 0 ? "ждет" : formatChance(chance)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AutoEventRunPanel({ run, businesses }: { run: AutoEventRun; businesses: Business[] }) {
  const contest = autoEventById(run.eventId);
  const business = businesses.find((item) => item.id === run.businessId);
  const pct = run.duration > 0 ? 100 - (run.remaining / run.duration) * 100 : 100;
  return (
    <section className="panel auto-event-panel active-run auto-event-state-panel">
      <div className="auto-event-state-hero">
        <div className="auto-event-lock-icon"><Clock size={23} /></div>
        <div>
          <span>Заявка в работе</span>
          <strong>{contest?.name ?? "Конкурс"}</strong>
          <small>{business?.name ?? "Авто"} уже на площадке. Результат будет после таймера.</small>
        </div>
      </div>
      <div className="auto-event-state-grid">
        <div>
          <span>Осталось</span>
          <strong>{formatSeconds(run.remaining)}</strong>
        </div>
        <div>
          <span>Шанс</span>
          <strong>{formatChance(run.chance)}</strong>
        </div>
        <div>
          <span>Награда</span>
          <strong>${formatMoney(run.rewardSoft)}</strong>
        </div>
      </div>
      <div className="auto-event-selected">
        <div className="auto-event-selected-main">
          <span>Отправлено авто</span>
          <strong>{business?.name ?? "Авто"}</strong>
          <small>Заявка закрыта до завершения текущего ивента.</small>
        </div>
      </div>
      <div className="auto-event-progress"><div style={{ width: `${pct}%` }} /></div>
    </section>
  );
}

function AutoEventRewardPanel({ reward, businesses, onClaim }: { reward: AutoEventReward; businesses: Business[]; onClaim: () => void }) {
  const contest = autoEventById(reward.eventId);
  const business = businesses.find((item) => item.id === reward.businessId);
  return (
    <section className={`panel auto-event-panel reward auto-event-state-panel ${reward.success ? "success" : "fail"}`}>
      <div className="auto-event-state-hero">
        <div className="auto-event-result-icon">{reward.success ? <Trophy size={24} /> : <X size={24} />}</div>
        <div>
          <span>{contest?.name ?? "Конкурс"}</span>
          <strong>{reward.success ? "Победа в ивенте" : "Утешительный результат"}</strong>
          <small>{business?.name ?? "Авто"} · шанс был {formatChance(reward.chance)}</small>
        </div>
      </div>
      <div className="auto-event-state-grid">
        <div>
          <span>Деньги</span>
          <strong>${formatMoney(reward.soft)}</strong>
        </div>
        <div>
          <span>Гемы</span>
          <strong>{reward.hard > 0 ? `${reward.hard} 💎` : "0"}</strong>
        </div>
        <div>
          <span>Итог</span>
          <strong>{reward.success ? "Победа" : "Опыт"}</strong>
        </div>
      </div>
      <button className="primary-button auto-event-start" onClick={onClaim}>
        <Check size={17} /> Забрать
      </button>
    </section>
  );
}

function VehicleStatBars({ business, targetStats }: { business: Business; targetStats: VehicleStatKey[] }) {
  const stats = vehicleStatsForBusiness(business.id);
  return (
    <div className="vehicle-stat-bars">
      {VEHICLE_STAT_KEYS.map((stat) => {
        const targeted = targetStats.includes(stat);
        return (
          <div className={`vehicle-stat-bar ${targeted ? "target" : ""}`} key={stat}>
            <span>{VEHICLE_STAT_LABELS[stat]}</span>
            <div><i style={{ width: `${(stats[stat] / 5) * 100}%` }} /></div>
            <strong>{stats[stat]}</strong>
          </div>
        );
      })}
    </div>
  );
}

function chanceClass(chance: number): string {
  return `auto-event-chance ${chance >= 0.78 ? "high" : chance >= 0.55 ? "mid" : "low"}`;
}

function formatChance(chance: number): string {
  return `${Math.round(chance * 100)}%`;
}

function formatSeconds(seconds: number): string {
  const total = Math.ceil(seconds);
  const minutes = Math.floor(total / 60);
  const rest = String(total % 60).padStart(2, "0");
  return minutes > 0 ? `${minutes}:${rest}` : `${total} сек`;
}
