/**
 * Sister Sneak: Phone Locked - 5 Sisters Character Definitions
 * Implements Innocent & Prankster abilities, visual traits, and custom avatar artwork.
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
      name: "Cozy Camouflage",
      desc: "Covers under quilt blanket for 10s (completely invisible to Mummy)."
    },
    pranksterPower: {
      name: "Sleep Cloud Trap",
      desc: "Drops sleep smoke slowing all innocent sisters by 55% for 8s."
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
      name: "Artistic Flow",
      desc: "Auto-solves active chore or grants +20% Cleanliness burst."
    },
    pranksterPower: {
      name: "Fake Paint Frame",
      desc: "Shoots red paint blinding innocents and raising their suspicion by +35%."
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
      name: "Vent Portal Dash",
      desc: "Instant floor teleport + supersonic speed sprint."
    },
    pranksterPower: {
      name: "Vent & Door Slam",
      desc: "Vents to another floor and slams all room doors shut with Kundi on innocents."
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
      name: "Universal Ladli Card",
      desc: "Solves math study sheets instantly with gold star and resets suspicion to 0%."
    },
    pranksterPower: {
      name: "Blame Shift Charm",
      desc: "Mind-tricks Mummy and shifts suspicion directly onto innocent sisters."
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
      name: "Electric Overdrive",
      desc: "Instantly restores all blacked-out lights + 7s Hyper Sprint."
    },
    pranksterPower: {
      name: "Sabotage Surge",
      desc: "Freezes innocent chores for 8s and resets sabotage cooldowns to 0s."
    }
  }
};
