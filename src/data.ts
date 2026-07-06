import type { AdQuiz, AutoEventContest, CategorySeed, EquipmentItem, LongActionItem, Rarity, VehicleStatKey, VehicleStats } from "./types";

export const MONEY_GOAL = 1_000_000;
export const COLLECT_TIME = 15;
export const GEM_AD_REWARD = 3;
export const AD_QUIZ_BONUS = 1;
export const AD_HINT_SECONDS = 6;
export const AD_DURATION_SECONDS = AD_HINT_SECONDS * 5;
export const PREMIUM_MANAGER_COST = 7;
export const MANAGER_COOLDOWN_SECONDS = 20 * 60;
export const MAX_BUSINESS_TIER = 3;
export const AUTO_EVENT_UNLOCK_CATEGORY = 2;
export const OPTIMIZATION_COSTS = [1, 2, 4, 8, 12];
export const OPTIMIZATION_BONUSES = [0.05, 0.08, 0.12, 0.17, 0.23];
export const PRESTIGE_LEVELS = [
  {
    name: "История модели",
    description: "Нашли факты, оформили описание, посетители охотнее платят.",
  },
  {
    name: "Фотосет",
    description: "Сделали красивые материалы для рекламы.",
  },
  {
    name: "Сертификат подлинности",
    description: "Подтвердили редкость и происхождение авто.",
  },
  {
    name: "VIP-показ",
    description: "Начали показывать авто коллекционерам.",
  },
  {
    name: "Медиа-пакет",
    description: "Машину зовут на съемки, выставки и промо.",
  },
];

