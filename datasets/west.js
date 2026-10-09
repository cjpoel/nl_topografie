export const DATASET = {
  id: "west",
  title: "Topografie – West-Nederland (kies provincies)",
  mapImage: "west_schoon.png",
  assetVersion: "2200-2",
  canvasWidth: 2200,
  canvasHeight: 2200,

  dotRadiusPx: 12,
  hitRadiusPx: 55,
  ringRadiusPx: 28,

  places: [
    // Noord-Holland
    { name: "Den Helder", province: "Noord-Holland", x: 1343.8, y: 384.9 },
    { name: "Alkmaar",    province: "Noord-Holland", x: 1339.4, y: 687.5 },
    { name: "Hoorn",      province: "Noord-Holland", x: 1515.1, y: 677.7 },
    { name: "Zaanstad",   province: "Noord-Holland", x: 1383.0, y: 868.3 },
    { name: "Haarlem",    province: "Noord-Holland", x: 1277.9, y: 916.7 },
    { name: "Amsterdam",  province: "Noord-Holland", x: 1425.9, y: 935.2 },
    { name: "Hilversum",  province: "Noord-Holland", x: 1576.6, y: 1064.7 },

    // Zuid-Holland
    { name: "Leiden",     province: "Zuid-Holland", x: 1192.3, y: 1129.4 },
    { name: "Den Haag",   province: "Zuid-Holland", x: 1079.8, y: 1213.2, aliases: ["'s-Gravenhage", "s-Gravenhage", "Gravenhage"] },
    { name: "Zoetermeer", province: "Zuid-Holland", x: 1190.1, y: 1225.8 },
    { name: "Delft",      province: "Zuid-Holland", x: 1112.1, y: 1268.3 },
    { name: "Gouda",      province: "Zuid-Holland", x: 1314.8, y: 1268.4 },
    { name: "Rotterdam",  province: "Zuid-Holland", x: 1181.3, y: 1349.9 },
    { name: "Dordrecht",  province: "Zuid-Holland", x: 1303.1, y: 1453.9 },

    // Zeeland
    { name: "Goes",       province: "Zeeland", x: 843.5, y: 1742.7 },
    { name: "Middelburg", province: "Zeeland", x: 684.1, y: 1748.1 },
    { name: "Vlissingen", province: "Zeeland", x: 662.7, y: 1800.7 },
    { name: "Terneuzen",  province: "Zeeland", x: 808.8, y: 1899.5 },
  ]
};
