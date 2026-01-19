// src/data/avatars.js
// Data structure defining the different NFT avatar stages based on user level.
const avatars = [
  {
    id: 'novice', // Using string IDs for consistency
    name: "Novice",
    imageUrl: "/assets/images/avatars/novice.png", // Adjusted key name
    requiredLevel: 1,
    description: "Taking the first steps on the Stoic path"
  },
  {
    id: 'apprentice',
    name: "Apprentice",
    imageUrl: "/assets/images/avatars/apprentice.png",
    requiredLevel: 5,
    description: "Beginning to grasp key Stoic principles"
  },
  {
    id: 'practitioner',
    name: "Practitioner",
    imageUrl: "avatars/practitioner.png",
    requiredLevel: 10,
    description: "Regularly applying Stoic practices in daily life"
  },
  {
    id: 'scholar',
    name: "Scholar",
    imageUrl: "avatars/scholar.png",
    requiredLevel: 15,
    description: "Deep understanding of Stoic philosophy"
  },
  {
    id: 'sage',
    name: "Sage",
    imageUrl: "avatars/sage.png",
    requiredLevel: 20,
    description: "Embodying Stoic wisdom in thought and action"
  },
  {
    id: 'epictetus',
    name: "Epictetus",
    imageUrl: "avatars/epictetus.png",
    requiredLevel: 30,
    description: "Master of Stoic philosophy",
    special: true // Indicates a special or final avatar
  }
];

// Helper function to get an avatar by its ID
export const getAvatarById = (id) => {
  return avatars.find(avatar => avatar.id === id);
};

// Helper function to get avatars available at or below a certain level
export const getAvatarsUpToLevel = (level) => {
    return avatars.filter(avatar => avatar.requiredLevel <= level);
};

// Helper function to get avatars that are unlocked *exactly* at a certain level
export const getAvatarsAtLevel = (level) => {
    return avatars.filter(avatar => avatar.requiredLevel === level);
};


export default avatars;