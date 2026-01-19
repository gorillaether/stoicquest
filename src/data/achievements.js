// data/achievements.js

const achievements = [
  {
    id: "streak7",
    title: "Weekly Philosopher",
    description: "Complete a challenge for 7 consecutive days",
    icon: "icons/calendar.png",
    condition: "streak",
    requiredValue: 7,
    xpReward: 100
  },
  {
    id: "allCh1",
    title: "First Principles",
    description: "Complete all challenges in Chapter 1",
    icon: "icons/book.png",
    condition: "chapter_complete",
    requiredValue: 1,
    xpReward: 150
  },
  {
    id: "allCh2",
    title: "Master of Desire",
    description: "Complete all challenges in Chapter 2",
    icon: "icons/compass.png",
    condition: "chapter_complete",
    requiredValue: 2,
    xpReward: 150
  },
  {
    id: "allCh3",
    title: "Attachment Expert",
    description: "Complete all challenges in Chapter 3",
    icon: "icons/heart.png",
    condition: "chapter_complete",
    requiredValue: 3,
    xpReward: 175
  },
  {
    id: "allCh4",
    title: "Challenge Conqueror",
    description: "Complete all challenges in Chapter 4",
    icon: "icons/mountain.png",
    condition: "chapter_complete",
    requiredValue: 4,
    xpReward: 200
  },
  {
    id: "allCh5",
    title: "Master of Mind",
    description: "Complete all challenges in Chapter 5",
    icon: "icons/brain.png",
    condition: "chapter_complete",
    requiredValue: 5,
    xpReward: 225
  },
  {
    id: "reflect10",
    title: "Deep Thinker",
    description: "Complete 10 reflections",
    icon: "icons/thought.png",
    condition: "reflections",
    requiredValue: 10,
    xpReward: 200
  },
  {
    id: "ch_complete_5",
    title: "Student of Philosophy",
    description: "Complete 5 different chapters",
    icon: "icons/scroll.png",
    condition: "chapters_complete",
    requiredValue: 5,
    xpReward: 300
  },
  {
    id: "perfect_quiz",
    title: "Perfect Understanding",
    description: "Get 100% on 5 different quizzes/challenges",
    icon: "icons/medal.png",
    condition: "perfect_challenges",
    requiredValue: 5,
    xpReward: 250
  },
  {
    id: "morning_routine",
    title: "Morning Meditation",
    description: "Use the app for 5 consecutive days during morning hours (5-9am)",
    icon: "icons/sunrise.png",
    condition: "morning_sessions",
    requiredValue: 5,
    xpReward: 150
  },
  {
    id: "evening_reflection",
    title: "Evening Reflection",
    description: "Complete reflections for 5 consecutive days during evening hours (7-11pm)",
    icon: "icons/moon.png",
    condition: "evening_reflections",
    requiredValue: 5,
    xpReward: 150
  },
  {
    id: "stoic_dedication",
    title: "Stoic Dedication",
    description: "Complete at least 15 different reflections across all chapters",
    icon: "icons/pen.png",
    condition: "total_reflections",
    requiredValue: 15,
    xpReward: 275
  },
  {
    id: "practical_wisdom",
    title: "Practical Wisdom",
    description: "Complete at least 10 different challenges across all chapters",
    icon: "icons/tasks.png",
    condition: "total_challenges",
    requiredValue: 10,
    xpReward: 325
  },
  {
    id: "app_master",
    title: "Modern Stoic",
    description: "Complete all chapters and earn at least 10 other achievements",
    icon: "icons/trophy.png",
    condition: "special",
    requiredValue: null,
    xpReward: 500,
    special: true
  }
];

// Helper function to fetch achievement by ID
export function getAchievementById(id) {
  return achievements.find((a) => a.id === id);
}

export default achievements;