export const VEHICLE_LEVEL_FACTS = [
  [
    "Кузов из нержавеющей стали и двери-крылья сделали DMC-12 идеальной базой для машины времени.",
    "Киношная легенда держится на числе 88 миль/ч: именно так авто уходит во временной скачок.",
    "После фильма DeLorean стал символом путешествий во времени, хотя серийная машина была редкой и недолгой историей.",
  ],
  [
    "DB5 стала главным автомобильным образом Бонда после появления в Goldfinger.",
    "Фильмовая DB5 прославилась гаджетами: скрытым оружием, защитным щитом и катапультируемым креслом.",
    "Возвращения DB5 в разных фильмах сделали ее частью образа агента 007, а не просто машиной героя.",
  ],
  [
    "KITT в Knight Rider был не транспортом, а напарником с голосом, характером и собственным интеллектом.",
    "Красная бегущая полоска на носу сделала Trans Am узнаваемым даже в темноте.",
    "Образ KITT задолго до современных ассистентов закрепил мечту о машине, которая думает вместе с водителем.",
  ],
  [
    "Черный Charger Дома в истории фильма связан с отцом и выглядит как семейная реликвия.",
    "Огромный нагнетатель над капотом превратил маслкар в почти отдельного героя кадра.",
    "Charger постоянно возвращается в серии, поддерживая образ старой школы и большой мощности.",
  ],
  [
    "Оранжевая Supra стала одной из самых узнаваемых машин уличной культуры 2000-х.",
    "По сюжету Supra собирают из разбитой машины, поэтому восстановление для нее буквально часть легенды.",
    "Финальная гонка против Charger сделала Supra символом дружбы, риска и второго шанса.",
  ],
  [
    "R34 закрепился за Брайаном и стал одним из главных кинообразов японской тюнинг-культуры.",
    "GT-R прославился полным приводом и рядной шестеркой RB26, которую фанаты считают культовой.",
    "После фильмов и игр Skyline R34 стал коллекционной мечтой с мгновенно узнаваемым силуэтом.",
  ],
  [
    "RX-7 Хана получила широкий VeilSide-образ, который сделал ее звездой Tokyo Drift.",
    "Роторный мотор отличает RX-7 от большинства спортивных машин и добавляет ей фанатского характера.",
    "Оранжево-черный RX-7 стал визуальным символом дрифта: низкий, широкий и театральный.",
  ],
  [
    "M3 GTR стала машиной-иконой Most Wanted: ее узнают по серебристо-синей ливрее.",
    "Широкий кузов и гоночный звук сделали ее не просто призом, а целью всей погони.",
    "Игровая легенда превратила редкую гоночную BMW в одну из самых желанных виртуальных машин.",
  ],
  [
    "GT40 родился как ответ Ford на доминирование Ferrari в гонках на выносливость.",
    "Победный образ 1966 года сделал Mk II символом американского реванша в Ле-Мане.",
    "Низкий кузов и большой V8 превратили GT40 в миф о скорости, упрямстве и заводской гордости.",
  ],
  [
    "917K в ливрее Gulf стал одним из самых узнаваемых цветов в истории автоспорта.",
    "Фильм Le Mans помог закрепить за Porsche 917 образ кинематографичной гонки на пределе.",
    "917K остается символом эпохи, когда прототипы выглядели опасно даже на неподвижном постере.",
  ],
  [
    "Sport Quattro S1 вырос из безумной эпохи Group B, где мощность и смелость шли рядом.",
    "Короткая база, расширенные арки и турбо-пятицилиндровый звук сделали S1 раллийной иконой.",
    "Полный привод quattro изменил ожидания от раллийных машин и задал новый стандарт сцепления.",
  ],
  [
    "Stratos проектировали вокруг ралли: короткий, клиновидный и готовый резко менять направление.",
    "Среднемоторная компоновка дала машине характер, который требовал смелого пилота.",
    "Ливрея Alitalia сделала Stratos не только победителем, но и одним из самых плакатных раллийных авто.",
  ],
  [
    "250 GTO создавали для омологации GT-гонок, поэтому красота кузова выросла из гоночной задачи.",
    "Сейчас GTO воспринимают как одну из самых желанных классических Ferrari.",
    "Ее легенда держится на редком сочетании: гоночные победы, ручная форма и почти музейная редкость.",
  ],
  [
    "Atlantic узнают по высокому центральному гребню кузова, который выглядит как ювелирная деталь.",
    "Каждый сохранившийся Type 57 SC Atlantic имеет отдельную биографию и коллекционный статус.",
    "Форма Atlantic ближе к ар-деко скульптуре, чем к обычному автомобилю своего времени.",
  ],
  [
    "300 SLR Uhlenhaut Coupe вырос из гоночной программы Mercedes и получил дорожный кузов с дверями-крыльями.",
    "Имя Uhlenhaut связано с инженером Рудольфом Уленхаутом, одним из ключевых людей проекта.",
    "Этот Mercedes воспринимают как редчайший мост между гоночной техникой и дорожной легендой.",
  ],
  [
    "Daytona Coupe сделали, чтобы Cobra могла быть быстрее на длинных европейских прямых.",
    "Закрытый кузов дал машине больше максимальной скорости, чем открытая Cobra.",
    "Эта Shelby стала символом того, как маленькая команда может спорить с европейскими грандами.",
  ],
  [
    "F1 LM отмечал успех McLaren F1 GTR в Ле-Мане и получил еще более чистый гоночный характер.",
    "Центральное водительское место делает McLaren F1 похожим на дорожный болид.",
    "Легкий кузов и атмосферный V12 закрепили за F1 LM статус аналоговой гиперкар-легенды.",
  ],
  [
    "Veyron Super Sport стал символом эпохи, когда гиперкар обязан был спорить с пределом скорости.",
    "W16 с четырьмя турбинами потребовал экстремального охлаждения и инженерной дисциплины.",
    "Черно-оранжевый образ Super Sport быстро стал визуальным кодом максимальной версии Veyron.",
  ],
  [
    "Zonda Cinque воспринимают как дорожную драму Pagani: карбон, звук и театральные детали.",
    "Cinque использует трековые идеи, но подает их как коллекционный арт-объект.",
    "Для фанатов Zonda важна не только скорость, но и ощущение машины, собранной как музыкальный инструмент.",
  ],
  [
    "Jesko Absolut сделали как низкодраг-версию Jesko, заточенную под максимальную скорость.",
    "В отличие от трековой версии, Absolut убирает огромный упор на прижим и делает силуэт более гладким.",
    "Имя Jesko для бренда личное: так Koenigsegg отсылает к семейной истории основателя.",
  ],
];

export function vehicleLevelFactFor(businessId: number, toTier: number): string | null {
  const facts = VEHICLE_LEVEL_FACTS[businessId];
  if (!facts) return null;
  return facts[toTier - 2] ?? null;
}

export const VEHICLE_STAT_LABELS: Record<VehicleStatKey, string> = {
  speed: "Скорость",
  style: "Стиль",
  authenticity: "Подлинность",
  engineering: "Техника",
  media: "Медиа",
};

export const VEHICLE_STAT_SHORT_LABELS: Record<VehicleStatKey, string> = {
  speed: "Скр",
  style: "Стиль",
  authenticity: "Подл",
  engineering: "Тех",
  media: "Медиа",
};

