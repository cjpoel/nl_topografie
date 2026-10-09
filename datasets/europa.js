export const DATASET = {
  id: "europa",
  title: "Topografie – Europa (hoofdsteden en gebergten)",
  mapImage: "europa_schoon.jpg",
  assetVersion: "2233-1",
  canvasWidth: 2233,
  canvasHeight: 1702,

  dotRadiusPx: 11,
  hitRadiusPx: 50,
  ringRadiusPx: 28,

  groupLabel: "Onderdelen",
  itemLabel: "namen",
  typePrompt: "Wat is dit? (typ de naam)",
  typePlaceholder: "Typ de naam…",

  places: [
    // Hoofdsteden (stippen op de kaart van school)
    { name: "Oslo",       province: "Hoofdsteden", x: 846.9,  y: 548.0 },
    { name: "Stockholm",  province: "Hoofdsteden", x: 1012.4, y: 561.8 },
    { name: "Moskou",     province: "Hoofdsteden", x: 1501.5, y: 608.2, aliases: ["Moscow", "Moskva"] },
    { name: "Londen",     province: "Hoofdsteden", x: 556.5,  y: 912.9, aliases: ["London"] },
    { name: "Amsterdam",  province: "Hoofdsteden", x: 691.2,  y: 890.9 },
    { name: "Brussel",    province: "Hoofdsteden", x: 671.0,  y: 953.9, aliases: ["Bruxelles", "Brussels"] },
    { name: "Luxemburg",  province: "Hoofdsteden", x: 719.7,  y: 1007.7, aliases: ["Luxembourg"] },
    { name: "Parijs",     province: "Hoofdsteden", x: 608.2,  y: 1037.0, aliases: ["Paris"] },
    { name: "Berlijn",    province: "Hoofdsteden", x: 919.0,  y: 879.3, aliases: ["Berlin"] },
    { name: "Warschau",   province: "Hoofdsteden", x: 1125.1, y: 872.9, aliases: ["Warszawa", "Warsaw"] },
    { name: "Wenen",      province: "Hoofdsteden", x: 1017.6, y: 1071.6, aliases: ["Wien", "Vienna"] },
    { name: "Bern",       province: "Hoofdsteden", x: 755.0,  y: 1136.6 },
    { name: "Rome",       province: "Hoofdsteden", x: 912.9,  y: 1360.8, aliases: ["Roma"] },
    { name: "Madrid",     province: "Hoofdsteden", x: 361.5,  y: 1385.1 },

    // Gebergten (bruine banden). De stip staat midden in de band; klikken mag
    // overal op de band (hitPoints, gemeten langs de bruine pixels).
    { name: "Oeral", province: "Gebergten", x: 1877, y: 280, hitRadiusPx: 45, aliases: ["Oeralgebergte", "Ural"],
      hitPoints: [[1717, 47], [1733, 98], [1764, 113], [1783, 161], [1821, 180], [1838, 224], [1879, 242], [1855, 268], [1897, 285], [1938, 303], [1915, 333], [1950, 348], [1961, 404], [1969, 460], [2003, 471], [2015, 510]] },
    { name: "Kaukasus", province: "Gebergten", x: 1928, y: 1060, hitRadiusPx: 45, aliases: ["Kaukasusgebergte", "Caucasus"],
      hitPoints: [[1836, 1055], [1893, 1052], [1956, 1044], [2011, 1042], [2065, 1056], [1781, 1077], [1834, 1081], [1892, 1081], [1950, 1074], [2012, 1072], [2075, 1073]] },
    { name: "Alpen", province: "Gebergten", x: 836, y: 1163, hitRadiusPx: 45, aliases: ["Alps"],
      hitPoints: [[836, 1125], [890, 1120], [950, 1117], [992, 1106], [723, 1186], [769, 1167], [830, 1163], [885, 1160], [946, 1149], [711, 1230], [714, 1267]] },
    { name: "Pyreneeën", province: "Gebergten", x: 527, y: 1306, hitRadiusPx: 45, aliases: ["Pyreneeen", "Pyrenees"],
      hitPoints: [[487, 1294], [527, 1306], [575, 1322]] },
  ],
};
