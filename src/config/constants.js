/**
 * Sister Sneak: Phone Locked - Game Constants & Hotspots Configurations
 * 20 Distinct Interactive Chores & Fuse Boxes Across all 3 Floors with Balanced Progress.
 */

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export const FLOOR_HEIGHT = 200;
export const FLOOR_Y = {
  2: 60,   // Terrace / Top Floor (3F)
  1: 280,  // 1st Floor (Living Hub 2F)
  0: 500   // Ground Floor (Storage & Entry 1F)
};

export const FLOORS = [
  { id: 0, name: "Ground Entry", label: "1F", y: FLOOR_Y[0], height: FLOOR_HEIGHT },
  { id: 1, name: "Living Hub", label: "2F", y: FLOOR_Y[1], height: FLOOR_HEIGHT },
  { id: 2, name: "Terrace", label: "3F", y: FLOOR_Y[2], height: FLOOR_HEIGHT }
];

export const ROOMS = {
  // --- TERRACE (Floor 2 / 3F) ---
  TERRACE_DRY: {
    id: "TERRACE_DRY",
    floor: 2,
    name: "Terrace Clothes Line & Solar Roof",
    bounds: { x: 60, y: FLOOR_Y[2] + 20, w: 500, h: 160 },
    theme: "#E0F2FE",
    icon: "🧺"
  },
  TERRACE_TANK: {
    id: "TERRACE_TANK",
    floor: 2,
    name: "Water Tank & Papad Terrace",
    bounds: { x: 580, y: FLOOR_Y[2] + 20, w: 320, h: 160 },
    theme: "#BAE6FD",
    icon: "🚰"
  },
  TERRACE_STAIRS: {
    id: "TERRACE_STAIRS",
    floor: 2,
    name: "Terrace Stairs",
    bounds: { x: 920, y: FLOOR_Y[2] + 20, w: 260, h: 160 },
    theme: "#FDE68A",
    icon: "🪜",
    isStairs: true,
    connectsTo: { floor: 1, x: 960, y: FLOOR_Y[1] + 100 }
  },

  // --- 1ST FLOOR - LIVING HUB (Floor 1 / 2F) ---
  BALCONY: {
    id: "BALCONY",
    floor: 1,
    name: "Green Balcony",
    bounds: { x: 60, y: FLOOR_Y[1] + 20, w: 180, h: 160 },
    theme: "#DCFCE7",
    icon: "🌿"
  },
  BEDROOM_1: {
    id: "BEDROOM_1",
    floor: 1,
    name: "Sisters' Bedroom & Study Corner",
    bounds: { x: 250, y: FLOOR_Y[1] + 20, w: 200, h: 160 },
    theme: "#FEE2E2",
    icon: "🛏️"
  },
  CENTRAL_HALL: {
    id: "CENTRAL_HALL",
    floor: 1,
    name: "Central Living Hall (Phone Box)",
    bounds: { x: 460, y: FLOOR_Y[1] + 20, w: 310, h: 160 },
    theme: "#FEF3C7",
    icon: "🛋️",
    isMeetingRoom: true
  },
  KITCHEN: {
    id: "KITCHEN",
    floor: 1,
    name: "Grand Kitchen",
    bounds: { x: 780, y: FLOOR_Y[1] + 20, w: 250, h: 160 },
    theme: "#FFEDD5",
    icon: "🍳"
  },
  HUB_STAIRS: {
    id: "HUB_STAIRS",
    floor: 1,
    name: "Living Hub Stairs",
    bounds: { x: 1040, y: FLOOR_Y[1] + 20, w: 180, h: 160 },
    theme: "#FDE68A",
    icon: "🪜",
    isStairs: true,
    connectsTo: { floor: 2, x: 980, y: FLOOR_Y[2] + 100 }
  },

  // --- GROUND FLOOR - STORAGE & ENTRY (Floor 0 / 1F) ---
  VERANDA: {
    id: "VERANDA",
    floor: 0,
    name: "Entry Veranda & Rangoli",
    bounds: { x: 60, y: FLOOR_Y[0] + 20, w: 230, h: 160 },
    theme: "#FEF9C3",
    icon: "👡"
  },
  STORE_ROOM: {
    id: "STORE_ROOM",
    floor: 0,
    name: "Dadi's Trunk Store Room",
    bounds: { x: 300, y: FLOOR_Y[0] + 20, w: 240, h: 160 },
    theme: "#E2E8F0",
    icon: "🧳"
  },
  BAR_COUNTER: {
    id: "BAR_COUNTER",
    floor: 0,
    name: "Chai & Glassware Counter",
    bounds: { x: 550, y: FLOOR_Y[0] + 20, w: 240, h: 160 },
    theme: "#FAE8FF",
    icon: "🥛"
  },
  GROUND_BEDROOM: {
    id: "GROUND_BEDROOM",
    floor: 0,
    name: "Ground Guest Room & Power Board",
    bounds: { x: 800, y: FLOOR_Y[0] + 20, w: 230, h: 160 },
    theme: "#F1F5F9",
    icon: "💡"
  },
  GROUND_STAIRS: {
    id: "GROUND_STAIRS",
    floor: 0,
    name: "Ground Floor Stairs",
    bounds: { x: 1040, y: FLOOR_Y[0] + 20, w: 180, h: 160 },
    theme: "#FDE68A",
    icon: "🪜",
    isStairs: true,
    connectsTo: { floor: 1, x: 1060, y: FLOOR_Y[1] + 100 }
  }
};

