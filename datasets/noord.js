export const DATASET = {
  id: "noord",
  title: "Topografie – Noord-Nederland (kies provincies)",
  mapImage: "noord_schoon.png",
  assetVersion: "2200-2",
  canvasWidth: 2200,
  canvasHeight: 2200,

  // (optioneel) grotere stippen + grotere klik-zone
  dotRadiusPx: 12,
  hitRadiusPx: 55,
  ringRadiusPx: 28,

  places: [
    // Groningen
    { name: "Delfzijl",  province: "Groningen", x: 1838.6, y: 506.6 },
    { name: "Groningen", province: "Groningen", x: 1424.6, y: 724.6 },
    { name: "Veendam",   province: "Groningen", x: 1792.6, y: 944.6 },

    // Friesland
    { name: "Leeuwarden", province: "Friesland", x: 504.6, y: 762.6 },
    { name: "Drachten",   province: "Friesland", x: 876.6, y: 958.6 },
    { name: "Sneek",      province: "Friesland", x: 358.6, y: 1088.6 },
    { name: "Heerenveen", province: "Friesland", x: 662.6, y: 1232.6 },

    // Drenthe
    { name: "Assen",     province: "Drenthe", x: 1420.6, y: 1160.5 },
    { name: "Emmen",     province: "Drenthe", x: 1824.6, y: 1584.5 },
    { name: "Hoogeveen", province: "Drenthe", x: 1318.6, y: 1694.5 },
    { name: "Meppel",    province: "Drenthe", x: 986.6,  y: 1746.5 },
  ]
};
