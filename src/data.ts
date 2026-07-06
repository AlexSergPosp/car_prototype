import type { CategorySeed, EquipmentItem, LongActionItem, Rarity } from "./types";

export const MONEY_GOAL = 1_000_000;
export const COLLECT_TIME = 15;
export const OPTIMIZATION_COSTS = [1, 1, 2, 3, 5];

export const EXPANSION_BALANCE = [
  { workSeconds: 20, costMultiplier: 0.35, timeMultiplier: 0.55 },
  { workSeconds: 90, costMultiplier: 1.9, timeMultiplier: 1.8 },
  { workSeconds: 240, costMultiplier: 5.2, timeMultiplier: 3.8 },
];

export const EQUIPMENT_OPTIONS: EquipmentItem[] = [
  { id: "cargo_van", name: "Грузовое авто", icon: "🚚", baseCost: 70 },
  { id: "delivery_bike", name: "Курьерский байк", icon: "🛵", baseCost: 45 },
  { id: "storage_rack", name: "Складской стеллаж", icon: "🧱", baseCost: 55 },
  { id: "pos_terminal", name: "POS-терминал", icon: "💳", baseCost: 60 },
  { id: "cooling_case", name: "Холодильная витрина", icon: "🧊", baseCost: 85 },
  { id: "coffee_machine", name: "Кофемашина", icon: "☕", baseCost: 75 },
  { id: "toolkit", name: "Комплект инструментов", icon: "🧰", baseCost: 65 },
  { id: "workstation", name: "Рабочая станция", icon: "🖥️", baseCost: 110 },
  { id: "crm_pack", name: "CRM-пакет", icon: "📊", baseCost: 95 },
  { id: "ad_screen", name: "Рекламный экран", icon: "📺", baseCost: 90 },
  { id: "security_system", name: "Система безопасности", icon: "📹", baseCost: 120 },
  { id: "cleaning_kit", name: "Клининговый комплект", icon: "🧽", baseCost: 50 },
  { id: "kitchen_line", name: "Кухонная линия", icon: "🏭", baseCost: 130 },
  { id: "fitness_machine", name: "Тренажер", icon: "🏋️", baseCost: 115 },
  { id: "beauty_chair", name: "Кресло мастера", icon: "💺", baseCost: 80 },
  { id: "server_node", name: "Серверный узел", icon: "🗄️", baseCost: 150 },
  { id: "sound_system", name: "Звуковая система", icon: "🔊", baseCost: 125 },
  { id: "arcade_unit", name: "Аркадный автомат", icon: "🕹️", baseCost: 140 },
  { id: "diagnostic_stand", name: "Диагностический стенд", icon: "🔧", baseCost: 135 },
  { id: "supplier_tablet", name: "Планшет поставок", icon: "📱", baseCost: 100 },
];

export const LONG_ACTION_OPTIONS: LongActionItem[] = [
  { id: "supplier_search", name: "Расширить поиск поставщиков", icon: "🔎", baseCost: 45, baseSeconds: 12 },
  { id: "staff_seminar", name: "Провести семинар", icon: "🎤", baseCost: 55, baseSeconds: 15 },
  { id: "market_research", name: "Изучить район", icon: "🗺️", baseCost: 50, baseSeconds: 14 },
  { id: "license_check", name: "Согласовать лицензии", icon: "📄", baseCost: 65, baseSeconds: 18 },
  { id: "brand_refresh", name: "Обновить вывеску", icon: "🏷️", baseCost: 70, baseSeconds: 16 },
  { id: "quality_audit", name: "Провести аудит качества", icon: "✅", baseCost: 75, baseSeconds: 20 },
  { id: "supplier_contract", name: "Заключить контракт", icon: "🤝", baseCost: 90, baseSeconds: 24 },
  { id: "promo_campaign", name: "Запустить промо-кампанию", icon: "📣", baseCost: 85, baseSeconds: 22 },
  { id: "layout_plan", name: "Спланировать помещение", icon: "📐", baseCost: 95, baseSeconds: 26 },
  { id: "safety_briefing", name: "Провести инструктаж", icon: "🦺", baseCost: 80, baseSeconds: 21 },
  { id: "process_map", name: "Описать процессы", icon: "🧭", baseCost: 100, baseSeconds: 28 },
  { id: "partner_meeting", name: "Встретиться с партнерами", icon: "🧑‍💼", baseCost: 110, baseSeconds: 30 },
  { id: "warehouse_count", name: "Провести инвентаризацию", icon: "📦", baseCost: 105, baseSeconds: 32 },
  { id: "legal_review", name: "Проверить договоры", icon: "⚖️", baseCost: 120, baseSeconds: 34 },
  { id: "service_script", name: "Подготовить скрипты сервиса", icon: "📝", baseCost: 115, baseSeconds: 31 },
  { id: "hiring_wave", name: "Провести набор персонала", icon: "👥", baseCost: 130, baseSeconds: 38 },
  { id: "route_test", name: "Протестировать маршруты", icon: "🛣️", baseCost: 125, baseSeconds: 35 },
  { id: "software_setup", name: "Настроить ПО", icon: "⚙️", baseCost: 145, baseSeconds: 42 },
  { id: "vip_pitch", name: "Подготовить VIP-предложение", icon: "💼", baseCost: 155, baseSeconds: 45 },
  { id: "opening_event", name: "Организовать открытие", icon: "🎉", baseCost: 170, baseSeconds: 50 },
];