export const VEHICLE_STATS: VehicleStats[] = [
  { speed: 2, style: 5, authenticity: 4, engineering: 4, media: 5 },
  { speed: 3, style: 5, authenticity: 5, engineering: 4, media: 5 },
  { speed: 4, style: 4, authenticity: 3, engineering: 5, media: 5 },
  { speed: 5, style: 4, authenticity: 3, engineering: 4, media: 4 },
  { speed: 5, style: 5, authenticity: 3, engineering: 4, media: 5 },
  { speed: 5, style: 4, authenticity: 4, engineering: 5, media: 4 },
  { speed: 4, style: 5, authenticity: 3, engineering: 4, media: 4 },
  { speed: 5, style: 4, authenticity: 3, engineering: 5, media: 5 },
  { speed: 5, style: 4, authenticity: 5, engineering: 5, media: 4 },
  { speed: 5, style: 5, authenticity: 5, engineering: 5, media: 4 },
  { speed: 4, style: 3, authenticity: 5, engineering: 5, media: 3 },
  { speed: 4, style: 5, authenticity: 5, engineering: 4, media: 4 },
  { speed: 4, style: 5, authenticity: 5, engineering: 4, media: 4 },
  { speed: 2, style: 5, authenticity: 5, engineering: 4, media: 4 },
  { speed: 5, style: 5, authenticity: 5, engineering: 5, media: 4 },
  { speed: 5, style: 4, authenticity: 5, engineering: 4, media: 4 },
  { speed: 5, style: 5, authenticity: 4, engineering: 5, media: 4 },
  { speed: 5, style: 5, authenticity: 4, engineering: 5, media: 4 },
  { speed: 5, style: 5, authenticity: 3, engineering: 5, media: 5 },
  { speed: 5, style: 4, authenticity: 3, engineering: 5, media: 4 },
];

export const AUTO_EVENT_CONTESTS: AutoEventContest[] = [
  {
    id: "movie_shoot",
    name: "Киносъемка",
    icon: "🎬",
    description: "Съемочная группа ищет авто, которое держит кадр и не ломает дубль.",
    duration: 180,
    rewardSoft: 4_200,
    rewardHard: 1,
    weights: { speed: 0.1, style: 0.28, authenticity: 0.06, engineering: 0.18, media: 0.38 },
    goals: ["Узнаваемый образ", "Кадр для афиши", "Трюк без поломки"],
  },
  {
    id: "authenticity_court",
    name: "Суд подлинности",
    icon: "📜",
    description: "Эксперты проверяют историю, детали и качество реставрации.",
    duration: 240,
    rewardSoft: 5_300,
    rewardHard: 1,
    weights: { speed: 0.03, style: 0.2, authenticity: 0.45, engineering: 0.24, media: 0.08 },
    goals: ["История модели", "Верные детали", "Чистый вердикт"],
  },
  {
    id: "demo_run",
    name: "Демо-заезд",
    icon: "🏁",
    description: "Не гонка на убой, а показ мощности, звука и стабильного финиша.",
    duration: 210,
    rewardSoft: 4_800,
    rewardHard: 1,
    weights: { speed: 0.42, style: 0.1, authenticity: 0.04, engineering: 0.36, media: 0.08 },
    goals: ["Разгон", "Звук мотора", "Финиш без сюрпризов"],
  },
  {
    id: "collector_gala",
    name: "Гала коллекционеров",
    icon: "💎",
    description: "Закрытый зал, дорогие гости и голосование за самый желанный стенд.",
    duration: 300,
    rewardSoft: 6_200,
    rewardHard: 2,
    weights: { speed: 0.04, style: 0.36, authenticity: 0.26, engineering: 0.1, media: 0.24 },
    goals: ["Вау-эффект", "Редкость", "Разговоры у стенда"],
  },
];

export const TIER_INCOME_MULTIPLIERS = [1, 2.7, 6.2];

export const EXPANSION_BALANCE = [
  { workSeconds: 75, costMultiplier: 0.38, timeMultiplier: 0.7 },
  { workSeconds: 300, costMultiplier: 2.3, timeMultiplier: 2.3 },
  { workSeconds: 720, costMultiplier: 7, timeMultiplier: 5 },
];

export const CATEGORY_UNLOCK_GOALS = [
  { targetCategory: 1, cost: 8_000 },
  { targetCategory: 2, cost: 90_000 },
  { targetCategory: 3, cost: 450_000 },
  { targetCategory: 4, cost: 2_200_000 },
];

