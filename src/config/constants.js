/**
 * Sister Sneak: Phone Locked - Game Constants & Configurations
 */

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export const FLOOR_HEIGHT = 200;
export const FLOOR_Y = {
  2: 60,   // Terrace / Top Floor
  1: 280,  // 1st Floor (Living Hub)
  0: 500   // Ground Floor (Storage & Entry)
};

export const FLOORS = [
  { id: 0, name: "Ground Entry", label: "1F", y: FLOOR_Y[0], height: FLOOR_HEIGHT },
  { id: 1, name: "Living Hub", label: "2F", y: FLOOR_Y[1], height: FLOOR_HEIGHT },
  { id: 2, name: "Terrace", label: "3F", y: FLOOR_Y[2], height: FLOOR_HEIGHT }
];

export const ROOMS = {
  // --- TERRACE (Floor 2) ---
  TERRACE_DRY: {
    id: "TERRACE_DRY",
    floor: 2,
    name: "Terrace Clothes Line",
    bounds: { x: 80, y: FLOOR_Y[2] + 20, w: 480, h: 160 },
    theme: "#E0F2FE",
    icon: "🧺",
    tasks: ["CLOTHES_COLLECT"]
  },
  TERRACE_TANK: {
    id: "TERRACE_TANK",
    floor: 2,
    name: "Water Tank Roof",
    bounds: { x: 580, y: FLOOR_Y[2] + 20, w: 320, h: 160 },
    theme: "#BAE6FD",
    icon: "🚰",
    tasks: ["TANK_VALVE"]
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

  // --- 1ST FLOOR - LIVING HUB (Floor 1) ---
  BALCONY: {
    id: "BALCONY",
    floor: 1,
    name: "Green Balcony",
    bounds: { x: 60, y: FLOOR_Y[1] + 20, w: 180, h: 160 },
    theme: "#DCFCE7",
    icon: "🌿",
    tasks: ["PLANT_WATER", "HOMEWORK"]
  },
  BEDROOM_1: {
    id: "BEDROOM_1",
    floor: 1,
    name: "Sisters' Bedroom 1",
    bounds: { x: 250, y: FLOOR_Y[1] + 20, w: 200, h: 160 },
    theme: "#FEE2E2",
    icon: "🛏️",
    tasks: ["BEDSHEET_TUCK"]
  },
  CENTRAL_HALL: {
    id: "CENTRAL_HALL",
    floor: 1,
    name: "Central Living Hall (Phone Box)",
    bounds: { x: 460, y: FLOOR_Y[1] + 20, w: 340, h: 160 },
    theme: "#FEF3C7",
    icon: "🛋️",
    isMeetingRoom: true,
    tasks: []
  },
  KITCHEN: {
    id: "KITCHEN",
    floor: 1,
    name: "Grand Kitchen",
    bounds: { x: 810, y: FLOOR_Y[1] + 20, w: 220, h: 160 },
    theme: "#FFEDD5",
    icon: "🍳",
    tasks: ["FRIDGE_REFILL", "SNACK_RAID"]
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

  // --- GROUND FLOOR - STORAGE & ENTRY (Floor 0) ---
  VERANDA: {
    id: "VERANDA",
    floor: 0,
    name: "Entry Veranda & Rangoli",
    bounds: { x: 60, y: FLOOR_Y[0] + 20, w: 230, h: 160 },
    theme: "#FEF9C3",
    icon: "👡",
    tasks: ["FOOTWEAR_MATCH"]
  },
  STORE_ROOM: {
    id: "STORE_ROOM",
    floor: 0,
    name: "Dadi's Trunk Store Room",
    bounds: { x: 300, y: FLOOR_Y[0] + 20, w: 240, h: 160 },
    theme: "#E2E8F0",
    icon: "🧳",
    tasks: ["ACHAR_HUNT"]
  },
  BAR_COUNTER: {
    id: "BAR_COUNTER",
    floor: 0,
    name: "Chai & Glassware Counter",
    bounds: { x: 550, y: FLOOR_Y[0] + 20, w: 240, h: 160 },
    theme: "#FAE8FF",
    icon: "🥛",
    tasks: ["GLASSWARE_ALIGN"]
  },
  GROUND_BEDROOM: {
    id: "GROUND_BEDROOM",
    floor: 0,
    name: "Ground Guest Room & Bath",
    bounds: { x: 800, y: FLOOR_Y[0] + 20, w: 230, h: 160 },
    theme: "#F1F5F9",
    icon: "💡",
    tasks: ["SWITCHES_OFF"]
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
  // --- Terrace Hotspots ---
  {
    id: "HS_CLOTHES",
    floor: 2,
    x: 240,
    y: FLOOR_Y[2] + 120,
    radius: 40,
    taskId: "CLOTHES_COLLECT",
    label: "Dry Clothes",
    icon: "🧺"
  },
  {
    id: "HS_TANK",
    floor: 2,
    x: 740,
    y: FLOOR_Y[2] + 120,
    radius: 40,
    taskId: "TANK_VALVE",
    label: "Water Tank Valve",
    icon: "🚰"
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

  // --- Living Hub Hotspots ---
  {
    id: "HS_BALCONY",
    floor: 1,
    x: 140,
    y: FLOOR_Y[1] + 120,
    radius: 40,
    taskId: "PLANT_WATER",
    label: "Water Plants",
    icon: "🌿"
  },
  {
    id: "HS_BED_1",
    floor: 1,
    x: 350,
    y: FLOOR_Y[1] + 120,
    radius: 40,
    taskId: "BEDSHEET_TUCK",
    label: "Straighten Bedsheet",
    icon: "🛏️"
  },
  {
    id: "HS_PHONE_BOX",
    floor: 1,
    x: 630,
    y: FLOOR_Y[1] + 105,
    radius: 45,
    isEmergencyButton: true,
    label: "Phone Lockbox (Call Meeting)",
    icon: "🚨"
  },
  {
    id: "HS_KITCHEN_FRIDGE",
    floor: 1,
    x: 910,
    y: FLOOR_Y[1] + 120,
    radius: 40,
    taskId: "FRIDGE_REFILL",
    label: "Refill Fridge Bottle",
    icon: "🍾"
  },
  {
    id: "HS_STAIRS_HUB_DOWN",
    floor: 1,
    x: 1100,
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

  // --- Ground Floor Hotspots ---
  {
    id: "HS_VERANDA",
    floor: 0,
    x: 170,
    y: FLOOR_Y[0] + 120,
    radius: 40,
    taskId: "FOOTWEAR_MATCH",
    label: "Match Dadi's Chappals",
    icon: "👡"
  },
  {
    id: "HS_STORE_ACHAR",
    floor: 0,
    x: 420,
    y: FLOOR_Y[0] + 120,
    radius: 40,
    taskId: "ACHAR_HUNT",
    label: "Hunt Mango Achar Jar",
    icon: "🧳"
  },
  {
    id: "HS_GLASSWARE",
    floor: 0,
    x: 670,
    y: FLOOR_Y[0] + 120,
    radius: 40,
    taskId: "GLASSWARE_ALIGN",
    label: "Align Chai Glasses",
    icon: "🥛"
  },
  {
    id: "HS_SWITCHES",
    floor: 0,
    x: 910,
    y: FLOOR_Y[0] + 120,
    radius: 40,
    taskId: "SWITCHES_OFF",
    label: "Switch Off Lights & Fan",
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

export const ROUND_DURATION_SEC = 180; // 3 minutes round
export const SABOTAGE_COOLDOWNS = {
  BLACKOUT: 35,
  KUNDI: 25,
  MESS: 30
};
