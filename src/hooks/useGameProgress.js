// src/hooks/useGameProgress.js // <-- This is the file name the error is in
// Custom hook for managing user progression state via UserContext

import { useContext, useCallback, useEffect } from 'react'; // Added useEffect
import { useUser } from '../contexts/UserContext'; // Import useUser hook
// GameContext is not directly needed for updating user state, but could be used to get current chapter ID if needed
// import { useGame } from '../contexts/GameContext';
import { calculateLevel } from '../utils/levelUtils'; // Import level calculation utility
import { getChapterById } from '../data/chapters'; // Import to check chapter structure for section completion

/**
 * Custom hook to manage and update user-specific progression data
 * stored in UserContext.
 * @returns {Object} - Methods for updating and tracking user progress.
 */
const useGameProgress = () => { // <-- The hook function name
  const { user, updateUser } = useUser(); // Get user state and updater from UserContext
  // const { currentChapterId } = useGame(); // Example: If needed to get the current chapter ID

  /**
   * Marks a section within a chapter as completed/read.
   * @param {string} chapterId - The ID of the chapter.
   * @param {string} sectionId - The ID of the section.
   */
  const completeSection = useCallback((chapterId, sectionId) => {
    // Get the current progress for the chapter, or initialize it
    const chapterProgress = user.progress?.chapters?.[chapterId] || {
        isUnlocked: false, // Should be unlocked to complete sections, but initialize defensively
        isStarted: true,
        isCompleted: false,
        completedSections: [],
        challengeCompletions: {}, // Use challengeCompletions object
        reflections: {},
        lastVisited: new Date().toISOString()
    };

    // Check if the section is already completed
    const isSectionAlreadyCompleted = chapterProgress.completedSections.includes(sectionId);

    let xpEarned = 0;
    let updatedCompletedSections = [...chapterProgress.completedSections];
    let isChapterCompleted = chapterProgress.isCompleted;

    if (!isSectionAlreadyCompleted) {
        updatedCompletedSections.push(sectionId);
        xpEarned += 5; // Example: Award XP for completing a section

        // Optional: Check if all sections in the chapter are now completed
        const chapterData = getChapterById(chapterId);
        if (chapterData && updatedCompletedSections.length === chapterData.sections.length) {
             isChapterCompleted = true; // Mark chapter as completed if all sections are done
             xpEarned += 20; // Example: Bonus XP for completing all sections in a chapter
              // Logic to unlock the next chapter could be triggered here or elsewhere
              // based on chapter completion.
        }
    }

     // Update user state via updateUser
     updateUser({
        xp: user.xp + xpEarned, // Add earned XP
        progress: {
            ...user.progress,
            chapters: {
                ...user.progress?.chapters,
                [chapterId]: {
                    ...chapterProgress,
                    completedSections: updatedCompletedSections,
                    isCompleted: isChapterCompleted,
                    lastVisited: new Date().toISOString() // Update last visited time
                }
            }
        }
     });

     // Note: Achievement checks should ideally happen AFTER user state is updated
     // An effect in UserContext watching relevant stats or a separate hook could do this.

     // Return results for immediate feedback if needed
     return { xpEarned, isChapterCompleted: isChapterCompleted };

  }, [user, updateUser]); // Depend on user and updateUser


  /**
   * Marks a challenge within a chapter as completed.
   * @param {string} chapterId - The ID of the chapter.
   * @param {string} challengeId - The ID of the challenge.
   * @param {number} [score=100] - Optional score achieved (0-100).
   * @param {any} [details] - Optional details about the challenge completion (e.g., answers).
   */
  const completeChallenge = useCallback((chapterId, challengeId, score = 100, details = null) => {
    // Get the current progress for the chapter, or initialize it
     const chapterProgress = user.progress?.chapters?.[chapterId] || {
        isUnlocked: false,
        isStarted: true,
        isCompleted: false,
        completedSections: [],
        challengeCompletions: {},
        reflections: {},
        lastVisited: new Date().toISOString()
    };

    // Check if the challenge has been completed before for scoring/XP
    const challengeKey = challengeId; // Use challenge ID directly as key
    const hasCompletedBefore = chapterProgress.challengeCompletions[challengeKey] !== undefined;

    let xpEarned = 0;
    let updatedChallengeCompletions = { ...chapterProgress.challengeCompletions };
    let totalChallengesCompletedCount = user.challengesCompleted || 0; // Get overall count

    // Only award base XP for the first successful completion
    if (!hasCompletedBefore) {
       // Example: Award XP based on a base value or challenge data (need to fetch challenge data)
       // For now, use a fixed value or base it on score as in original hook
        xpEarned += Math.round(30 * (score / 100)); // Example base XP 30

        // Increment the overall count of completed challenges
        totalChallengesCompletedCount += 1;
    } else {
        // If re-completing, perhaps award a smaller amount of XP or none
         // xpEarned += Math.round(10 * (score / 100)); // Example: smaller XP for re-completion
    }

    // Store completion details (always update with the latest completion details)
    updatedChallengeCompletions[challengeKey] = {
        completedAt: new Date().toISOString(),
        score: score,
        details: details
    };

    // Update user state via updateUser
     updateUser({
        xp: user.xp + xpEarned, // Add earned XP
        challengesCompleted: totalChallengesCompletedCount, // Update overall count
        progress: {
            ...user.progress,
            chapters: {
                ...user.progress?.chapters,
                [chapterId]: {
                    ...chapterProgress,
                    challengeCompletions: updatedChallengeCompletions,
                    lastVisited: new Date().toISOString() // Update last visited time
                }
            }
        },
        // Streak update logic would also be here or in a separate daily check
        // lastLogin and streak updates are in UserContext's useEffect based on lastLogin
     });

     // Note: Achievement checks should ideally happen AFTER user state is updated.
     // E.g., check for streak achievement, total challenges completed achievement,
     // chapter completion achievement (if completing all challenges completes chapter).

     // Return results for immediate feedback if needed
     return { xpEarned, isFirstCompletion: !hasCompletedBefore };

  }, [user, updateUser]); // Depend on user and updateUser


  /**
   * Saves a user's reflection for a specific chapter/section.
   * @param {string} chapterId - The ID of the chapter.
   * @param {string} reflectionId - A unique ID for the reflection (e.g., section ID or challenge ID).
   * @param {string} content - The reflection text content.
   */
  const saveReflection = useCallback((chapterId, reflectionId, content) => {
     // Get the current progress for the chapter, or initialize it
     const chapterProgress = user.progress?.chapters?.[chapterId] || {
        isUnlocked: false,
        isStarted: true,
        isCompleted: false,
        completedSections: [],
        challengeCompletions: {},
        reflections: {},
        lastVisited: new Date().toISOString()
    };

    const reflectionKey = reflectionId; // Use reflection ID as key
    const hasReflectedBefore = chapterProgress.reflections[reflectionKey] !== undefined;

    let xpEarned = 0;
    let updatedReflections = { ...chapterProgress.reflections };
    let totalReflectionsWrittenCount = user.reflectionsWritten || 0; // Get overall count


    // Award XP only for the first time saving a reflection for this ID
    if (!hasReflectedBefore) {
        xpEarned += 10; // Example: Award XP for a new reflection
        totalReflectionsWrittenCount += 1; // Increment overall count
    } else {
        // Optional: Award a tiny bit of XP for updating a reflection?
        // xpEarned += 1; // Example: Small XP for updates
    }

     // Store the reflection content and timestamp (always update with the latest)
    updatedReflections[reflectionKey] = {
        content: content,
        timestamp: new Date().toISOString()
    };


     // Update user state via updateUser
     updateUser({
        xp: user.xp + xpEarned, // Add earned XP
        reflectionsWritten: totalReflectionsWrittenCount, // Update overall count
        progress: {
            ...user.progress,
            chapters: {
                ...user.progress?.chapters,
                [chapterId]: {
                    ...chapterProgress,
                    reflections: updatedReflections,
                     lastVisited: new Date().toISOString() // Update last visited time
                }
            }
        },
        // Streak update logic might consider reflections too, depends on game design
     });

     // Note: Achievement checks (e.g., total reflections, reflection streak)
     // should ideally happen AFTER user state is updated.

     // Return results for immediate feedback if needed
     return { xpEarned, isFirstReflection: !hasReflectedBefore };

  }, [user, updateUser]); // Depend on user and updateUser


   /**
    * Unlocks a specific chapter for the user.
    * @param {string} chapterId - The ID of the chapter to unlock.
    */
   const unlockChapter = useCallback((chapterId) => {
       // Check if the chapter exists in the user's progress and is not already unlocked
       const chapterProgress = user.progress?.chapters?.[chapterId];

       if (chapterProgress && !chapterProgress.isUnlocked) {
           updateUser({
               progress: {
                   ...user.progress,
                   chapters: {
                       ...user.progress?.chapters,
                       [chapterId]: {
                           ...chapterProgress,
                           isUnlocked: true,
                           unlockedAt: new Date().toISOString() // Record unlock time
                       }
                   }
               }
           });
           console.log(`Chapter unlocked: ${chapterId}`);
            // Optional: Trigger achievement for unlocking chapters count
       } else if (!chapterProgress) {
            console.warn(`Attempted to unlock chapter ${chapterId}, but it was not found in user progress. Initializing it.`);
            // Initialize chapter progress if it doesn't exist (e.g., for first chapter unlock)
             updateUser({
               progress: {
                   ...user.progress,
                   chapters: {
                       ...user.progress?.chapters,
                       [chapterId]: {
                           isUnlocked: true,
                           isStarted: false,
                           isCompleted: false,
                           completedSections: [],
                           challengeCompletions: {},
                           reflections: {},
                           lastVisited: null,
                           unlockedAt: new Date().toISOString()
                       }
                   }
               }
           });
            console.log(`Chapter unlocked and initialized: ${chapterId}`);
       } else {
           console.log(`Chapter ${chapterId} is already unlocked.`);
       }
   }, [user, updateUser]);


  /**
   * Checks if a section within a chapter has been completed.
   * @param {string} chapterId - The ID of the chapter.
   * @param {string} sectionId - The ID of the section.
   * @returns {boolean} - True if the section is completed, false otherwise.
   */
  const isSectionCompleted = useCallback((chapterId, sectionId) => {
    return user.progress?.chapters?.[chapterId]?.completedSections?.includes(sectionId) || false;
  }, [user.progress]);


  /**
   * Checks if a challenge within a chapter has been completed.
   * @param {string} chapterId - The ID of the chapter.
   * @param {string} challengeId - The ID of the challenge.
   * @returns {boolean} - True if the challenge has been completed, false otherwise.
   */
  const isChallengeCompleted = useCallback((chapterId, challengeId) => {
    return user.progress?.chapters?.[chapterId]?.challengeCompletions?.[challengeId] !== undefined || false;
  }, [user.progress]);

   /**
    * Gets the completion details for a challenge.
    * @param {string} chapterId - The ID of the chapter.
    * @param {string} challengeId - The ID of the challenge.
    * @returns {Object|null} - Completion details object or null if not completed.
    */
   const getChallengeCompletionDetails = useCallback((chapterId, challengeId) => {
       return user.progress?.chapters?.[chapterId]?.challengeCompletions?.[challengeId] || null;
   }, [user.progress]);


  /**
   * Gets the user's reflection for a specific ID.
   * @param {string} chapterId - The ID of the chapter the reflection is associated with.
   * @param {string} reflectionId - The unique ID for the reflection (e.g., section ID or challenge ID).
   * @returns {Object|null} - Reflection data object (with text and timestamp) or null if not saved.
   */
  const getReflection = useCallback((chapterId, reflectionId) => {
     return user.progress?.chapters?.[chapterId]?.reflections?.[reflectionId] || null;
  }, [user.progress]);

  /**
   * Gets the user's progress data for a specific chapter.
   * @param {string} chapterId - The ID of the chapter.
   * @returns {Object} - Chapter progress object or a default uninitiated object.
   */
  const getChapterProgress = useCallback((chapterId) => {
    return user.progress?.chapters?.[chapterId] || {
      isUnlocked: false,
      isStarted: false,
      isCompleted: false,
      completedSections: [],
      challengeCompletions: {},
      reflections: {},
      lastVisited: null
    };
  }, [user.progress]);

  /**
   * Gets overall game progress statistics based on user data.
   * @returns {Object} - Overall progress statistics.
   */
  const getOverallProgress = useCallback(() => {
    const totalChaptersAvailable = Object.keys(user.progress?.chapters || {}).length; // Or get from chapters.js
     const completedChaptersCount = Object.values(user.progress?.chapters || {})
       .filter(chapter => chapter.isCompleted).length;

    // Use the top-level counts from user state
    const totalChallengesCompleted = user.challengesCompleted || 0;
    const totalReflectionsWritten = user.reflectionsWritten || 0;
    const currentStreak = user.streak || 0;


    return {
      completedChaptersCount,
      totalChaptersAvailable, // How many chapters the user's progress object knows about
      totalChallengesCompleted,
      totalReflectionsWritten,
      currentStreak,
      currentLevel: user.level, // Get from user state
      currentXP: user.xp // Get from user state
    };
  }, [user]); // Depend on user state for overall progress


  // Initial check to unlock the first chapter if it's a new user
  useEffect(() => {
      if (user && !user.progress?.chapters?.['1']?.isUnlocked) {
          console.log("Initializing and unlocking first chapter...");
          unlockChapter('1'); // Unlock chapter with ID '1'
      }
  }, [user, unlockChapter]); // Depend on user object and unlockChapter


  return {
    completeSection,
    completeChallenge,
    saveReflection,
    unlockChapter, // Expose unlockChapter if needed elsewhere
    isSectionCompleted,
    isChallengeCompleted,
    getChallengeCompletionDetails,
    getReflection,
    getChapterProgress,
    getOverallProgress,
     // Expose user stats directly if preferred, but using getters or accessing user from useUser() is also fine
     // userStats: { xp: user.xp, level: user.level, streak: user.streak, ... }
  };
};

export default useGameProgress; // <-- Exporting useGameProgress to match the file name