export const AD_SLOGANS = [
  "Легенда сама себя не отполирует.",
  "Смотри рекламу, пока механик ищет ключ на 10.",
  "Редкие детали любят терпение и странные кнопки.",
  "Эта пауза одобрена музеем быстрых решений.",
  "Авто еще разбито, зато баннер целый.",
  "Один просмотр ближе к выставочному блеску.",
  "Гемы пахнут свежей краской и дедлайном.",
  "Подиум ждет. Таймер тоже.",
  "Если болт лишний, значит это коллекционная особенность.",
  "Механик сказал, что реклама ускоряет реставрацию. Наверное.",
  "Чертежи сами себя не прочитают.",
  "Сейчас будет блеск. Или вид, что блеск.",
  "Премиум начинается там, где заканчивается наждачка.",
  "Редкая запчасть уже почти в пути.",
  "Стенд готовится выглядеть дороже, чем бюджет.",
  "Тридцать секунд славы для трех гемов.",
  "Кнопка большая, значит ключ подходит.",
  "Смотри рекламу: это дешевле, чем искать оригинальный бампер.",
  "Маркетинг нашел турбину в диване.",
  "Твоя выручка прогревает двигатель где-то за кадром.",
  "Мы не обещаем чудо. Мы обещаем таймер.",
  "Этот ролик повысил самооценку гаража.",
  "План простой: смотреть, терпеть, реставрировать.",
  "Гемы блестят. Хром завидует.",
  "Легендарная категория требует выставочного терпения.",
  "Если слоган странный, значит он редкий.",
  "Капитализм позвонил и попросил еще один тест-драйв.",
  "Серьезная легенда требует несерьезной рекламы.",
  "Финальный лак начинается с очень странного окна.",
];