export const HOTSPOTS = [
  // ==========================================
  // --- 3F TERRACE HOTSPOTS (Floor 2) ---
  // ==========================================
  {
    id: "HS_SOLAR",
    floor: 2,
    x: 220,
    y: FLOOR_Y[2] + 68,
    radius: 40,
    taskId: "SOLAR_PANEL",
    label: "Wipe Solar Panels",
    icon: "☀️"
  },
  {
    id: "HS_CLOTHES",
    floor: 2,
    x: 600,
    y: FLOOR_Y[2] + 116,
    radius: 42,
    taskId: "CLOTHES_COLLECT",
    label: "Fold Fluttering Sarees",
    icon: "🧺"
  },
  {
    id: "HS_FUSE_3F",
    floor: 2,
    x: 980,
    y: FLOOR_Y[2] + 62,
    radius: 38,
    taskId: "SWITCHES_OFF",
    isFuseBox: true,
    label: "3F Solar Inverter & Fuse Box",
    icon: "⚡"
  },
  {
    id: "HS_STAIRS_T",
    floor: 2,
    x: 1080,
    y: FLOOR_Y[2] + 110,
    radius: 38,
    isStairHotspot: true,
    targetFloor: 1,
    targetX: 1090,
    label: "Go Down to 2F",
    icon: "⬇️"
  },

  // ==========================================
  // --- 2F LIVING HUB HOTSPOTS (Floor 1) ---
  // ==========================================
  {
    id: "HS_BALCONY",
    floor: 1,
    x: 87,
    y: FLOOR_Y[1] + 140,
    radius: 38,
    taskId: "PLANT_WATER",
    label: "Water Balcony Tulsi",
    icon: "🌿"
  },
  {
    id: "HS_HOMEWORK",
    floor: 1,
    x: 201,
    y: FLOOR_Y[1] + 62,
    radius: 38,
    taskId: "HOMEWORK_MATH",
    label: "Study Desk: Math Homework",
    icon: "📚"
  },
  {
    id: "HS_PHONE_BOX",
    floor: 1,
    x: 600,
    y: FLOOR_Y[1] + 88,
    radius: 44,
    isEmergencyButton: true,
    label: "Phone Lock Box (Call Meeting)",
    icon: "🚨"
  },
  {
    id: "HS_FUSE_2F",
    floor: 1,
    x: 771,
    y: FLOOR_Y[1] + 56,
    radius: 38,
    taskId: "SWITCHES_OFF",
    isFuseBox: true,
    label: "2F Main Hall Switchboard",
    icon: "⚡"
  },
  {
    id: "HS_BED_1",
    floor: 1,
    x: 999,
    y: FLOOR_Y[1] + 72,
    radius: 40,
    taskId: "BEDSHEET_TUCK",
    label: "Straighten Bedroom Bed",
    icon: "🛏️"
  },
  {
    id: "HS_STAIRS_HUB_DOWN",
    floor: 1,
    x: 1090,
    y: FLOOR_Y[1] + 110,
    radius: 36,
    isStairHotspot: true,
    targetFloor: 0,
    targetX: 1120,
    label: "Go Down to 1F",
    icon: "⬇️"
  },
  {
    id: "HS_STAIRS_HUB_UP",
    floor: 1,
    x: 1160,
    y: FLOOR_Y[1] + 110,
    radius: 36,
    isStairHotspot: true,
    targetFloor: 2,
    targetX: 1080,
    label: "Go Up to 3F",
    icon: "⬆️"
  },

  // ==========================================
  // --- 1F GROUND ENTRY HOTSPOTS (Floor 0) ---
  // ==========================================
  {
    id: "HS_CHAI",
    floor: 0,
    x: 201,
    y: FLOOR_Y[0] + 60,
    radius: 40,
    taskId: "CHAI_FILTER",
    label: "Kitchen: Strain Masala Chai",
    icon: "☕"
  },
  {
    id: "HS_RANGOLI",
    floor: 0,
    x: 600,
    y: FLOOR_Y[0] + 128,
    radius: 40,
    taskId: "RANGOLI_TOUCHUP",
    label: "Courtyard: Fill Floor Rangoli",
    icon: "🌸"
  },
  {
    id: "HS_VERANDA",
    floor: 0,
    x: 847,
    y: FLOOR_Y[0] + 128,
    radius: 40,
    taskId: "FOOTWEAR_MATCH",
    label: "Shoe Rack: Match Chappals",
    icon: "👡"
  },
  {
    id: "HS_STORE_ACHAR",
    floor: 0,
    x: 999,
    y: FLOOR_Y[0] + 60,
    radius: 40,
    taskId: "ACHAR_HUNT",
    label: "Store: Hunt Mango Achar",
    icon: "🏺"
  },
  {
    id: "HS_SWITCHES",
    floor: 0,
    x: 1113,
    y: FLOOR_Y[0] + 68,
    radius: 38,
    taskId: "SWITCHES_OFF",
    isFuseBox: true,
    label: "1F Ground Power Board",
    icon: "💡"
  },
  {
    id: "HS_STAIRS_G_UP",
    floor: 0,
    x: 1140,
    y: FLOOR_Y[0] + 110,
    radius: 36,
    isStairHotspot: true,
    targetFloor: 1,
    targetX: 1090,
    label: "Go Up to 2F",
    icon: "⬆️"
  }
];

export const ROUND_DURATION_SEC = 180;
export const SABOTAGE_COOLDOWNS = {
  BLACKOUT: 25,
  KUNDI: 15
};
