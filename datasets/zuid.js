export const DATASET = {
  id: "zuid",
  title: "Topografie – Zuid-Nederland (kies provincies)",
  mapImage: "zuid_schoon.png",          // <-- jouw nieuwe schone kaart
  assetVersion: "20260227-3",           // <-- bump dit bij updates (cache-buster)
  canvasWidth: 1250,
  canvasHeight: 1212,
  delayGoodMs: 900,
  delayBadMs: 1600,
  places: [
    // Utrecht
    { name: "Utrecht",     province: "Utrecht", x: 682.6,  y: 348.6 },
    { name: "Amersfoort",  province: "Utrecht", x: 774.6,  y: 310.6 },

    // Noord-Brabant
    { name: "Bergen op Zoom",   province: "Noord-Brabant", x: 388.6, y: 688.6 },
    { name: "Roosendaal",       province: "Noord-Brabant", x: 450.6, y: 666.6 },
    { name: "Breda",            province: "Noord-Brabant", x: 558.6, y: 636.6 },
    { name: "'s-Hertogenbosch", province: "Noord-Brabant", x: 670.6, y: 652.6 },
    { name: "Tilburg",          province: "Noord-Brabant", x: 746.6, y: 572.6 },
    { name: "Oss",              province: "Noord-Brabant", x: 820.6, y: 534.6 },
    { name: "Eindhoven",        province: "Noord-Brabant", x: 806.6, y: 718.6 },
    { name: "Helmond",          province: "Noord-Brabant", x: 872.6, y: 694.6 },

    // Limburg
    { name: "Venlo",      province: "Limburg", x: 1050.6, y: 758.6 },
    { name: "Roermond",   province: "Limburg", x: 986.6,  y: 856.6 },
    { name: "Heerlen",    province: "Limburg", x: 984.6,  y: 1032.6 },
    { name: "Maastricht", province: "Limburg", x: 880.6,  y: 1050.6 },
  ]
};