export const AD_AUTO_QUIZZES: AdQuiz[] = [
  {
    id: "delorean_time_machine",
    title: "DeLorean DMC-12",
    hints: [
      "Эту машину знают не за скорость, а за путешествия во времени.",
      "Кузов из нержавейки и двери-крылья сделали ее похожей на будущее еще до кино.",
      "В легенде ей нужно разогнаться до 88 миль в час.",
      "Рядом с ней обычно вспоминают доктора, подростка и молнию.",
      "Фраза про будущее почти автоматически вызывает ее силуэт.",
    ],
    options: ["DeLorean DMC-12", "Lotus Esprit", "Pontiac Fiero", "Lamborghini Countach"],
  },
  {
    id: "aston_db5_bond",
    title: "Aston Martin DB5",
    hints: [
      "Это самый элегантный способ сказать, что у водителя есть лицензия на риск.",
      "Машину часто вспоминают вместе с гаджетами, скрытым оружием и катапультой.",
      "Серый британский кузов стал почти таким же узнаваемым, как смокинг.",
      "Она возвращалась в историях агента снова и снова.",
      "Если слышишь про автомобиль 007, чаще всего думают именно о ней.",
    ],
    options: ["Aston Martin DB5", "Jaguar E-Type", "Bentley Continental", "Lotus Esprit"],
  },
  {
    id: "kitt",
    title: "Pontiac Firebird Trans Am KITT",
    hints: [
      "Эта машина не просто ехала, а разговаривала с водителем.",
      "Красная бегущая полоска спереди стала ее фирменным взглядом.",
      "В сериале она была напарником героя, а не обычным транспортом.",
      "Ее часто вспоминают как мечту об умном автомобиле до эпохи ассистентов.",
      "Имя из четырех букв звучит почти как имя персонажа.",
    ],
    options: ["Pontiac Firebird Trans Am KITT", "Chevrolet Camaro Bumblebee", "Ford Mustang Eleanor", "Dodge Charger General Lee"],
  },
  {
    id: "dom_charger",
    title: "Dodge Charger R/T",
    hints: [
      "Черный маслкар связан с семьей, гаражом и очень серьезным взглядом.",
      "Огромный нагнетатель над капотом стал частью его образа.",
      "Эта машина постоянно возвращается в уличной кинофраншизе.",
      "Она выглядит так, будто сначала рычит, а потом уже едет.",
      "Если рядом Дом, выбор почти очевиден.",
    ],
    options: ["Dodge Charger R/T", "Chevrolet Chevelle SS", "Plymouth Barracuda", "Ford Torino"],
  },
  {
    id: "orange_supra",
    title: "Toyota Supra Mk4",
    hints: [
      "Оранжевый кузов и большое антикрыло стали символом уличной культуры 2000-х.",
      "По сюжету ее собирали из разбитого проекта.",
      "Она участвовала в финальной гонке против черного Charger.",
      "Эта машина сделала слово Supra культовым для зрителей, далеких от тюнинга.",
      "Фраза про десятисекундную машину часто ведет к ней.",
    ],
    options: ["Toyota Supra Mk4", "Mazda RX-7 FD", "Mitsubishi Eclipse", "Nissan 350Z"],
  },
  {
    id: "skyline_r34",
    title: "Nissan Skyline GT-R R34",
    hints: [
      "Синий японский герой часто ассоциируется с Брайаном.",
      "Фанаты любят его за полный привод и легендарный RB26.",
      "В играх и кино он стал символом JDM-мечты.",
      "Его задние круглые фонари узнают даже те, кто не помнит индекс модели.",
      "Когда говорят Godzilla в автомобильном смысле, вспоминают эту семью.",
    ],
    options: ["Nissan Skyline GT-R R34", "Toyota Celica GT-Four", "Subaru Impreza WRX", "Mitsubishi Lancer Evo"],
  },
  {
    id: "rx7_han",
    title: "Mazda RX-7 VeilSide",
    hints: [
      "Этот оранжево-черный силуэт связан с Токио и дрифтом.",
      "Широкий VeilSide-обвес изменил машину почти до неузнаваемости.",
      "Рядом с ней часто вспоминают Хана.",
      "Роторный мотор добавляет ей отдельный фанатский культ.",
      "Она выглядит как ночной неон на колесах.",
    ],
    options: ["Mazda RX-7 VeilSide", "Nissan Silvia S15", "Honda NSX", "Toyota MR2"],
  },
  {
    id: "bmw_m3_gtr",
    title: "BMW M3 GTR",
    hints: [
      "Эту машину многие впервые захотели после полицейских погонь в игре.",
      "Серебристо-синяя ливрея стала почти обложкой целой эпохи.",
      "Ее не просто покупали: за нее мстили и возвращали.",
      "Звук и широкий кузов сделали ее главным призом Most Wanted.",
      "Даже без логотипа игры раскраска сразу выдает ответ.",
    ],
    options: ["BMW M3 GTR", "Mercedes CLK GTR", "Audi RS4", "BMW M5 E39"],
  },
  {
    id: "gt40_le_mans",
    title: "Ford GT40",
    hints: [
      "Эта машина родилась из желания победить Ferrari на выносливость.",
      "Низкий кузов и большой V8 стали символом Ле-Мана.",
      "История про нее часто звучит как заводской реванш.",
      "В кино ее вспоминают рядом с Кэрроллом Шелби и Кеном Майлзом.",
      "Цифра в названии связана с очень низкой высотой.",
    ],
    options: ["Ford GT40", "Porsche 917K", "Ferrari 330 P4", "Lola T70"],
  },
  {
    id: "porsche_917_gulf",
    title: "Porsche 917K",
    hints: [
      "Голубо-оранжевая Gulf-ливрея стала одним из самых узнаваемых образов гонок.",
      "Эту машину легко представить на постере про Ле-Ман.",
      "Она выглядит как прототип из эпохи, когда аэродинамика была очень смелой.",
      "С ней часто связывают киношную атмосферу Стива Маккуина.",
      "Если видишь короткий хвост и цвета Gulf, ответ почти найден.",
    ],
    options: ["Porsche 917K", "Ford GT40", "Porsche 911 RSR", "McLaren M8D"],
  },
  {
    id: "quattro_s1",
    title: "Audi Sport Quattro S1",
    hints: [
      "Это раллийная легенда эпохи Group B.",
      "Короткая база, огромные крылья и полный привод сделали ее символом безумной скорости.",
      "Пятицилиндровый турбо-звук у нее почти отдельная песня.",
      "Слово quattro здесь важнее декоративного шильдика.",
      "Она доказала, что полный привод в ралли может менять правила.",
    ],
    options: ["Audi Sport Quattro S1", "Lancia Delta S4", "Peugeot 205 T16", "Ford RS200"],
  },
  {
    id: "lancia_stratos",
    title: "Lancia Stratos HF",
    hints: [
      "Клиновидная форма делает ее похожей на маленький раллийный космолет.",
      "Ее строили вокруг задачи побеждать на спецучастках.",
      "Ливрея Alitalia превратила ее в плакатную икону.",
      "Компактная среднемоторная компоновка требовала смелого пилота.",
      "Это одна из машин, которые выглядят как концепт, но реально воевали в ралли.",
    ],
    options: ["Lancia Stratos HF", "Fiat 131 Abarth", "Renault 5 Turbo", "Alpine A110"],
  },
  {
    id: "ferrari_250_gto",
    title: "Ferrari 250 GTO",
    hints: [
      "Это имя часто всплывает в разговорах о самых желанных классических Ferrari.",
      "Машина родилась из гоночной омологации, а стала коллекционной святыней.",
      "Красный длинный нос и мягкая форма стоят дороже многих музеев.",
      "В ней ценят не только красоту, но и реальные гоночные корни.",
      "Три буквы в конце давно звучат как пароль коллекционеров.",
    ],
    options: ["Ferrari 250 GTO", "Ferrari F40", "Ferrari Testarossa", "Ferrari Daytona"],
  },
  {
    id: "mclaren_f1",
    title: "McLaren F1",
    hints: [
      "Водитель сидит по центру, как в болиде.",
      "Эта машина долго была эталоном аналогового гиперкара.",
      "У нее атмосферный V12 и очень серьезная репутация без лишней электроники.",
      "Ле-Ман только усилил ее легенду.",
      "Если в салоне три места и водитель посередине, вариантов мало.",
    ],
    options: ["McLaren F1", "Bugatti Veyron", "Jaguar XJ220", "Porsche Carrera GT"],
  },
  {
    id: "veyron_super_sport",
    title: "Bugatti Veyron Super Sport",
    hints: [
      "Эта машина стала символом гиперкара, который спорит с пределом скорости.",
      "W16 и четыре турбины звучат как инженерная демонстрация силы.",
      "Черно-оранжевый образ хорошо запомнился фанатам рекордов.",
      "Ее часто вспоминают, когда говорят о тысяче сил и огромной максималке.",
      "Название Bugatti здесь почти синоним слова сверхскорость.",
    ],
    options: ["Bugatti Veyron Super Sport", "Koenigsegg Agera RS", "SSC Ultimate Aero", "Pagani Huayra"],
  },
  {
    id: "jesko_absolut",
    title: "Koenigsegg Jesko Absolut",
    hints: [
      "Это версия, заточенная под минимальное сопротивление и максимальную скорость.",
      "У нее нет огромного трекового крыла, силуэт сделали более гладким.",
      "Бренд известен инженерными рекордами и сложными дверями.",
      "Имя модели связано с семейной историей основателя.",
      "Когда говорят Absolut в мире гиперкаров, речь не о напитке.",
    ],
    options: ["Koenigsegg Jesko Absolut", "Bugatti Chiron Pur Sport", "Hennessey Venom F5", "Rimac Nevera"],
  },
];

