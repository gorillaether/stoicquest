// src/utils/levelUtils.js
// Utility functions for calculating user level based on XP and related level progression data.

/**
 * Calculates the user's level based on their total experience points (XP).
 * This is a basic example; adjust thresholds for your desired progression curve.
 * @param {number} xp - The user's total experience points.
 * @returns {number} - The calculated user level.
 */
export const calculateLevel = (xp) => {
    if (typeof xp !== 'number' || xp < 0) return 1; // Ensure valid XP

    if (xp < 100) return 1;
    if (xp < 250) return 2;
    if (xp < 500) return 3;
    if (xp < 1000) return 4; // Example: Added more distinct thresholds
    if (xp < 2000) return 5;
    // Add more levels and XP thresholds as needed for your game's progression

    // Simple linear calculation for levels beyond explicit thresholds
    // This part makes leveling up at higher levels require a consistent amount of XP (e.g., 100 XP per level after level 3)
    // Consider a more complex, possibly exponential function for a smoother curve if needed
    if (xp >= 500) {
        // For XP >= 500, the base is level 3 (requiring 500 XP).
        // Each additional 100 XP grants one level.
        return 3 + Math.floor((xp - 500) / 100);
    }


    return 1; // Fallback, should not be reached with checks above
};

/**
 * Calculates the minimum total XP required to reach a specific level.
 * This is the inverse of the calculateLevel function.
 * @param {number} level - The target level.
 * @returns {number} - The minimum total XP required for that level.
 */
export const getXpForLevel = (level) => {
    if (typeof level !== 'number' || level < 1) return 0;

    if (level === 1) return 0; // Level 1 starts at 0 XP
    if (level === 2) return 100;
    if (level === 3) return 250;
    if (level === 4) return 500;
    if (level === 5) return 1000;
    if (level === 6) return 2000;
    // Add thresholds corresponding to calculateLevel

    // Linear calculation inverse
    if (level > 3) {
        // For levels > 3, it's the base XP for level 3 (500) plus 100 XP for each level beyond 3.
        return 500 + (level - 3) * 100;
    }

    return 0; // Fallback
};


/**
 * Calculates the total XP needed to reach the next level from the current XP.
 * @param {number} currentXp - The user's current experience points.
 * @returns {number} - The XP needed to reach the next level. Returns 0 if at max level or input is invalid.
 */
export const getXpToNextLevel = (currentXp) => {
    if (typeof currentXp !== 'number' || currentXp < 0) return 0;

    const currentLevel = calculateLevel(currentXp);
    const xpForCurrentLevel = getXpForLevel(currentLevel);
    const xpForNextLevel = getXpForLevel(currentLevel + 1);

    // If getXpForLevel returns the same XP for the next level, it might indicate max level or end of defined thresholds
    if (xpForNextLevel <= xpForCurrentLevel) {
        // Potentially at max level or beyond defined levels, or error in thresholds
        return 0; // Indicate no more levels or undefined progression
    }

    return xpForNextLevel - currentXp;
};

/**
 * Calculates the percentage progress within the current level towards the next level.
 * @param {number} currentXp - The user's current experience points.
 * @returns {number} - Percentage progress (0-100).
 */
export const getLevelProgressPercentage = (currentXp) => {
     if (typeof currentXp !== 'number' || currentXp < 0) return 0;

    const currentLevel = calculateLevel(currentXp);
    const xpForCurrentLevel = getXpForLevel(currentLevel);
    const xpForNextLevel = getXpForLevel(currentLevel + 1);

     // If no XP is needed for the next level (e.g., at max level or issue in thresholds), progress is 100%
    if (getXpToNextLevel(currentXp) <= 0) {
        return 100;
    }


    const xpGainedInCurrentLevel = currentXp - xpForCurrentLevel;
    const xpNeededForLevelUp = xpForNextLevel - xpForCurrentLevel;

    if (xpNeededForLevelUp <= 0) {
        // Avoid division by zero or negative values if thresholds are misconfigured
        return 0;
    }

    const percentage = (xpGainedInCurrentLevel / xpNeededForLevelUp) * 100;

    return Math.max(0, Math.min(100, percentage)); // Ensure result is between 0 and 100
};

// You might add other level-related utilities here, e.g., getLevelTitle, getLevelIcon