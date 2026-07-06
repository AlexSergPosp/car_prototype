import { CATEGORIES, COLLECT_TIME, EQUIPMENT_OPTIONS, EXPANSION_BALANCE, FACES, LONG_ACTION_OPTIONS, MANAGER_RARITY_STATS, OPTIMIZATION_COSTS, RARITIES } from "./data";
import type { Business, ExpansionRequirement, Manager } from "./types";

export function createBusinesses(): Business[] {
  let id = 0;
  return CATEGORIES.flatMap((cat, catIdx) =>
    cat.biz.map((seed) => {
      const businessId = id++;
      return {
      id: businessId,
      name: seed.n,
      icon: seed.ic,
      catIdx,
      base: seed.base,
      tier: 1,
      opened: false,
      openCost: businessId === 0 ? 100 : nextBusinessOpenCost(100, businessId, catIdx),
      unlockRemaining: businessId === 0 ? 0 : null,
      manager: null,
      collectTimer: 0,
      collectReady: false,
      workedSeconds: 0,
      requirements: createExpansionRequirements(businessId, catIdx, 1, seed.base),
      optimizationLevel: 0,
      maxed: false,
      };
    }),
  );
}

export function createManager(seed: number): Manager {
  const rarity = RARITIES[seed % RARITIES.length];
  const face = FACES[seed % FACES.length];
  const base = MANAGER_RARITY_STATS[rarity];
  const spread = ((seed * 17) % 9) / 100;
  const efficiency = round2(base.efficiency + spread);
  const salary = round2(base.salary + spread * 1.1);
  return {
    id: seed,
    face,
    rarity,
    efficiency,
    salary,
    desc: `Эфф. ${Math.round(efficiency * 100)}% · зарплата $${salary.toFixed(2)}/сек`,
  };
}

export function baseIncome(business: Business): number {
  let income = business.base;
  income *= 1 + (business.tier - 1) * 1.5;
  income *= 1 + business.optimizationLevel * 0.05;
  return income;
}

export function effectiveIncome(business: Business): number {
  if (!business.opened) return 0;
  const gross = baseIncome(business);
  if (!business.manager) return gross;
  return Math.max(0, gross * business.manager.efficiency - business.manager.salary);
}

export function tickBusinesses(businesses: Business[], dt: number): { businesses: Business[]; income: number } {
  let income = 0;
  const next = businesses.map((business) => {
    const updated = { ...business };
    if (!updated.opened) {
      if (updated.unlockRemaining != null && updated.unlockRemaining > 0) {
        updated.unlockRemaining = Math.max(0, updated.unlockRemaining - dt);
      }
      return updated;
    }
    if (!updated.maxed) updated.workedSeconds += dt;
    if (updated.manager) income += effectiveIncome(updated) * dt;
    else if (!updated.collectReady) {
      updated.collectTimer = Math.min(COLLECT_TIME, updated.collectTimer + dt);
      updated.collectReady = updated.collectTimer >= COLLECT_TIME;
    }

    updated.requirements = updated.requirements.map((req) => tickRequirement(req, dt));
    return updated;
  });
  return { businesses: next, income };
}

export function expansionConfig(business: Business) {
  return EXPANSION_BALANCE[Math.min(business.tier - 1, EXPANSION_BALANCE.length - 1)];
}

export function expansionProgress(business: Business) {
  if (business.maxed) return { done: business.requirements.length, total: business.requirements.length, ready: false };
  const done = business.requirements.filter((req) => isRequirementDone(business, req)).length;
  return { done, total: business.requirements.length, ready: done === business.requirements.length };
}

export function isRequirementDone(business: Business, req: ExpansionRequirement): boolean {
  if (req.type === "work") return business.workedSeconds >= req.requiredSeconds;
  if (req.type === "equipment") return req.owned >= req.quantity;
  return req.done;
}

