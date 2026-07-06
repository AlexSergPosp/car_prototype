import { vehicleConditionForTier } from "../vehicleConcept";

export function BusinessLevelStars({ level, compact = false }: { level: number; compact?: boolean }) {
  const condition = vehicleConditionForTier(level);
  return (
    <div className={`business-level-stars condition-${condition.tone} ${compact ? "compact" : ""}`} aria-label={`Состояние авто: ${condition.label}`}>
      <span className="condition-pips" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <i className={index < condition.stage ? "filled" : ""} key={index} />
        ))}
      </span>
      <span>{compact ? condition.short : condition.label}</span>
    </div>
  );
}
