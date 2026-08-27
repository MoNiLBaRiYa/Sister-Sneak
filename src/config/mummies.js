/**
 * Sister Sneak: Phone Locked - 4 Selectable Inspector Mummies
 * Includes customized cutscenes, dialogue scripts, personalities, and triggers.
 */

export const MUMMIES = {
  RIDDHI_MUMMY: {
    id: "RIDDHI_MUMMY",
    name: "Riddhi & Jahanvi's Mummy",
    shortName: "Riddhi & Jahanvi's Mummy",
    avatar: "👩‍🦱",
    relation: "Riddhi & Jahanvi's Mummy",
    personality: "Strict on discipline, bedsheet folding & bedroom clutter",
    cutsceneArt: {
      emoji: "📦🔒📱",
      icon: "🧹",
      tagline: "The Bedroom & Discipline Enforcer"
    },
    patrolSpeed: 1.8,
    triggers: [
      { type: "IDLE_ROOM", penalty: 15, msg: "Caught loitering or sitting idle in bedroom!" },
      { type: "UNMADE_BED", penalty: 20, msg: "Found unstraightened bedsheets!" },
      { type: "RUNNING_STAIRS", penalty: 10, msg: "Running too fast on stairs!" }
    ],
    dialogues: {
      intro: "Jya sudhi aakhu ghar chakachak saaf na thai jaay, ek pan chhokri ne phone nahi male! Kaam par laago!",
      introTrans: "Until the entire house is sparkling clean, not a single girl gets her phone! Get to work!",
      meeting: "Bolo! Kona lidhe aa badho kachro thayo?! Who caused this mess in the rooms?!",
      verdictInnocent: "Wah! All bedrooms and beds are tidy! Here are your phones with fresh jalebis!",
      verdictPunish: "Tame mane fasavani koshish kari! Go deep clean the store room alone right now!"
    }
  },

  SHRUTI_MUMMY: {
    id: "SHRUTI_MUMMY",
    name: "Shruti ni Mummy",
    shortName: "Shruti ni Mummy",
    avatar: "👩‍🦳",
    relation: "Shruti's Mummy",
    personality: "Perfectionist about kitchen, spice jars, chai glasses & craft mess",
    cutsceneArt: {
      emoji: "🍳🔒📱",
      icon: "🥛",
      tagline: "The Master Kitchen & Glassware Inspector"
    },
    patrolSpeed: 1.9,
    triggers: [
      { type: "KITCHEN_MESS", penalty: 25, msg: "Unclosed fridge or messy kitchen counters!" },
      { type: "GLASSWARE_MISALIGN", penalty: 20, msg: "Chai glasses not lined up in straight row!" }
    ],
    dialogues: {
      intro: "Kitchen ma ek pan dagho na hovo joie! Badha dabba ane glassware ek line ma muko! Phone box locked che!",
      introTrans: "Not a single stain in the kitchen! Put all spice jars and chai glasses in a straight line! The phone box is locked tight!",
      meeting: "Kitchen ma dabba kon khula mukine gayu?! Speak up right now!",
      verdictInnocent: "Wah! The kitchen looks like a 5-star royal hotel! Phones unlocked with sweets!",
      verdictPunish: "No snacks or phone for you! Wash every single steel dabba and chai glass!"
    }
  },

  JISHA_MUMMY: {
    id: "JISHA_MUMMY",
    name: "Jisha ni Mummy",
    shortName: "Jisha ni Mummy",
    avatar: "👩‍🦰",
    relation: "Jisha's Mummy",
    personality: "Monitors homework sheets, study desks, books & screen time",
    cutsceneArt: {
      emoji: "📚🔒📱",
      icon: "✏️",
      tagline: "The Padhaku & Study Desk Supervisor"
    },
    patrolSpeed: 1.6,
    triggers: [
      { type: "UNFINISHED_HOMEWORK", penalty: 30, msg: "Homework sheet left incomplete!" },
      { type: "SNEAKING_PHONE", penalty: 25, msg: "Hovering too close to the phone box!" }
    ],
    dialogues: {
      intro: "Pehla bhedo thai ne homework ane safai puro karo, pachi j reels jova malse! Phone box locked!",
      introTrans: "First finish your homework and chores together, only then do you get screen time! Phones locked!",
      meeting: "Kone maru book bag chedidhu ane abhyas ma disturb karyo?! Who messed up the study corner?!",
      verdictInnocent: "Very studious and responsible girls! All 5 phones returned with praise!",
      verdictPunish: "Double homework worksheet for you! Phone locked in the safe for 2 days!"
    }
  },

  JYEANA_MUMMY: {
    id: "JYEANA_MUMMY",
    name: "Jyeana ni Mummy",
    shortName: "Jyeana ni Mummy",
    avatar: "👩",
    relation: "Jyeana's Mummy",
    personality: "Eagle-eyed; inspects switchboards, empty lights & electricity bills",
    cutsceneArt: {
      emoji: "⚡🔒📱",
      icon: "💡",
      tagline: "The Eagle-Eyed Power & Electricity Inspector"
    },
    patrolSpeed: 2.2,
    triggers: [
      { type: "LIGHTS_ON", penalty: 20, msg: "Left lights or ceiling fan running in empty room!" },
      { type: "STAIRCASE_DASH", penalty: 15, msg: "Caught sliding or running down banister!" }
    ],
    dialogues: {
      intro: "Bijli no bill ketlo aave che khabar che?! Switch off badhi batti ane ground floor saaf karo! Phone lockbox ni chaavi mari pase che!",
      introTrans: "Do you know how high the electricity bill is?! Turn off all empty lights and clean the ground floor! The key to the phone lockbox is with me!",
      meeting: "Aakhi rat batti chaalu kone rakhi ane bijli waste kari?! Who left the switches ON?!",
      verdictInnocent: "Zero energy wasted, house is spotless! Well done, phones returned!",
      verdictPunish: "Stand in the veranda until you learn to save power! No phone for you!"
    }
  }
};
