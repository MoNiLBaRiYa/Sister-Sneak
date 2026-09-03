/**
 * Sister Sneak: Phone Locked - 5 Sisters Character Definitions & Asymmetric Powers
 * 
 * POWER DESIGN PHILOSOPHY:
 * - INNOCENT POWERS: Strictly HELP ONESELF (Self-Buff, Immunity, Speed Dash, Task Auto-Solve, Stealth).
 * - PRANKSTER POWERS: Strictly TRAP SOMEONE OR IRRITATE/DISRUPT ALL SISTERS (Sticky Traps, Paint Blindness, Inverted Controls, Sleep Clouds, False Alarms).
 */

export const SISTERS = {
  RIDDHI: {
    id: "RIDDHI",
    name: "Riddhi",
    archetype: "Darpok & Aalsi (Timid & Lazy)",
    avatar: "🌸",
    image: "assets/avatars/riddhi.jpg",
    color: "#F472B6", // Soft Pink
    hairColor: "#2A1810",
    hairStyle: "two-braids",
    dressColor: "#F472B6",
    accessory: "blanket",
    speed: 3.2,
    innocentPower: {
      name: "Blanket Sanctuary",
      tag: "SELF-IMMUNITY & STEALTH",
      desc: "Covers under cozy blanket: 100% invisible to Mummy, drops suspicion to 0%, and grants speed boost for 10s."
    },
    pranksterPower: {
      name: "Sleep Cloud Trap",
      tag: "MASS IRRITATION & SLOW",
      desc: "Drops lavender sleep fog on floor: Slows all innocent sisters by 60% with heavy drowsy screen fog for 8s."
    }
  },

  SHRUTI: {
    id: "SHRUTI",
    name: "Shruti",
    archetype: "Creative & Crafty",
    avatar: "🎨",
    image: "assets/avatars/shruti.jpg",
    color: "#38BDF8", // Sky Blue
    hairColor: "#1E1B18",
    hairStyle: "side-ponytail",
    dressColor: "#38BDF8",
    accessory: "paint-brush",
    speed: 3.4,
    innocentPower: {
      name: "Artistic Masterstroke",
      tag: "SELF TASK BURST",
      desc: "Instantly auto-solves active chore or generates +20% Cleanliness burst + 6s lightfooted sprint."
    },
    pranksterPower: {
      name: "Rangoli Paint Splatter",
      tag: "SCREEN BLINDNESS & SUSPICION",
      desc: "Shoots festive gulal paint: Blinds all innocent sisters' screens with colorful paint splatter for 5s + raises suspicion by +30%."
    }
  },

  JAHANVI: {
    id: "JAHANVI",
    name: "Jahanvi",
    archetype: "Ghumakkad (Explorer)",
    avatar: "🎒",
    image: "assets/avatars/jahanvi.jpg",
    color: "#FBBF24", // Sunny Yellow / Orange
    hairColor: "#3B2219",
    hairStyle: "high-ponytail",
    dressColor: "#F59E0B",
    accessory: "sneakers",
    speed: 4.2,
    innocentPower: {
      name: "Vent Shortcut & Turbo Dash",
      tag: "SELF ESCAPE & TELEPORT",
      desc: "Secret floor teleport through laundry chute + 7s Supersonic Turbo Sprint (2.2x speed)."
    },
    pranksterPower: {
      name: "Sticky Bubblegum Snare",
      tag: "TRAP & IMMOBILIZE",
      desc: "Lays sticky bubblegum traps: Completely immobilizes & roots innocent sisters in place for 5s."
    }
  },

  JISHA: {
    id: "JISHA",
    name: "Jisha",
    archetype: "Cute, Mastikhor & Padhaku",
    avatar: "📚",
    image: "assets/avatars/jisha.jpg",
    color: "#A78BFA", // Lavender Purple
    hairColor: "#1C1917",
    hairStyle: "cute-pigtails",
    dressColor: "#8B5CF6",
    accessory: "glasses",
    speed: 3.5,
    innocentPower: {
      name: "Mummy's Ladli Shield",
      tag: "SELF ALIBI & TOTAL IMMUNITY",
      desc: "Activates golden favorite charm: Mummy ignores you completely with love, and you are 100% immune in Emergency Meetings for 12s."
    },
    pranksterPower: {
      name: "False Alarm & Blame Transfer",
      tag: "MASS CONFUSION & MUMMY RUSH",
      desc: "Screams a fake emergency! Triggers Mummy to chase innocent sisters and transfers +35% suspicion onto them."
    }
  },

  JYEANA: {
    id: "JYEANA",
    name: "Jyeana",
    archetype: "Clever & Athletic",
    avatar: "⚡",
    image: "assets/avatars/jyeana.jpg",
    color: "#34D399", // Emerald Green
    hairColor: "#26150F",
    hairStyle: "short-bob",
    dressColor: "#10B981",
    accessory: "headband",
    speed: 3.6,
    innocentPower: {
      name: "Smart Inverter Hack",
      tag: "SELF LIGHT & TASK TURBO",
      desc: "Instantly repairs blackouts on all floors, unlocks night vision, and grants 7s Hyper Sprint."
    },
    pranksterPower: {
      name: "EMP Jammer & Inverted Controls",
      tag: "GLITCH CONTROLS & TASK FREEZE",
      desc: "Pulses electromagnetic jammer: Inverts innocent sisters' movement controls (Left ⇋ Right) & freezes chores for 6s."
    }
  }
};