export const EQUIPMENT_OPTIONS: EquipmentItem[] = [
  { id: "cargo_van", name: "Блок двигателя", icon: "⚙️", baseCost: 70 },
  { id: "delivery_bike", name: "Комплект шин", icon: "🛞", baseCost: 45 },
  { id: "storage_rack", name: "Панели кузова", icon: "🚘", baseCost: 55 },
  { id: "pos_terminal", name: "Электропроводка", icon: "🔌", baseCost: 60 },
  { id: "cooling_case", name: "Радиатор охлаждения", icon: "🧊", baseCost: 85 },
  { id: "coffee_machine", name: "Топливная система", icon: "⛽", baseCost: 75 },
  { id: "toolkit", name: "Набор крепежа", icon: "🔩", baseCost: 65 },
  { id: "workstation", name: "Панель приборов", icon: "🎛️", baseCost: 110 },
  { id: "crm_pack", name: "Блок управления", icon: "💽", baseCost: 95 },
  { id: "ad_screen", name: "Фары и оптика", icon: "💡", baseCost: 90 },
  { id: "security_system", name: "Тормозной комплект", icon: "🧯", baseCost: 120 },
  { id: "cleaning_kit", name: "Комплект детейлинга", icon: "🧽", baseCost: 50 },
  { id: "kitchen_line", name: "Выхлопная система", icon: "🏁", baseCost: 130 },
  { id: "fitness_machine", name: "Спортивная подвеска", icon: "🌀", baseCost: 115 },
  { id: "beauty_chair", name: "Салон и обивка", icon: "💺", baseCost: 80 },
  { id: "server_node", name: "Турбокомплект", icon: "🌪️", baseCost: 150 },
  { id: "sound_system", name: "Аудиосистема", icon: "🔊", baseCost: 125 },
  { id: "arcade_unit", name: "Редкий обвес", icon: "🧩", baseCost: 140 },
  { id: "diagnostic_stand", name: "Коробка передач", icon: "🔧", baseCost: 135 },
  { id: "supplier_tablet", name: "Документы и таблички", icon: "📋", baseCost: 100 },
];

