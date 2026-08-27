/**
 * Sister Sneak: Phone Locked - 5 Sisters Character Definitions
 * Implements Innocent & Imposter abilities, visual traits, and custom avatar artwork.
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
      name: "Partner Courage",
      desc: "Tasks 1.5x faster when near another sister."
    },
    imposterPower: {
      name: "Blanket Stealth",
      desc: "Hides under blanket for 8s (invisible & untargetable)."
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
      desc: "2x speed on decoration & cleaning tasks (+20% Cleanliness burst)."
    },
    imposterPower: {
      name: "Fake Clue Fabricator",
      desc: "Plants fake evidence that raises suspicion of innocent sisters."
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
      name: "Shortcut Master",
      desc: "+25% movement speed everywhere in the house."
    },
    imposterPower: {
      name: "Floor Teleport",
      desc: "Instant floor jump with zero delay right after a sabotage."
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
      desc: "Solves study tasks instantly; resets Mummy's suspicion to zero."
    },
    imposterPower: {
      name: "Innocent Shield",
      desc: "Auto-cancels the first vote cast against her during each meeting."
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
      name: "Quick Hint & Dash",
      desc: "Visual arrow clues on puzzle tasks + 5s sprint dash."
    },
    imposterPower: {
      name: "Rapid Saboteur",
      desc: "All sabotage cooldowns reset to 0s instantly."
    }
  }
};
