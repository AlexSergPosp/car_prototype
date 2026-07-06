import { Gem, Goal, RotateCcw } from "lucide-react";
import { MONEY_GOAL } from "../data";
import { formatMoney } from "../game";

interface TopBarProps {
  soft: number;
  hard: number;
  totalAuto: number;
  onReset: () => void;
}

export function TopBar({ soft, hard, totalAuto, onReset }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="money-pill">
        <span className="coin">$</span>
        <span>{formatMoney(soft)}</span>
      </div>
      <div className="text-center">
        <div className="app-title">Бизнес Империя</div>
        <div className="income-line">+${formatMoney(totalAuto)}/сек</div>
      </div>
      <div className="top-actions">
        <div className="money-pill">
          <Gem size={18} />
          <span>{hard}</span>
        </div>
        <button className="reset-button" type="button" title="Полный сброс" aria-label="Полный сброс" onClick={onReset}>
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
}

export function GoalBar({ soft }: { soft: number }) {
  const progress = Math.min(100, (soft / MONEY_GOAL) * 100);
  return (
    <section className="goal-panel">
      <div className="row-between">
        <div className="section-title">
          <Goal size={17} />
          Цель: $1 000 000
        </div>
        <strong>${formatMoney(soft)} / $1M</strong>
      </div>
      <div className="progress-track tall">
        <div className="goal-fill" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
