export const basinData = [
    { name: "Galicia Costa", capacity: 684, current: 512, lastYear: 480 },
    { name: "Miño-Sil", capacity: 3030, current: 2450, lastYear: 2100 },
    { name: "Cantábrico", capacity: 530, current: 480, lastYear: 450 },
    { name: "Ebro", capacity: 7963, current: 5800, lastYear: 5200 },
    { name: "Duero", capacity: 7500, current: 6100, lastYear: 5800 },
    { name: "Tajo", capacity: 11051, current: 7200, lastYear: 6500 },
    { name: "Guadiana", capacity: 9498, current: 3800, lastYear: 3200 },
    { name: "Guadalquivir", capacity: 8113, current: 2100, lastYear: 1900 },
    { name: "Júcar", capacity: 2846, current: 1400, lastYear: 1300 },
    { name: "Segura", capacity: 1140, current: 300, lastYear: 350 },
];

export const historicalData = Array.from({ length: 52 }, (_, i) => {
    const week = i + 1;
    // Simulate a seasonal curve: high in winter/spring, low in summer
    const seasonalFactor = Math.sin((week / 52) * 2 * Math.PI + Math.PI / 2);
    return {
        week: `S${week}`,
        2024: 50 + seasonalFactor * 15 + Math.random() * 2,
        2023: 45 + seasonalFactor * 15 + Math.random() * 2,
        average: 55 + seasonalFactor * 12,
    };
});

export const reservoirBubbleData = [
    { name: "La Serena", basin: "Guadiana", capacity: 3219, current: 950, fillPct: 29 },
    { name: "Alcántara", basin: "Tajo", capacity: 3160, current: 2800, fillPct: 88 },
    { name: "Almendra", basin: "Duero", capacity: 2648, current: 2100, fillPct: 79 },
    { name: "Buendía", basin: "Tajo", capacity: 1639, current: 400, fillPct: 24 },
    { name: "Mequinenza", basin: "Ebro", capacity: 1530, current: 1300, fillPct: 85 },
    { name: "Valdecañas", basin: "Tajo", capacity: 1446, current: 1100, fillPct: 76 },
    { name: "Ricobayo", basin: "Duero", capacity: 1145, current: 900, fillPct: 78 },
    { name: "Alarcón", basin: "Júcar", capacity: 1118, current: 600, fillPct: 53 },
    { name: "Iznájar", basin: "Guadalquivir", capacity: 981, current: 200, fillPct: 20 },
    { name: "Cijara", basin: "Guadiana", capacity: 1505, current: 450, fillPct: 30 },
];

export const sankeyData = {
    nodes: [
        { name: "Precipitación Total" },
        { name: "Evaporación" },
        { name: "Escorrentía" },
        { name: "Embalses" },
        { name: "Acuíferos" },
        { name: "Agricultura" },
        { name: "Abastecimiento" },
        { name: "Industria" },
        { name: "Ecológico" },
    ],
    links: [
        { source: 0, target: 1, value: 40 },
        { source: 0, target: 2, value: 60 },
        { source: 2, target: 3, value: 35 },
        { source: 2, target: 4, value: 25 },
        { source: 3, target: 5, value: 20 },
        { source: 3, target: 6, value: 10 },
        { source: 3, target: 7, value: 5 },
        { source: 4, target: 5, value: 15 },
        { source: 4, target: 6, value: 5 },
        { source: 3, target: 8, value: 5 }, // Caudal ecológico
    ],
};

export const pieData = [
    { name: "Regadío", value: 80 },
    { name: "Abastecimiento", value: 15 },
    { name: "Industria", value: 5 },
];