export function createExpansionRequirements(businessId: number, catIdx: number, tier: number, baseIncomeValue: number): ExpansionRequirement[] {
  const config = EXPANSION_BALANCE[Math.min(tier - 1, EXPANSION_BALANCE.length - 1)];
  const businessOrder = businessId % 4;
  const levelPressure = 1 + catIdx * 0.55 + businessOrder * 0.1 + (tier - 1) * 0.5 + baseIncomeValue * 0.015;
  const difficulty = 1 + catIdx * 0.85 + businessOrder * 0.16 + (tier - 1) * 1.25 + baseIncomeValue * 0.012;
  const total = businessId < 4 && tier === 1 ? 2 : 2 + ((businessId + tier) % 3);
  const requirements: ExpansionRequirement[] = [
    {
      id: `work-${tier}`,
      type: "work",
      requiredSeconds: Math.round(config.workSeconds * levelPressure),
    },
  ];

  for (let slot = 1; slot < total; slot += 1) {
    const preferEquipment = (businessId + tier + slot) % 2 === 0;
    requirements.push(preferEquipment
      ? makeEquipmentRequirement(businessId, catIdx, tier, slot, difficulty)
      : makeActionRequirement(businessId, catIdx, tier, slot, difficulty));
  }

  return requirements;
}

export function formatMoney(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return Math.floor(value).toString();
}

export function nextOptimizationCost(level: number): number | null {
  return level >= OPTIMIZATION_COSTS.length ? null : OPTIMIZATION_COSTS[level];
}

export function unlockDelaySeconds(levelIndex: number): number {
  return (levelIndex + 1) * 3 * 60;
}

export function nextBusinessOpenCost(balanceAfterPurchase: number, businessId: number, levelIndex: number): number {
  const earlyCosts = [100, 140, 260, 480];
  if (businessId < earlyCosts.length) return earlyCosts[businessId];
  const level = levelIndex + 1;
  const order = businessId % 4;
  const baseCost = 620 * Math.pow(1.95, businessId - 4) * (1 + levelIndex * 0.8 + order * 0.22);
  const balanceCost = balanceAfterPurchase * (1.15 + level * 0.2);
  return roundTo5(Math.max(baseCost, balanceCost));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function tickRequirement(req: ExpansionRequirement, dt: number): ExpansionRequirement {
  if (req.type !== "action" || req.done || req.remaining <= 0) return req;
  const remaining = Math.max(0, req.remaining - dt);
  return { ...req, remaining, done: remaining <= 0 };
}

function makeEquipmentRequirement(businessId: number, catIdx: number, tier: number, slot: number, difficulty: number): ExpansionRequirement {
  const item = EQUIPMENT_OPTIONS[(businessId * 3 + catIdx * 5 + tier * 7 + slot * 11) % EQUIPMENT_OPTIONS.length];
  const tierMultiplier = EXPANSION_BALANCE[Math.min(tier - 1, EXPANSION_BALANCE.length - 1)].costMultiplier;
  const levelCost = 1 + catIdx * 0.52 + (businessId % 4) * 0.12 + (tier - 1) * 0.32 + difficulty * 0.14;
  const earlyDiscount = catIdx === 0 && tier === 1 ? 0.45 : catIdx === 0 && tier === 2 ? 0.75 : 1;
  const unitCost = roundTo5(item.baseCost * tierMultiplier * levelCost * earlyDiscount);
  const quantity = Math.max(1, Math.round(1 + (tier - 1) * 0.9 + catIdx * 0.65 + slot * 0.25 + difficulty * 0.12));
  return { id: `eq-${tier}-${slot}`, type: "equipment", equipmentId: item.id, quantity, owned: 0, unitCost };
}

function makeActionRequirement(businessId: number, catIdx: number, tier: number, slot: number, difficulty: number): ExpansionRequirement {
  const item = LONG_ACTION_OPTIONS[(businessId * 5 + catIdx * 4 + tier * 3 + slot * 9) % LONG_ACTION_OPTIONS.length];
  const config = EXPANSION_BALANCE[Math.min(tier - 1, EXPANSION_BALANCE.length - 1)];
  const levelCost = 1 + catIdx * 0.48 + (businessId % 4) * 0.12 + (tier - 1) * 0.28 + difficulty * 0.12;
  const cost = roundTo5(item.baseCost * config.costMultiplier * levelCost);
  const duration = Math.round(item.baseSeconds * config.timeMultiplier * (1 + catIdx * 0.34 + slot * 0.08 + difficulty * 0.1));
  return { id: `act-${tier}-${slot}`, type: "action", actionId: item.id, cost, duration, remaining: 0, done: false };
}

function roundTo5(value: number): number {
  return Math.max(5, Math.round(value / 5) * 5);
}
