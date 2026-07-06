export type VehicleConditionTone = "broken" | "assembled" | "enhanced";

export interface VehicleCondition {
  stage: 1 | 2 | 3;
  label: string;
  short: string;
  tone: VehicleConditionTone;
}

export function vehicleConditionForTier(tier: number): VehicleCondition {
  if (tier <= 1) {
    return { stage: 1, label: "Разбитая", short: "Разбита", tone: "broken" };
  }
  if (tier === 2) {
    return { stage: 2, label: "Собранная", short: "Собрана", tone: "assembled" };
  }
  return { stage: 3, label: "Улучшенная", short: "Улучшена", tone: "enhanced" };
}

export function nextVehicleConditionLabel(tier: number): string {
  return vehicleConditionForTier(tier + 1).label;
}
