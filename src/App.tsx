import { useEffect, useMemo, useRef, useState } from "react";
import { BusinessList } from "./components/BusinessList";
import { GoalBar, TopBar } from "./components/Bars";
import { DetailPanel } from "./components/DetailPanel";
import { AdModal, ManagerModal, VictoryModal } from "./components/Modals";
import { Managers } from "./components/Managers";
import { Tabs } from "./components/Tabs";
import { COLLECT_TIME, MONEY_GOAL } from "./data";
import { createBusinesses, createExpansionRequirements, createManager, effectiveIncome, expansionProgress, nextBusinessOpenCost, nextOptimizationCost, tickBusinesses, unlockDelaySeconds } from "./game";
import type { Business, Manager } from "./types";

interface IncomeBurst {
  id: number;
  businessId: number;
  amount: number;
  mode: "manual" | "auto";
}

export function App() {
  const [soft, setSoft] = useState(100);
  const [hard, setHard] = useState(0);
  const [businesses, setBusinesses] = useState(createBusinesses);
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(0);
  const [businessPageOpen, setBusinessPageOpen] = useState(false);
  const [managers, setManagers] = useState<Array<Manager | null>>([null, null, null]);
  const [managerSeed, setManagerSeed] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
  const [assignBusinessId, setAssignBusinessId] = useState<number | null>(null);
  const [adSeconds, setAdSeconds] = useState<number | null>(null);
  const [victoryShown, setVictoryShown] = useState(false);
  const [victoryOpen, setVictoryOpen] = useState(false);
  const [incomeBursts, setIncomeBursts] = useState<IncomeBurst[]>([]);
  const burstId = useRef(0);
  const autoEffectClock = useRef(0);
  const adTimer = useRef<number | null>(null);

  const selectedBusiness = businesses.find((item) => item.id === selectedId) ?? null;
  const totalAuto = useMemo(
    () => businesses.reduce((sum, item) => sum + (item.manager ? effectiveIncome(item) : 0), 0),
    [businesses],
  );

  useEffect(() => {
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      setBusinesses((current) => {
        const result = tickBusinesses(current, dt);
        if (result.income > 0) setSoft((value) => value + result.income);
        autoEffectClock.current += dt;
        if (autoEffectClock.current >= 1) {
          autoEffectClock.current = 0;
          result.businesses.forEach((business) => {
            if (business.manager) addIncomeBurst(business.id, effectiveIncome(business), "auto");
          });
        }
        return result.businesses;
      });
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!victoryShown && soft >= MONEY_GOAL) {
      setVictoryShown(true);
      setVictoryOpen(true);
    }
  }, [soft, victoryShown]);

  function runAd(callback: () => void) {
    if (adTimer.current != null) window.clearInterval(adTimer.current);
    setAdSeconds(30);
    let left = 30;
    adTimer.current = window.setInterval(() => {
      left -= 1;
      setAdSeconds(left);
      if (left <= 0) {
        if (adTimer.current != null) window.clearInterval(adTimer.current);
        adTimer.current = null;
        setAdSeconds(null);
        callback();
      }
    }, 1000);
  }

  function handleFullReset() {
    if (adTimer.current != null) window.clearInterval(adTimer.current);
    adTimer.current = null;
    burstId.current = 0;
    autoEffectClock.current = 0;
    setSoft(100);
    setHard(0);
    setBusinesses(createBusinesses());
    setActiveCategory(0);
    setSelectedId(0);
    setBusinessPageOpen(false);
    setManagers([null, null, null]);
    setManagerSeed(0);
    setSearchCount(0);
    setAssignBusinessId(null);
    setAdSeconds(null);
    setVictoryShown(false);
    setVictoryOpen(false);
    setIncomeBursts([]);
  }

  function handleSearchManager(slot: number) {
    if (managers[slot]) return;
    const addManager = () => {
      setManagers((current) => current.map((manager, idx) => (idx === slot ? createManager(managerSeed) : manager)));
      setManagerSeed((seed) => seed + 1);
      setSearchCount((count) => count + 1);
    };
    if (searchCount === 0) addManager();
    else runAd(addManager);
  }

  function updateBusiness(id: number, updater: (business: Business) => Business) {
    setBusinesses((current) => current.map((item) => (item.id === id ? updater(item) : item)));
  }

  function addIncomeBurst(businessId: number, amount: number, mode: IncomeBurst["mode"]) {
    const id = burstId.current++;
    setIncomeBursts((current) => [...current, { id, businessId, amount, mode }]);
    window.setTimeout(() => setIncomeBursts((current) => current.filter((burst) => burst.id !== id)), 1100);
  }

  function handleCollect(id: number) {
    const business = businesses.find((item) => item.id === id);
    if (!business?.opened || !business.collectReady || business.manager) return;
    const amount = effectiveIncome(business) * COLLECT_TIME;
    setSoft((value) => value + amount);
    addIncomeBurst(id, amount, "manual");
    updateBusiness(id, (item) => ({ ...item, collectTimer: 0, collectReady: false }));
  }

  function openBusinessPage(id: number) {
    const business = businesses.find((item) => item.id === id);
    if (!business?.opened) return;
    setSelectedId(id);
    setBusinessPageOpen(true);
  }

  function handleAssign(slot: number) {
    if (assignBusinessId == null || !managers[slot]) return;
    const business = businesses.find((item) => item.id === assignBusinessId);
    if (!business?.opened) return;
    updateBusiness(assignBusinessId, (item) => ({ ...item, manager: managers[slot] }));
    setManagers((current) => current.map((manager, idx) => (idx === slot ? null : manager)));
    setAssignBusinessId(null);
  }

  function handleBuyEquipment(id: number, requirementId: string, equipmentId: string) {
    const business = businesses.find((item) => item.id === id);
    const req = business?.requirements.find((item) => item.id === requirementId);
    if (!business?.opened || !req || req.type !== "equipment" || req.equipmentId !== equipmentId || req.owned >= req.quantity || soft < req.unitCost) return;
    setSoft((value) => value - req.unitCost);
    updateBusiness(id, (item) => ({
      ...item,
      requirements: item.requirements.map((current) => (
        current.id === requirementId && current.type === "equipment"
          ? { ...current, owned: current.owned + 1 }
          : current
      )),
    }));
  }

  function handleStartAction(id: number, requirementId: string) {
    const business = businesses.find((item) => item.id === id);
    const req = business?.requirements.find((item) => item.id === requirementId);
    if (!business?.opened || !req || req.type !== "action" || req.done || req.remaining > 0 || soft < req.cost) return;
    setSoft((value) => value - req.cost);
    updateBusiness(id, (item) => ({
      ...item,
      requirements: item.requirements.map((current) => (
        current.id === requirementId && current.type === "action"
          ? { ...current, remaining: current.duration }
          : current
      )),
    }));
  }

  function handleExpand(id: number) {
    const business = businesses.find((item) => item.id === id);
    if (!business || business.maxed || !expansionProgress(business).ready) return;
    setHard((value) => value + 1);
    updateBusiness(id, (item) => ({
      ...item,
      tier: item.tier + 1,
      workedSeconds: 0,
      requirements: createExpansionRequirements(item.id, item.catIdx, item.tier + 1, item.base),
      maxed: item.tier + 1 >= 4,
    }));
  }

  function handleOptimizeBusiness(id: number) {
    const business = businesses.find((item) => item.id === id);
    if (!business?.maxed) return;
    const cost = nextOptimizationCost(business.optimizationLevel);
    if (cost == null || hard < cost) return;
    setHard((value) => value - cost);
    updateBusiness(id, (item) => ({ ...item, optimizationLevel: item.optimizationLevel + 1 }));
  }

  function handleOpenBusiness(id: number) {
    const business = businesses.find((item) => item.id === id);
    if (!business || business.opened || business.unlockRemaining == null || business.unlockRemaining > 0 || soft < business.openCost) return;
    const nextBalance = soft - business.openCost;
    setSoft(nextBalance);
    setBusinesses((current) => current.map((item) => {
      if (item.id === id) return { ...item, opened: true };
      if (item.id === id + 1 && item.unlockRemaining == null) {
        return {
          ...item,
          openCost: nextBusinessOpenCost(nextBalance, item.id, item.catIdx),
          unlockRemaining: item.id < 4 ? 0 : unlockDelaySeconds(item.catIdx),
        };
      }
      return item;
    }));
  }

  function handleSkipUnlock(id: number) {
    const business = businesses.find((item) => item.id === id);
    if (!business || business.opened || business.unlockRemaining == null || business.unlockRemaining <= 0) return;
    runAd(() => updateBusiness(id, (item) => ({ ...item, unlockRemaining: 0 })));
  }

  return (
    <main className="app-shell">
      <TopBar soft={soft} hard={hard} totalAuto={totalAuto} onReset={handleFullReset} />
      <GoalBar soft={soft} />
      <div className="content-scroll">
        {businessPageOpen ? (
          <DetailPanel business={selectedBusiness} soft={soft} hard={hard} onBack={() => setBusinessPageOpen(false)} onBuyEquipment={handleBuyEquipment} onStartAction={handleStartAction} onExpand={handleExpand} onOptimize={handleOptimizeBusiness} />
        ) : (
          <div className="main-sections">
            <Managers managers={managers} searchCount={searchCount} onSearch={handleSearchManager} onFire={(slot) => setManagers((current) => current.map((item, idx) => (idx === slot ? null : item)))} />
            <BusinessList
              businesses={businesses}
              activeCategory={activeCategory}
              selectedId={selectedId}
              soft={soft}
              hasFreeManager={managers.some((item) => !item)}
              hasStoredManager={managers.some(Boolean)}
              onSelect={openBusinessPage}
              onCollect={handleCollect}
              onOpenAssign={setAssignBusinessId}
              onRemoveManager={(id) => updateBusiness(id, (item) => ({ ...item, manager: null }))}
              onOpenBusiness={handleOpenBusiness}
              onSkipUnlock={handleSkipUnlock}
              incomeBursts={incomeBursts}
            />
          </div>
        )}
      </div>
      {!businessPageOpen && <Tabs active={activeCategory} onChange={(index) => { setActiveCategory(index); setSelectedId(businesses.find((item) => item.catIdx === index)?.id ?? null); }} />}
      <ManagerModal managers={managers} open={assignBusinessId != null} searchCount={searchCount} onSearch={handleSearchManager} onAssign={handleAssign} onFire={(slot) => setManagers((current) => current.map((item, idx) => (idx === slot ? null : item)))} onClose={() => setAssignBusinessId(null)} />
      <AdModal seconds={adSeconds} />
      <VictoryModal open={victoryOpen} onClose={() => setVictoryOpen(false)} />
    </main>
  );
}
