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