export const LONG_ACTION_OPTIONS: LongActionItem[] = [
  { id: "supplier_search", name: "Разобрать донорский кузов", icon: "🔎", baseCost: 45, baseSeconds: 12 },
  { id: "staff_seminar", name: "Провести дефектовку", icon: "🧾", baseCost: 55, baseSeconds: 15 },
  { id: "market_research", name: "Сверить историю модели", icon: "🗺️", baseCost: 50, baseSeconds: 14 },
  { id: "license_check", name: "Проверить номера агрегатов", icon: "📄", baseCost: 65, baseSeconds: 18 },
  { id: "brand_refresh", name: "Подобрать заводской цвет", icon: "🎨", baseCost: 70, baseSeconds: 16 },
  { id: "quality_audit", name: "Проверить геометрию рамы", icon: "✅", baseCost: 75, baseSeconds: 20 },
  { id: "supplier_contract", name: "Заказать редкие детали", icon: "🤝", baseCost: 90, baseSeconds: 24 },
  { id: "promo_campaign", name: "Подготовить стенд модели", icon: "📣", baseCost: 85, baseSeconds: 22 },
  { id: "layout_plan", name: "Спланировать сборку салона", icon: "📐", baseCost: 95, baseSeconds: 26 },
  { id: "safety_briefing", name: "Проверить безопасность стенда", icon: "🦺", baseCost: 80, baseSeconds: 21 },
  { id: "process_map", name: "Составить карту реставрации", icon: "🧭", baseCost: 100, baseSeconds: 28 },
  { id: "partner_meeting", name: "Согласовать работы с мастерами", icon: "🧑‍🔧", baseCost: 110, baseSeconds: 30 },
  { id: "warehouse_count", name: "Разложить запчасти по узлам", icon: "📦", baseCost: 105, baseSeconds: 32 },
  { id: "legal_review", name: "Оформить выставочные документы", icon: "⚖️", baseCost: 120, baseSeconds: 34 },
  { id: "service_script", name: "Собрать чек-лист запуска", icon: "📝", baseCost: 115, baseSeconds: 31 },
  { id: "hiring_wave", name: "Позвать узких специалистов", icon: "👥", baseCost: 130, baseSeconds: 38 },
  { id: "route_test", name: "Провести тест-драйв", icon: "🛣️", baseCost: 125, baseSeconds: 35 },
  { id: "software_setup", name: "Настроить электронные блоки", icon: "⚙️", baseCost: 145, baseSeconds: 42 },
  { id: "vip_pitch", name: "Подготовить табличку легенды", icon: "🏆", baseCost: 155, baseSeconds: 45 },
  { id: "opening_event", name: "Вывести авто на подиум", icon: "🎉", baseCost: 170, baseSeconds: 50 },
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
  white: { efficiency: 0.68, salary: 0.7 },
  green: { efficiency: 0.88, salary: 0.95 },
  blue: { efficiency: 1.12, salary: 1.35 },
  purple: { efficiency: 1.42, salary: 2.05 },
  orange: { efficiency: 1.9, salary: 3 },
};

export const RARITY_CLASS: Record<Rarity, string> = {
  white: "border-zinc-300 from-zinc-700 to-zinc-900 text-zinc-200",
  green: "border-emerald-400 from-emerald-900 to-slate-950 text-emerald-300",
  blue: "border-sky-400 from-sky-950 to-slate-950 text-sky-300",
  purple: "border-violet-400 from-violet-950 to-slate-950 text-violet-300",
  orange: "border-amber-400 from-amber-950 to-slate-950 text-amber-300",
};

export const FACES = [
  "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧔", "👨‍🏭", "👩‍🏭", "🧑‍🏭", "👨‍🎨", "👩‍🎨", "🧑‍🎨",
  "👨‍💻", "👩‍💻", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍💼", "👨‍💼",
];

