export const DATASET = {
  id: "oost",
  title: "Topografie – Oost-Nederland (kies provincies)",
  mapImage: "oost_schoon.png",
  assetVersion: "2200-1",
  canvasWidth: 2200,
  canvasHeight: 2200,

  dotRadiusPx: 12,
  hitRadiusPx: 55,
  ringRadiusPx: 28,

  places: [
    // Flevoland
    { name: "Emmeloord", province: "Flevoland", x: 722.6,  y: 385.5 },
    { name: "Lelystad",  province: "Flevoland", x: 354.6,  y: 777.6 },
    { name: "Almere",    province: "Flevoland", x: 130.8,  y: 1073.4 },

    // Overijssel
    { name: "Kampen",   province: "Overijssel", x: 904.6,  y: 673.6 },
    { name: "Zwolle",   province: "Overijssel", x: 1110.6, y: 751.6 },
    { name: "Deventer", province: "Overijssel", x: 1186.6, y: 1223.6 },
    { name: "Almelo",   province: "Overijssel", x: 1746.6, y: 1037.5 },
    { name: "Hengelo",  province: "Overijssel", x: 1892.6, y: 1203.5 },
    { name: "Enschede", province: "Overijssel", x: 2006.6, y: 1291.5 },

    // Gelderland
    { name: "Apeldoorn",  province: "Gelderland", x: 970.6,  y: 1305.6 },
    { name: "Zutphen",    province: "Gelderland", x: 1228.6, y: 1437.6 },
    { name: "Arnhem",     province: "Gelderland", x: 904.6,  y: 1725.5 },
    { name: "Wageningen", province: "Gelderland", x: 630.6,  y: 1743.6 },
    { name: "Doetinchem", province: "Gelderland", x: 1326.6, y: 1753.6 },
    { name: "Nijmegen",   province: "Gelderland", x: 838.6,  y: 1975.6 },
  ]
};