export const RARITIES: Rarity[] = ["white", "green", "blue", "purple", "orange"];

export const RARITY_NAME: Record<Rarity, string> = {
  white: "Обычный",
  green: "Необычный",
  blue: "Редкий",
  purple: "Эпический",
  orange: "Легендарный",
};

export const MANAGER_RARITY_STATS: Record<Rarity, { efficiency: number; salary: number }> = {
  white: { efficiency: 0.72, salary: 0.03 },
  green: { efficiency: 0.92, salary: 0.08 },
  blue: { efficiency: 1.2, salary: 0.22 },
  purple: { efficiency: 1.55, salary: 0.5 },
  orange: { efficiency: 2.1, salary: 1.05 },
};

export const RARITY_CLASS: Record<Rarity, string> = {
  white: "border-zinc-300 from-zinc-700 to-zinc-900 text-zinc-200",
  green: "border-emerald-400 from-emerald-900 to-slate-950 text-emerald-300",
  blue: "border-sky-400 from-sky-950 to-slate-950 text-sky-300",
  purple: "border-violet-400 from-violet-950 to-slate-950 text-violet-300",
  orange: "border-amber-400 from-amber-950 to-slate-950 text-amber-300",
};

export const FACES = [
  "👨‍💼", "👩‍💼", "🧔", "👩‍🦰", "🧑‍💼", "👨‍🦳", "👩‍🦱", "🧑‍🔧", "👨‍🍳", "👩‍🔬",
  "🧑‍💻", "👨‍🏫", "👩‍⚕️", "🧑‍🎨", "👨‍🚀", "👩‍🌾", "🧑‍🍳", "👨‍🔧", "👩‍💻", "🧑‍⚕️",
];

export const CATEGORIES: CategorySeed[] = [
  { name: "Уровень 1", icon: "★", biz: [
    { n: "Кофейная точка", ic: "☕", base: 1.2 }, { n: "Мини-пекарня", ic: "🥐", base: 1.5 },
    { n: "Ремонт обуви", ic: "🧰", base: 1.8 }, { n: "Автомойка", ic: "🚿", base: 2 },
  ] },
  { name: "Уровень 2", icon: "★★", biz: [
    { n: "Кафе", ic: "🍽️", base: 3.4 }, { n: "Барбершоп", ic: "✂️", base: 3.8 },
    { n: "Сервис техники", ic: "🔧", base: 4.2 }, { n: "Такси-парк", ic: "🚕", base: 4.8 },
  ] },
  { name: "Уровень 3", icon: "★★★", biz: [
    { n: "Ресторан", ic: "🍝", base: 7 }, { n: "Фитнес-клуб", ic: "🏋️", base: 8 },
    { n: "Веб-агентство", ic: "🌐", base: 9 }, { n: "Кинотеатр", ic: "🎬", base: 10 },
  ] },
  { name: "Уровень 4", icon: "★★★★", biz: [
    { n: "IT-студия", ic: "🖥️", base: 15 }, { n: "Логистика", ic: "🚛", base: 17 },
    { n: "Спа-комплекс", ic: "🧖", base: 19 }, { n: "Геймдев", ic: "🎮", base: 22 },
  ] },
  { name: "Уровень 5", icon: "★★★★★", biz: [
    { n: "Сеть ресторанов", ic: "🏙️", base: 32 }, { n: "Дата-центр", ic: "🗄️", base: 36 },
    { n: "Медиа-холдинг", ic: "📡", base: 40 }, { n: "Промышленный парк", ic: "🏭", base: 45 },
  ] },
];
