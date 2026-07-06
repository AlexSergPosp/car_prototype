import { vehicleConditionForTier } from "../vehicleConcept";

export function BusinessLevelStars({ level, compact = false }: { level: number; compact?: boolean }) {
  const condition = vehicleConditionForTier(level);
  if (compact) {
    return (
      <div className={`business-level-stars condition-${condition.tone} compact`} aria-label={`Состояние авто: ${condition.label}, звезд ${condition.stage}`}>
        <span className="condition-star-count" aria-hidden="true">
          {Array.from({ length: condition.stage }, () => "★").join("")}
        </span>
      </div>
    );
  }
  return (
    <div className={`business-level-stars condition-${condition.tone}`} aria-label={`Состояние авто: ${condition.label}`}>
      <span className="condition-pips" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <i className={index < condition.stage ? "filled" : ""} key={index} />
        ))}
      </span>
      <span>{condition.label}</span>
    </div>
  );
}