export const MANAGER_NAMES = [
  "Дом Тахометр",
  "Брайан Подсветкин",
  "Док Карбюратор",
  "Марти Ручник",
  "Такуми Дрифтунов",
  "Хан Турбонаддув",
  "Макс Домкрат",
  "КИТТович",
  "Бонд Глушитель",
  "Элеонора Искровна",
  "Фрэнк Переключатель",
  "Декард Развал",
  "Летти Нитро",
  "Миа Маслопровод",
  "Роман Бампер",
  "Тедж Диагностик",
  "Шон Заносов",
  "Молния Гайковерт",
  "Салли Спойлер",
  "Гвидо Питстоп",
  "Луиджи Разболтовка",
  "Кен Блокиратор",
  "Сенна Сцепление",
  "Лауда Лямбда",
];

export const PREMIUM_MANAGER_BY_BUSINESS = [
  { name: "Док Флюкс Браун", face: "🧑‍🔬" },
  { name: "Джеймс Бондмкрат", face: "🤵" },
  { name: "Майкл Найтро", face: "🕶️" },
  { name: "Доминик Турборетто", face: "💪" },
  { name: "Брайан О'Коннектор", face: "🏁" },
  { name: "Брайан Скайлайнер", face: "🌌" },
  { name: "Хан Дрифт-Лю", face: "🍿" },
  { name: "Рэйзор Развал", face: "🪒" },
  { name: "Кен Майлзомер", face: "🇬🇧" },
  { name: "Майкл Делэйни Питстоп", face: "🎬" },
  { name: "Вальтер Рерль-Руль", face: "⛰️" },
  { name: "Сандро Мунаручник", face: "🐉" },
  { name: "Фил Хиллклатч", face: "🏎️" },
  { name: "Жан Бугайка", face: "🎩" },
  { name: "Рудольф Уленхаутяжка", face: "🪽" },
  { name: "Боб Бондурант", face: "🐍" },
  { name: "Энди Уоллес-Ключ", face: "🥇" },
  { name: "Пьер-Анри Рафанель", face: "🚀" },
  { name: "Орацио Паганини", face: "🎼" },
  { name: "Кристиан Кёнигсеггзит", face: "👑" },
];

export const CATEGORIES: CategorySeed[] = [
  { name: "Киноиконы", icon: "🎬", biz: [
    { n: "DeLorean DMC-12 Time Machine", ic: "⏱️", base: 1.2, salary: 0.18 }, { n: "Aston Martin DB5 Bond", ic: "🎩", base: 1.5, salary: 0.22 },
    { n: "Pontiac Firebird Trans Am KITT", ic: "🟥", base: 1.8, salary: 0.27 }, { n: "Dodge Charger R/T Dom", ic: "⚡", base: 2, salary: 0.32 },
  ] },
  { name: "Стрит-легенды", icon: "🌃", biz: [
    { n: "Toyota Supra Mk4 Fast & Furious", ic: "🌪️", base: 3.4, salary: 0.55 }, { n: "Nissan Skyline GT-R R34 V-Spec", ic: "🌌", base: 3.8, salary: 0.62 },
    { n: "Mazda RX-7 VeilSide FD", ic: "🔺", base: 4.2, salary: 0.7 }, { n: "BMW M3 GTR Most Wanted", ic: "💠", base: 4.8, salary: 0.82 },
  ] },
  { name: "Гоночные мифы", icon: "🏆", biz: [
    { n: "Ford GT40 Mk II Le Mans", ic: "🇺🇸", base: 7, salary: 1.25 }, { n: "Porsche 917K Gulf", ic: "🟦", base: 8, salary: 1.45 },
    { n: "Audi Sport Quattro S1", ic: "🧊", base: 9, salary: 1.65 }, { n: "Lancia Stratos HF", ic: "🟩", base: 10, salary: 1.9 },
  ] },
  { name: "Редчайшая классика", icon: "👑", biz: [
    { n: "Ferrari 250 GTO", ic: "🔴", base: 15, salary: 3.2 }, { n: "Bugatti Type 57 SC Atlantic", ic: "💎", base: 17, salary: 3.8 },
    { n: "Mercedes 300 SLR Uhlenhaut", ic: "🪽", base: 19, salary: 4.4 }, { n: "Shelby Cobra Daytona Coupe", ic: "🐍", base: 22, salary: 5.2 },
  ] },
  { name: "Постерные гиперкары", icon: "💎", biz: [
    { n: "McLaren F1 LM", ic: "🥇", base: 32, salary: 8 }, { n: "Bugatti Veyron Super Sport", ic: "💨", base: 36, salary: 9.5 },
    { n: "Pagani Zonda Cinque", ic: "🌀", base: 40, salary: 11 }, { n: "Koenigsegg Jesko Absolut", ic: "⚡", base: 45, salary: 12.5 },
  ] },
];
