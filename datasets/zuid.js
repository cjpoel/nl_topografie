export const DATASET = {
  id: "zuid",
  title: "Topografie – Zuid-Nederland (kies provincies)",
  mapImage: "zuid_schoon.png",
  assetVersion: "2200-1",
  canvasWidth: 2200,
  canvasHeight: 2200,

  dotRadiusPx: 12,
  hitRadiusPx: 55,
  ringRadiusPx: 28,

  places: [
    // Utrecht
    { name: "Amersfoort", province: "Utrecht", x: 1426.6, y: 464.6 },
    { name: "Utrecht",    province: "Utrecht", x: 1246.6, y: 536.6 },

    // Noord-Brabant
    { name: "Oss",              province: "Noord-Brabant", x: 1514.6, y: 894.6 },
    { name: "'s-Hertogenbosch", province: "Noord-Brabant", x: 1370.6, y: 966.6 },
    { name: "Breda",            province: "Noord-Brabant", x: 1012.6, y: 1088.6 },
    { name: "Tilburg",          province: "Noord-Brabant", x: 1226.6, y: 1122.6 },
    { name: "Roosendaal",       province: "Noord-Brabant", x: 802.6,  y: 1150.6 },
    { name: "Bergen op Zoom",   province: "Noord-Brabant", x: 684.6,  y: 1188.6 },
    { name: "Helmond",          province: "Noord-Brabant", x: 1612.6, y: 1202.6 },
    { name: "Eindhoven",        province: "Noord-Brabant", x: 1488.6, y: 1248.6 },

    // Limburg
    { name: "Venlo",      province: "Limburg", x: 1956.6, y: 1324.6 },
    { name: "Roermond",   province: "Limburg", x: 1832.6, y: 1514.6 },
    { name: "Heerlen",    province: "Limburg", x: 1828.6, y: 1850.6 },
    { name: "Maastricht", province: "Limburg", x: 1630.6, y: 1888.6 },
  ]
};
