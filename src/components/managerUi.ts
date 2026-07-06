import { MANAGER_NAMES } from "../data";
import type { Manager } from "../types";

export function managerDisplayName(manager: Manager): string {
  return manager.name || MANAGER_NAMES[manager.id % MANAGER_NAMES.length] || "Автомеханик";
}

export function managerEfficiencyClass(manager: Manager): string {
  if (manager.efficiency < 1) return "manager-efficiency bad";
  if (manager.efficiency > 1) return "manager-efficiency good";
  return "manager-efficiency";
}
