/**
 * Sister Sneak: Phone Locked - Game Constants & Hotspots Configurations
 * 18 Distinct Interactive Chores Across 3 Floors with Balanced Progress.
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
    id: "HS_CLOTHES",
    floor: 2,
    x: 200,
    y: FLOOR_Y[2] + 120,
    radius: 36,
    taskId: "CLOTHES_COLLECT",
    label: "Fold Fluttering Sarees",
    icon: "🧺"
  },
  {
    id: "HS_KITE",
    floor: 2,
    x: 360,
    y: FLOOR_Y[2] + 120,
    radius: 36,
    taskId: "KITE_UNTANGLE",
    label: "Untangle Kite Thread",
    icon: "🪁"
  },
  {
    id: "HS_TANK",
    floor: 2,
    x: 600,
    y: FLOOR_Y[2] + 120,
    radius: 36,
    taskId: "TANK_VALVE",
    label: "Water Tank Dial",
    icon: "🚰"
  },
  {
    id: "HS_PAPAD",
    floor: 2,
    x: 740,
    y: FLOOR_Y[2] + 120,
    radius: 36,
    taskId: "PAPAD_DRY",
    label: "Sun-Dry Papad Spread",
    icon: "🫓"
  },
  {
    id: "HS_SOLAR",
    floor: 2,
    x: 880,
    y: FLOOR_Y[2] + 120,
    radius: 36,
    taskId: "SOLAR_PANEL",
    label: "Wipe Solar Panels",
    icon: "☀️"
  },
  {
    id: "HS_STAIRS_T",
    floor: 2,
    x: 1020,
    y: FLOOR_Y[2] + 120,
    radius: 35,
    isStairHotspot: true,
    targetFloor: 1,
    targetX: 1080,
    label: "Go Down to 2F",
    icon: "⬇️"
  },

  // ==========================================
  // --- 2F LIVING HUB HOTSPOTS (Floor 1) ---
  // ==========================================
  {
    id: "HS_BALCONY",
    floor: 1,
    x: 140,
    y: FLOOR_Y[1] + 120,
    radius: 36,
    taskId: "PLANT_WATER",
    label: "Water Tulsi & Plants",
    icon: "🌿"
  },
  {
    id: "HS_BED_1",
    floor: 1,
    x: 310,
    y: FLOOR_Y[1] + 120,
    radius: 36,
    taskId: "BEDSHEET_TUCK",
    label: "Straighten Bedsheet",
    icon: "🛏️"
  },
  {
    id: "HS_HOMEWORK",
    floor: 1,
    x: 410,
    y: FLOOR_Y[1] + 120,
    radius: 36,
    taskId: "HOMEWORK_MATH",
    label: "Sister's Math Homework",
    icon: "✏️"
  },
  {
    id: "HS_PHONE_BOX",
    floor: 1,
    x: 620,
    y: FLOOR_Y[1] + 105,
    radius: 44,
    isEmergencyButton: true,
    label: "Phone Lockbox (Call Meeting)",
    icon: "🚨"
  },
  {
    id: "HS_SPICE",
    floor: 1,
    x: 820,
    y: FLOOR_Y[1] + 120,
    radius: 36,
    taskId: "SPICE_RACK",
    label: "Organize Masala Dabba",
    icon: "🧂"
  },
  {
    id: "HS_KITCHEN_FRIDGE",
    floor: 1,
    x: 890,
    y: FLOOR_Y[1] + 120,
    radius: 36,
    taskId: "FRIDGE_REFILL",
    label: "Refill Cold Water",
    icon: "🍾"
  },
  {
    id: "HS_CHAI",
    floor: 1,
    x: 950,
    y: FLOOR_Y[1] + 120,
    radius: 36,
    taskId: "CHAI_FILTER",
    label: "Strain Masala Chai",
    icon: "☕"
  },
  {
    id: "HS_KHAKHRA",
    floor: 1,
    x: 1010,
    y: FLOOR_Y[1] + 120,
    radius: 36,
    taskId: "SNACK_CONTAINER",
    label: "Seal Khakhra Box",
    icon: "📦"
  },
  {
    id: "HS_STAIRS_HUB_DOWN",
    floor: 1,
    x: 1090,
    y: FLOOR_Y[1] + 120,
    radius: 35,
    isStairHotspot: true,
    targetFloor: 0,
    targetX: 1100,
    label: "Go Down to 1F",
    icon: "⬇️"
  },
  {
    id: "HS_STAIRS_HUB_UP",
    floor: 1,
    x: 1160,
    y: FLOOR_Y[1] + 120,
    radius: 35,
    isStairHotspot: true,
    targetFloor: 2,
    targetX: 1020,
    label: "Go Up to 3F",
    icon: "⬆️"
  },

  // ==========================================
  // --- 1F GROUND ENTRY HOTSPOTS (Floor 0) ---
  // ==========================================
  {
    id: "HS_VERANDA",
    floor: 0,
    x: 130,
    y: FLOOR_Y[0] + 120,
    radius: 36,
    taskId: "FOOTWEAR_MATCH",
    label: "Match Dadi's Chappals",
    icon: "👡"
  },
  {
    id: "HS_RANGOLI",
    floor: 0,
    x: 230,
    y: FLOOR_Y[0] + 120,
    radius: 36,
    taskId: "RANGOLI_TOUCHUP",
    label: "Fill Veranda Rangoli",
    icon: "🌸"
  },
  {
    id: "HS_STORE_ACHAR",
    floor: 0,
    x: 370,
    y: FLOOR_Y[0] + 120,
    radius: 36,
    taskId: "ACHAR_HUNT",
    label: "Hunt Mango Achar Jar",
    icon: "🧳"
  },
  {
    id: "HS_TRUNK_LOCK",
    floor: 0,
    x: 480,
    y: FLOOR_Y[0] + 120,
    radius: 36,
    taskId: "TRUNK_LOCK",
    label: "Oil Antique Trunk Lock",
    icon: "🗝️"
  },
  {
    id: "HS_GLASSWARE",
    floor: 0,
    x: 670,
    y: FLOOR_Y[0] + 120,
    radius: 36,
    taskId: "GLASSWARE_ALIGN",
    label: "Align Chai Glasses",
    icon: "🥛"
  },
  {
    id: "HS_SWITCHES",
    floor: 0,
    x: 910,
    y: FLOOR_Y[0] + 120,
    radius: 36,
    taskId: "SWITCHES_OFF",
    label: "Turn Off Power Switches",
    icon: "💡"
  },
  {
    id: "HS_STAIRS_G_UP",
    floor: 0,
    x: 1120,
    y: FLOOR_Y[0] + 120,
    radius: 35,
    isStairHotspot: true,
    targetFloor: 1,
    targetX: 1100,
    label: "Go Up to 2F",
    icon: "⬆️"
  }
];

export const ROUND_DURATION_SEC = 180;
export const SABOTAGE_COOLDOWNS = {
  BLACKOUT: 30,
  KUNDI: 20,
  MESS: 25
};
