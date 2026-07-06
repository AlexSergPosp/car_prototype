import deloreanStage1 from "./assets/cars/delorean-time-machine/stage-1-v2.webp";
import deloreanStage2 from "./assets/cars/delorean-time-machine/stage-2-v2.webp";
import deloreanStage3 from "./assets/cars/delorean-time-machine/stage-3-v2.webp";
import astonStage1 from "./assets/cars/aston-martin-db5-bond/stage-1.webp";
import astonStage2 from "./assets/cars/aston-martin-db5-bond/stage-2.webp";
import astonStage3 from "./assets/cars/aston-martin-db5-bond/stage-3.webp";
import pontiacStage1 from "./assets/cars/pontiac-firebird-trans-am-kitt/stage-1.webp";
import pontiacStage2 from "./assets/cars/pontiac-firebird-trans-am-kitt/stage-2.webp";
import pontiacStage3 from "./assets/cars/pontiac-firebird-trans-am-kitt/stage-3.webp";
import chargerStage1 from "./assets/cars/dodge-charger-rt-dom/stage-1.webp";
import chargerStage2 from "./assets/cars/dodge-charger-rt-dom/stage-2.webp";
import chargerStage3 from "./assets/cars/dodge-charger-rt-dom/stage-3.webp";
import supraStage1 from "./assets/cars/toyota-supra-mk4-fast-furious/stage-1.webp";
import supraStage2 from "./assets/cars/toyota-supra-mk4-fast-furious/stage-2.webp";
import supraStage3 from "./assets/cars/toyota-supra-mk4-fast-furious/stage-3.webp";
import skylineStage1 from "./assets/cars/nissan-skyline-gtr-r34-v-spec/stage-1.webp";
import skylineStage2 from "./assets/cars/nissan-skyline-gtr-r34-v-spec/stage-2.webp";
import skylineStage3 from "./assets/cars/nissan-skyline-gtr-r34-v-spec/stage-3.webp";
import rx7Stage1 from "./assets/cars/mazda-rx7-veilside-fd/stage-1.webp";
import rx7Stage2 from "./assets/cars/mazda-rx7-veilside-fd/stage-2.webp";
import rx7Stage3 from "./assets/cars/mazda-rx7-veilside-fd/stage-3.webp";
import bmwStage1 from "./assets/cars/bmw-m3-gtr-most-wanted/stage-1.webp";
import bmwStage2 from "./assets/cars/bmw-m3-gtr-most-wanted/stage-2.webp";
import bmwStage3 from "./assets/cars/bmw-m3-gtr-most-wanted/stage-3.webp";
import fordGt40Stage1 from "./assets/cars/ford-gt40-mk-ii-le-mans/stage-1.webp";
import fordGt40Stage2 from "./assets/cars/ford-gt40-mk-ii-le-mans/stage-2.webp";
import fordGt40Stage3 from "./assets/cars/ford-gt40-mk-ii-le-mans/stage-3.webp";
import porsche917Stage1 from "./assets/cars/porsche-917k-gulf/stage-1.webp";
import porsche917Stage2 from "./assets/cars/porsche-917k-gulf/stage-2.webp";
import porsche917Stage3 from "./assets/cars/porsche-917k-gulf/stage-3.webp";
import audiQuattroStage1 from "./assets/cars/audi-sport-quattro-s1/stage-1.webp";
import audiQuattroStage2 from "./assets/cars/audi-sport-quattro-s1/stage-2.webp";
import audiQuattroStage3 from "./assets/cars/audi-sport-quattro-s1/stage-3.webp";
import lanciaStratosStage1 from "./assets/cars/lancia-stratos-hf/stage-1.webp";
import lanciaStratosStage2 from "./assets/cars/lancia-stratos-hf/stage-2.webp";
import lanciaStratosStage3 from "./assets/cars/lancia-stratos-hf/stage-3.webp";
import type { Business } from "./types";
import { vehicleConditionForTier } from "./vehicleConcept";

interface CarArtSet {
  stages: [string, string, string];
}

const CAR_ART_BY_ID: Record<number, CarArtSet> = {
  0: {
    stages: [deloreanStage1, deloreanStage2, deloreanStage3],
  },
  1: {
    stages: [astonStage1, astonStage2, astonStage3],
  },
  2: {
    stages: [pontiacStage1, pontiacStage2, pontiacStage3],
  },
  3: {
    stages: [chargerStage1, chargerStage2, chargerStage3],
  },
  4: {
    stages: [supraStage1, supraStage2, supraStage3],
  },
  5: {
    stages: [skylineStage1, skylineStage2, skylineStage3],
  },
  6: {
    stages: [rx7Stage1, rx7Stage2, rx7Stage3],
  },
  7: {
    stages: [bmwStage1, bmwStage2, bmwStage3],
  },
  8: {
    stages: [fordGt40Stage1, fordGt40Stage2, fordGt40Stage3],
  },
  9: {
    stages: [porsche917Stage1, porsche917Stage2, porsche917Stage3],
  },
  10: {
    stages: [audiQuattroStage1, audiQuattroStage2, audiQuattroStage3],
  },
  11: {
    stages: [lanciaStratosStage1, lanciaStratosStage2, lanciaStratosStage3],
  },
};

export function carArtForBusiness(business: Pick<Business, "id" | "tier">): string | null {
  const art = CAR_ART_BY_ID[business.id];
  if (!art) return null;
  return art.stages[vehicleConditionForTier(business.tier).stage - 1] ?? null;
}
