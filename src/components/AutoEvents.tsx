import { ArrowLeft, Check, ChevronRight, Clock, Lock, Send, Trophy, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { autoEventById, autoEventRewardSoft, autoEventSuccessChance, topContestStats, vehicleStatsForBusiness, VEHICLE_STAT_KEYS } from "../autoEvents";
import { AUTO_EVENT_CONTESTS, MAX_BUSINESS_TIER, OPTIMIZATION_COSTS, VEHICLE_STAT_LABELS, VEHICLE_STAT_SHORT_LABELS } from "../data";
import { formatMoney } from "../game";
import type { AutoEventReward, AutoEventRun, Business, VehicleStatKey } from "../types";
import { BusinessLevelStars } from "./BusinessLevelStars";

interface AutoEventsProps {
  businesses: Business[];
  unlocked: boolean;
  run: AutoEventRun | null;
  reward: AutoEventReward | null;
  onBack: () => void;
  onStart: (eventId: string, businessId: number) => void;
  onClaim: () => void;
}

interface AutoEventSummaryProps {
  businesses: Business[];
  unlocked: boolean;
  run: AutoEventRun | null;
  reward: AutoEventReward | null;
  onOpen: () => void;
}

export function AutoEventSummary({ businesses, unlocked, run, reward, onOpen }: AutoEventSummaryProps) {
  const bestMatch = useMemo(() => bestAutoEventMatch(businesses), [businesses]);
  const runContest = run ? autoEventById(run.eventId) : null;
  const runBusiness = run ? businesses.find((item) => item.id === run.businessId) : null;
  const rewardContest = reward ? autoEventById(reward.eventId) : null;
  const rewardBusiness = reward ? businesses.find((item) => item.id === reward.businessId) : null;

  if (!unlocked) {
    return (
      <section className="panel auto-event-summary-card locked">
        <div className="auto-event-summary-main">
          <div className="auto-event-lock-icon"><Lock size={21} /></div>
          <div>
            <div className="section-title">Автоивенты</div>
            <strong>Откроется после «Гоночных мифов»</strong>
            <small>Потом можно будет отправлять авто на конкурсы с шансом и наградой.</small>
          </div>
        </div>
      </section>
    );
  }

  if (reward) {
    return (
      <section className={`panel auto-event-summary-card reward ${reward.success ? "success" : "fail"}`}>
        <div className="auto-event-summary-main">
          <div className="auto-event-result-icon">{reward.success ? <Trophy size={22} /> : <X size={22} />}</div>
          <div>
            <div className="section-title">Автоивенты</div>
            <strong>{reward.success ? "Награда готова" : "Ивент завершен"}</strong>
            <small>{rewardContest?.name ?? "Конкурс"} · {rewardBusiness?.name ?? "Авто"} · ${formatMoney(reward.soft)}{reward.hard > 0 ? ` · ${reward.hard} 💎` : ""}</small>
          </div>
        </div>
        <button className="auto-event-summary-button" onClick={onOpen}>
          Автоивенты <ChevronRight size={17} />
        </button>
      </section>
    );
  }

  if (run) {
    const pct = run.duration > 0 ? 100 - (run.remaining / run.duration) * 100 : 100;
    return (
      <section className="panel auto-event-summary-card active-run">
        <div className="auto-event-summary-main">
          <div className="auto-event-lock-icon"><Clock size={21} /></div>
          <div>
            <div className="section-title">Автоивенты</div>
            <strong>{runContest?.name ?? "Конкурс"} · {formatSeconds(run.remaining)}</strong>
            <small>{runBusiness?.name ?? "Авто"} · шанс {formatChance(run.chance)} · награда ${formatMoney(run.rewardSoft)}</small>
          </div>
        </div>
        <button className="auto-event-summary-button" onClick={onOpen}>
          Автоивенты <ChevronRight size={17} />
        </button>
        <div className="auto-event-progress"><div style={{ width: `${pct}%` }} /></div>
      </section>
    );
  }

  return (
    <section className="panel auto-event-summary-card">
      <div className="auto-event-summary-main">
        <div className="auto-event-lock-icon"><Send size={21} /></div>
        <div>
          <div className="section-title">Автоивенты</div>
          <strong>{bestMatch ? `${bestMatch.contest.name}: ${formatChance(bestMatch.chance)}` : "Нет открытых авто"}</strong>
          <small>{bestMatch ? `${bestMatch.business.name} · награда $${formatMoney(bestMatch.reward)} · ${bestMatch.contest.rewardHard} 💎` : "Открой авто, чтобы отправлять на задания."}</small>
        </div>
      </div>
      <button className="auto-event-summary-button" onClick={onOpen}>
        Автоивенты <ChevronRight size={17} />
      </button>
    </section>
  );
}

export function AutoEvents({ businesses, unlocked, run, reward, onBack, onStart, onClaim }: AutoEventsProps) {
  const [selectedEventId, setSelectedEventId] = useState(AUTO_EVENT_CONTESTS[0]?.id ?? "");
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const selectedContest = autoEventById(selectedEventId) ?? AUTO_EVENT_CONTESTS[0];
  const openedBusinesses = businesses.filter((business) => business.opened);
  const candidates = useMemo(() => (
    selectedContest
      ? openedBusinesses
        .map((business) => ({ business, chance: autoEventSuccessChance(business, selectedContest) }))
        .sort((left, right) => right.chance - left.chance)
      : []
  ), [openedBusinesses, selectedContest]);
  const selectedCandidate = candidates.find((candidate) => candidate.business.id === selectedBusinessId) ?? candidates[0] ?? null;
  const selectedBusiness = selectedCandidate?.business ?? null;
  const selectedChance = selectedCandidate?.chance ?? 0;
  const selectedReward = selectedBusiness && selectedContest ? autoEventRewardSoft(selectedBusiness, selectedContest) : 0;

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
    body = (
      <div className="auto-event-board">
        <section className="auto-event-overview">
          <div className="auto-event-overview-title">
            <span>{selectedContest.icon}</span>
            <div>
              <strong>{selectedContest.name}</strong>
              <small>Победа зависит от профильных статов, реставрации и престижа авто.</small>
            </div>
          </div>
          <div className="auto-event-overview-metrics">
            <div>
              <span>Время</span>
              <strong>{formatSeconds(selectedContest.duration)}</strong>
            </div>
            <div>
              <span>Награда</span>
              <strong>{selectedBusiness ? `$${formatMoney(selectedReward)}` : `$${formatMoney(selectedContest.rewardSoft)}`}</strong>
            </div>
            <div>
              <span>Гемы</span>
              <strong>{selectedContest.rewardHard} 💎</strong>
            </div>
          </div>
        </section>

        <section className="auto-event-step">
          <div className="auto-event-step-title">
            <span>1</span>
            <div>
              <strong>Конкурс</strong>
              <small>У каждого конкурса свой набор важных статов.</small>
            </div>
          </div>
          <div className="auto-event-contest-list">
            {AUTO_EVENT_CONTESTS.map((contest) => {
              const active = contest.id === selectedContest.id;
              return (
                <button
                  className={`auto-contest-card ${active ? "active" : ""}`}
                  key={contest.id}
                  onClick={() => {
                    setSelectedEventId(contest.id);
                    setSelectedBusinessId(null);
                  }}
                >
                  <span className="auto-contest-icon">{contest.icon}</span>
                  <span className="auto-contest-copy">
                    <strong>{contest.name}</strong>
                    <small>{topContestStats(contest, 2).map((stat) => VEHICLE_STAT_SHORT_LABELS[stat]).join(" + ")}</small>
                  </span>
                  <em><Clock size={13} /> {formatSeconds(contest.duration)}</em>
                </button>
              );
            })}
          </div>
          <div className="auto-event-goals">
            {selectedContest.goals.map((goal) => (
              <span key={goal}>{goal}</span>
            ))}
          </div>
          <p className="auto-event-description">{selectedContest.description}</p>
        </section>

        <section className="auto-event-step">
          <div className="auto-event-step-title">
            <span>2</span>
            <div>
              <strong>Авто</strong>
              <small>Список отсортирован по шансу для выбранного конкурса.</small>
            </div>
          </div>

          {selectedBusiness ? (
            <>
              <div className="auto-event-selected">
                <div className="auto-event-selected-main">
                  <span>Лучший кандидат сейчас</span>
                  <strong>{selectedBusiness.name}</strong>
                  <small>Реставрация {selectedBusiness.tier}/{MAX_BUSINESS_TIER} · Престиж {selectedBusiness.optimizationLevel}/{OPTIMIZATION_COSTS.length}</small>
                </div>
                <div className={chanceClass(selectedChance)}>
                  <span>{formatChance(selectedChance)}</span>
                  <small>шанс</small>
                </div>
              </div>

              <div className="auto-event-car-list readable">
                {candidates.map(({ business, chance }) => {
                  const stats = vehicleStatsForBusiness(business.id);
                  return (
                    <button className={`auto-event-car ${business.id === selectedBusiness.id ? "selected" : ""}`} key={business.id} onClick={() => setSelectedBusinessId(business.id)}>
                      <span className="auto-event-car-title">
                        <strong>{business.name}</strong>
                        <small>Рест. {business.tier}/{MAX_BUSINESS_TIER} · Престиж {business.optimizationLevel}/{OPTIMIZATION_COSTS.length}</small>
                        <span className="auto-event-car-tags">
                          {targetStats.map((stat) => (
                            <i key={stat}>{VEHICLE_STAT_SHORT_LABELS[stat]} {stats[stat]}</i>
                          ))}
                        </span>
                      </span>
                      <span className={chanceClass(chance)}>{formatChance(chance)}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="auto-event-empty">Нет открытых авто для заявки.</div>
          )}
        </section>

        {selectedBusiness && (
          <section className="auto-event-step auto-event-submit-step">
            <div className="auto-event-step-title">
              <span>3</span>
              <div>
                <strong>Заявка</strong>
                <small>Проверь шанс и награду перед отправкой.</small>
              </div>
            </div>
            <div className="auto-event-application">
              <div>
                <span>Конкурс</span>
                <strong>{selectedContest.name}</strong>
              </div>
              <div>
                <span>Авто</span>
                <strong>{selectedBusiness.name}</strong>
              </div>
              <div className={chanceClass(selectedChance)}>
                <span>{formatChance(selectedChance)}</span>
                <small>шанс</small>
              </div>
            </div>
            <VehicleStatBars business={selectedBusiness} targetStats={targetStats} />
            <div className="auto-event-reward-row">
              <span>Награда при победе</span>
              <strong>${formatMoney(selectedReward)} · {selectedContest.rewardHard} 💎</strong>
            </div>
            <button className="primary-button auto-event-start" onClick={() => onStart(selectedContest.id, selectedBusiness.id)}>
              <Send size={17} /> Отправить авто
            </button>
          </section>
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

function AutoEventRunPanel({ run, businesses }: { run: AutoEventRun; businesses: Business[] }) {
  const contest = autoEventById(run.eventId);
  const business = businesses.find((item) => item.id === run.businessId);
  const pct = run.duration > 0 ? 100 - (run.remaining / run.duration) * 100 : 100;
  return (
    <section className="panel auto-event-panel active-run">
      <div className="auto-event-head">
        <div>
          <div className="section-title">Автоивент</div>
          <strong>{contest?.name ?? "Конкурс"}</strong>
        </div>
        <div className="auto-event-time"><Clock size={15} /> {formatSeconds(run.remaining)}</div>
      </div>
      <div className="auto-event-selected">
        <div className="auto-event-selected-main">
          <span>На площадке</span>
          <strong>{business?.name ?? "Авто"}</strong>
          <small>Шанс победы {formatChance(run.chance)} · награда ${formatMoney(run.rewardSoft)}</small>
        </div>
        <div className={chanceClass(run.chance)}>
          <span>{formatChance(run.chance)}</span>
          <small>шанс</small>
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
    <section className={`panel auto-event-panel reward ${reward.success ? "success" : "fail"}`}>
      <div className="auto-event-result-icon">{reward.success ? <Trophy size={24} /> : <X size={24} />}</div>
      <div className="auto-event-result-copy">
        <span>{contest?.name ?? "Конкурс"}</span>
        <strong>{reward.success ? "Победа в ивенте" : "Утешительный результат"}</strong>
        <p>{business?.name ?? "Авто"} · шанс был {formatChance(reward.chance)}</p>
      </div>
      <div className="auto-event-reward-row result">
        <span>Получить</span>
        <strong>${formatMoney(reward.soft)}{reward.hard > 0 ? ` · ${reward.hard} 💎` : ""}</strong>
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

function bestAutoEventMatch(businesses: Business[]) {
  const openedBusinesses = businesses.filter((business) => business.opened);
  let best: { contest: NonNullable<ReturnType<typeof autoEventById>>; business: Business; chance: number; reward: number } | null = null;
  for (const contest of AUTO_EVENT_CONTESTS) {
    for (const business of openedBusinesses) {
      const chance = autoEventSuccessChance(business, contest);
      if (best && chance <= best.chance) continue;
      best = {
        contest,
        business,
        chance,
        reward: autoEventRewardSoft(business, contest),
      };
    }
  }
  return best;
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
