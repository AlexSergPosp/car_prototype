import { AUTO_EVENT_CONTESTS, MAX_BUSINESS_TIER, OPTIMIZATION_COSTS, VEHICLE_STATS } from "./data";
import type { AutoEventContest, AutoEventReward, AutoEventRun, Business, VehicleStatKey, VehicleStats } from "./types";

export const VEHICLE_STAT_KEYS: VehicleStatKey[] = ["speed", "style", "authenticity", "engineering", "media"];

const FALLBACK_STATS: VehicleStats = { speed: 3, style: 3, authenticity: 3, engineering: 3, media: 3 };

export function autoEventById(eventId: string): AutoEventContest | null {
  return AUTO_EVENT_CONTESTS.find((event) => event.id === eventId) ?? null;
}

export function vehicleStatsForBusiness(businessId: number): VehicleStats {
  return VEHICLE_STATS[businessId] ?? FALLBACK_STATS;
}

export function topContestStats(contest: AutoEventContest, count = 3): VehicleStatKey[] {
  return [...VEHICLE_STAT_KEYS]
    .sort((left, right) => contest.weights[right] - contest.weights[left])
    .slice(0, count);
}

export function autoEventStatScore(business: Business, contest: AutoEventContest): number {
  const stats = vehicleStatsForBusiness(business.id);
  return VEHICLE_STAT_KEYS.reduce((sum, key) => sum + stats[key] * contest.weights[key], 0) / 5;
}

export function autoEventSuccessChance(business: Business, contest: AutoEventContest): number {
  const statScore = autoEventStatScore(business, contest);
  const tierBonus = ((Math.min(MAX_BUSINESS_TIER, business.tier) - 1) / Math.max(1, MAX_BUSINESS_TIER - 1)) * 0.16;
  const prestigeBonus = (Math.min(OPTIMIZATION_COSTS.length, business.optimizationLevel) / OPTIMIZATION_COSTS.length) * 0.14;
  const managerBonus = business.manager ? 0.03 : 0;
  return clamp(0.16 + statScore * 0.6 + tierBonus + prestigeBonus + managerBonus, 0.12, 0.95);
}

export function autoEventRewardSoft(business: Business, contest: AutoEventContest): number {
  const tierBonus = 1 + (business.tier - 1) * 0.14;
  const prestigeBonus = 1 + business.optimizationLevel * 0.045;
  const categoryBonus = 1 + business.catIdx * 0.12;
  return roundTo50(contest.rewardSoft * tierBonus * prestigeBonus * categoryBonus);
}

export function createAutoEventRun(business: Business, contest: AutoEventContest, seed = Date.now()): AutoEventRun {
  return {
    eventId: contest.id,
    businessId: business.id,
    remaining: contest.duration,
    duration: contest.duration,
    chance: autoEventSuccessChance(business, contest),
    rewardSoft: autoEventRewardSoft(business, contest),
    rewardHard: contest.rewardHard,
    seed,
  };
}

export function advanceAutoEvent(run: AutoEventRun | null, seconds: number): { run: AutoEventRun | null; reward: AutoEventReward | null } {
  if (!run) return { run: null, reward: null };
  const remaining = Math.max(0, run.remaining - seconds);
  if (remaining > 0) return { run: { ...run, remaining }, reward: null };
  return { run: null, reward: resolveAutoEventRun(run) };
}

export function resolveAutoEventRun(run: AutoEventRun): AutoEventReward {
  const success = seededUnit(run.seed) <= run.chance;
  return {
    eventId: run.eventId,
    businessId: run.businessId,
    success,
    chance: run.chance,
    soft: success ? run.rewardSoft : Math.max(50, roundTo50(run.rewardSoft * 0.35)),
    hard: success ? run.rewardHard : 0,
  };
}

export function sanitizeAutoEventRun(run: AutoEventRun | null | undefined, businesses: Business[]): AutoEventRun | null {
  if (!run || !autoEventById(run.eventId)) return null;
  const business = businesses.find((item) => item.id === run.businessId);
  if (!business?.opened) return null;
  const duration = finiteClamp(run.duration, 1, 24 * 60 * 60, 180);
  return {
    eventId: run.eventId,
    businessId: business.id,
    remaining: finiteClamp(run.remaining, 0, duration, duration),
    duration,
    chance: finiteClamp(run.chance, 0.01, 0.99, 0.5),
    rewardSoft: finiteClamp(run.rewardSoft, 0, 1e12, 0),
    rewardHard: finiteClamp(run.rewardHard, 0, 1000, 0),
    seed: finiteClamp(run.seed, 1, Number.MAX_SAFE_INTEGER, Date.now()),
  };
}

export function sanitizeAutoEventReward(reward: AutoEventReward | null | undefined, businesses: Business[]): AutoEventReward | null {
  if (!reward || !autoEventById(reward.eventId)) return null;
  const business = businesses.find((item) => item.id === reward.businessId);
  if (!business?.opened) return null;
  return {
    eventId: reward.eventId,
    businessId: business.id,
    success: Boolean(reward.success),
    chance: finiteClamp(reward.chance, 0.01, 0.99, 0.5),
    soft: finiteClamp(reward.soft, 0, 1e12, 0),
    hard: finiteClamp(reward.hard, 0, 1000, 0),
  };
}

function seededUnit(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function roundTo50(value: number): number {
  return Math.max(50, Math.round(value / 50) * 50);
}

function finiteClamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
