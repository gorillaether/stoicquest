// src/hooks/useGameProgress.js

import { useCallback, useEffect } from 'react';
import { useUser } from '../contexts/UserContext'; // Your existing UserContext
import { getChapterById } from '../data/chapters';

// --- Firebase Imports ---
// Ensure this path is correct based on your project structure
import { db, auth } from '../firebase'; // Or '../firebase.js'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Configuration for NFT Mint Request ---
// Replace with your actual deployed Cloud Function URL
const REQUEST_MINT_FUNCTION_URL = "https://us-central1-stoic-quest.cloudfunctions.net/requestNftMint";

// Define Avatar Stages Enum (consistent with your Cloud Function and game logic)
const AVATAR_STAGES_ENUM = {
  Novice: 0,
  Apprentice: 1, // Example: Awarded for completing Chapter 5
  Practitioner: 2,
  Scholar: 3,
  Sage: 4,
  Epictetus: 5,
};

// Helper function to call your Cloud Function
async function logMintRequest(walletAddress, stageToMint, stageName, reason) {
  if (!walletAddress) {
    console.warn("[logMintRequest] No wallet address provided. Cannot log mint request.");
    return { success: false, error: "No wallet address." };
  }
  if (!REQUEST_MINT_FUNCTION_URL) {
    console.error("[logMintRequest] REQUEST_MINT_FUNCTION_URL is not defined!");
    return { success: false, error: "Mint request URL is not configured." };
  }

  try {
    const response = await fetch(REQUEST_MINT_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, stageToMint, stageName, reason }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(
        "[logMintRequest] Error logging mint request. Status:",
        response.status,
        "Response:", responseData
      );
      return { success: false, error: responseData.message || responseData.error || "Failed to log request." };
    }

    console.log("[logMintRequest] Mint request logged successfully:", responseData);
    return { success: true, data: responseData };
  } catch (error) {
    console.error("[logMintRequest] Network or other error logging mint request:", error);
    return { success: false, error: error.message || "Network error." };
  }
}

// Helper function to provide a complete default structure for a chapter's progress
const getDefaultChapterProgressStructure = (chapterId) => ({
  isUnlocked: chapterId === '1',
  isStarted: false,
  isCompleted: false,
  completedSections: [],
  challengeCompletions: {},
  reflections: {}, // This will still be updated locally for optimistic UI / local cache
  lastReadSection: 0,
  lastVisited: null,
  unlockedAt: chapterId === '1' ? new Date().toISOString() : null,
});

const useGameProgress = () => {
  const { user: userDataFromContext, updateUser, walletAddress } = useUser();

  const completeSection = useCallback(async (chapterId, sectionId) => {
    console.log(`[useGameProgress] completeSection called. ChapterID: ${chapterId}, SectionID: ${sectionId}`);
    if (!userDataFromContext || typeof userDataFromContext.progress !== 'object') {
        console.warn("[useGameProgress] userDataFromContext or userDataFromContext.progress not available or not an object in completeSection. Current userDataFromContext:", userDataFromContext);
        return { xpEarned: 0, isChapterCompleted: false };
    }

    const persistedChapterProgress = userDataFromContext.progress?.chapters?.[chapterId];
    let chapterProgress = {
      ...(getDefaultChapterProgressStructure(chapterId)),
      ...(persistedChapterProgress || {}),
      isStarted: true,
      lastVisited: new Date().toISOString(),
    };
    if (chapterId === '1') {
        chapterProgress.isUnlocked = true;
    }

    const isSectionAlreadyCompleted = chapterProgress.completedSections.includes(sectionId);
    let xpEarned = 0;
    let updatedCompletedSections = [...chapterProgress.completedSections];
    let isChapterActuallyCompleted = chapterProgress.isCompleted;

    if (!isSectionAlreadyCompleted) {
        updatedCompletedSections.push(sectionId);
        xpEarned += 5;
        const chapterData = getChapterById(chapterId);
        if (chapterData && updatedCompletedSections.length === chapterData.sections.length) {
             isChapterActuallyCompleted = true;
             xpEarned += 20;
             if (chapterId === '5' && isChapterActuallyCompleted) {
                console.log(`[useGameProgress] Chapter 5 completed! User with wallet ${walletAddress} eligible for Apprentice NFT.`);
                if (walletAddress) {
                    await logMintRequest(
                        walletAddress,
                        AVATAR_STAGES_ENUM.Apprentice,
                        "Apprentice",
                        "Completed Chapter 5: Disturbances of the Mind"
                    );
                } else {
                    console.warn("[useGameProgress] Chapter 5 completed, but no wallet address is currently connected. Cannot request Apprentice NFT mint.");
                }
             }
        }
    }

    const chapterDataForSectionIndex = getChapterById(chapterId);
    const currentSectionIndex = chapterDataForSectionIndex?.sections.findIndex(s => s.id === sectionId) ?? -1;
    if (currentSectionIndex > (chapterProgress.lastReadSection ?? -1)) {
        chapterProgress.lastReadSection = currentSectionIndex;
    }

    if (xpEarned > 0 || !isSectionAlreadyCompleted) {
         updateUser({
            xp: (userDataFromContext.xp || 0) + xpEarned,
            progress: {
                ...userDataFromContext.progress,
                chapters: {
                    ...(userDataFromContext.progress?.chapters),
                    [chapterId]: {
                        ...chapterProgress,
                        completedSections: updatedCompletedSections,
                        isCompleted: isChapterActuallyCompleted,
                    }
                }
            }
         });
    }
     return { xpEarned, isChapterCompleted: isChapterActuallyCompleted };
  }, [userDataFromContext, updateUser, walletAddress]);

  const completeChallenge = useCallback(async (chapterId, challengeId, xpToAward, details = null) => {
    if (!userDataFromContext || typeof userDataFromContext.progress !== 'object') {
        console.warn("[useGameProgress] userDataFromContext or userDataFromContext.progress not available in completeChallenge.");
        return { xpEarned: 0, isFirstCompletion: false };
    }
    const persistedChapterProgress = userDataFromContext.progress?.chapters?.[chapterId];
    let chapterProgress = {
      ...(getDefaultChapterProgressStructure(chapterId)),
      ...(persistedChapterProgress || {}),
      isStarted: true,
      lastVisited: new Date().toISOString(),
    };
    if (chapterId === '1') {
        chapterProgress.isUnlocked = true;
    }

    const challengeKey = challengeId;
    const hasCompletedBefore = chapterProgress.challengeCompletions[challengeKey] !== undefined;
    let xpEarnedThisTime = 0;
    let updatedChallengeCompletions = { ...chapterProgress.challengeCompletions };
    let totalChallengesCompletedCount = userDataFromContext.challengesCompleted || 0;

    if (!hasCompletedBefore) {
        xpEarnedThisTime = xpToAward;
        totalChallengesCompletedCount += 1;
    }
    updatedChallengeCompletions[challengeKey] = {
        completedAt: new Date().toISOString(),
        details: details
    };

    if (xpEarnedThisTime > 0 || !hasCompletedBefore) {
        updateUser({
            xp: (userDataFromContext.xp || 0) + xpEarnedThisTime,
            challengesCompleted: totalChallengesCompletedCount,
            progress: {
                ...userDataFromContext.progress,
                chapters: {
                    ...(userDataFromContext.progress?.chapters),
                    [chapterId]: {
                        ...chapterProgress,
                        challengeCompletions: updatedChallengeCompletions,
                    }
                },
            },
        });
    } else if (hasCompletedBefore && JSON.stringify(details) !== JSON.stringify(chapterProgress.challengeCompletions[challengeKey]?.details)) {
         updateUser({
            progress: {
                ...userDataFromContext.progress,
                chapters: {
                    ...(userDataFromContext.progress?.chapters),
                    [chapterId]: {
                        ...chapterProgress,
                        challengeCompletions: updatedChallengeCompletions,
                    }
                },
            },
        });
    }
    return { xpEarned: xpEarnedThisTime, isFirstCompletion: !hasCompletedBefore };
  }, [userDataFromContext, updateUser, walletAddress]);

  const saveReflection = useCallback(async (chapterId, reflectionId, content) => {
    console.log(`[useGameProgress] saveReflection CALLED. ChapterID: ${chapterId}, ReflectionID (SectionID): ${reflectionId}, Content Length:`, content?.length);

    // --- Firestore Integration for Saving Reflection ---
    const currentUser = auth.currentUser; // Get the currently authenticated Firebase user

    if (!currentUser) {
      console.warn("[useGameProgress] No Firebase user authenticated. Reflection will not be saved to Firestore. User needs to sign in via Firebase Auth.");
    } else {
      // User is authenticated with Firebase, proceed to save to Firestore.
      const reflectionDataForFirestore = {
        // userId: currentUser.uid, // Not strictly needed in document if path is users/{userId}/reflections
        walletAddress: walletAddress || null,
        chapterId: chapterId,
        reflectionSectionId: reflectionId, // This is your existing 'reflectionId' argument
        content: content,
        createdAt: serverTimestamp(),
      };

      try {
        // Path: users/{userId}/reflections/{autoGeneratedId}
        const userReflectionsCollection = collection(db, 'users', currentUser.uid, 'reflections');
        const docRef = await addDoc(userReflectionsCollection, reflectionDataForFirestore);
        console.log(`[useGameProgress] Reflection saved to Firestore for user ${currentUser.uid} with new doc ID: ${docRef.id}`);
      } catch (error) {
        console.error("[useGameProgress] Error saving reflection to Firestore:", error);
        // Potentially provide user feedback about cloud save failure
      }
    }
    // --- END: Firestore Integration ---

    // --- Existing LocalStorage/UserContext update logic (for optimistic UI / local cache) ---
    if (!userDataFromContext || typeof userDataFromContext.progress !== 'object') {
        console.warn("[useGameProgress] userDataFromContext or userDataFromContext.progress not available in saveReflection (local update part).");
        return { xpEarned: 0, isFirstReflection: false };
    }

    const persistedChapterProgress = userDataFromContext.progress?.chapters?.[chapterId];
    let chapterProgress = {
      ...(getDefaultChapterProgressStructure(chapterId)),
      ...(persistedChapterProgress || {}),
      isStarted: true,
      lastVisited: new Date().toISOString(),
    };
    if (chapterId === '1') {
        chapterProgress.isUnlocked = true;
    }

    const reflectionKey = reflectionId;
    const previousReflectionData = chapterProgress.reflections[reflectionKey];
    const hasReflectedBefore = previousReflectionData !== undefined; // Based on local cache
    let xpEarned = 0;
    let updatedReflections = { ...chapterProgress.reflections };
    let totalReflectionsWrittenCount = userDataFromContext.reflectionsWritten || 0;

    if (!hasReflectedBefore) {
        xpEarned += 10; // Award XP for the first reflection (based on local cache)
        totalReflectionsWrittenCount += 1;
    }

    updatedReflections[reflectionKey] = {
        content: content,
        timestamp: new Date().toISOString() // Local timestamp for local cache
    };

    // This updateUser updates your UserContext (likely still localStorage backed)
    if (xpEarned > 0 || !hasReflectedBefore || (hasReflectedBefore && previousReflectionData.content !== content) ) {
        updateUser({
            xp: (userDataFromContext.xp || 0) + xpEarned,
            reflectionsWritten: totalReflectionsWrittenCount,
            progress: {
                ...userDataFromContext.progress,
                chapters: {
                    ...(userDataFromContext.progress?.chapters),
                    [chapterId]: {
                        ...chapterProgress,
                        reflections: updatedReflections, // Update local cache
                    }
                }
            }
        });
        console.log(`[useGameProgress] updateUser (to LocalContext/LocalStorage) called after saveReflection for section ${reflectionId}.`);
    }
    return { xpEarned, isFirstReflection: !hasReflectedBefore };
  }, [userDataFromContext, updateUser, walletAddress]);

  const unlockChapter = useCallback((chapterId) => {
    if (!userDataFromContext || typeof userDataFromContext.progress !== 'object') {
        console.warn("[useGameProgress] userDataFromContext or userDataFromContext.progress not available in unlockChapter.");
        return;
    }
    const currentChapterDataFromApp = getChapterById(chapterId);
    if (!currentChapterDataFromApp) {
        console.error(`[useGameProgress] unlockChapter: No chapter data found for ID ${chapterId}.`);
        return;
    }
    const persistedChapterProgress = userDataFromContext.progress?.chapters?.[chapterId];
    let chapterProgressToUpdate = {
        ...(getDefaultChapterProgressStructure(chapterId)),
        ...(persistedChapterProgress || {}),
    };

    if (!chapterProgressToUpdate.isUnlocked) {
        chapterProgressToUpdate.isUnlocked = true;
        chapterProgressToUpdate.unlockedAt = new Date().toISOString();
        updateUser({
            progress: {
                ...userDataFromContext.progress,
                chapters: {
                    ...(userDataFromContext.progress?.chapters),
                    [chapterId]: chapterProgressToUpdate
                }
            }
        });
    }
  }, [userDataFromContext, updateUser]);

  const isSectionCompleted = useCallback((chapterId, sectionId) => {
    return userDataFromContext?.progress?.chapters?.[chapterId]?.completedSections?.includes(sectionId) || false;
  }, [userDataFromContext]);

  const isChallengeCompleted = useCallback((chapterId, challengeId) => {
    return userDataFromContext?.progress?.chapters?.[chapterId]?.challengeCompletions?.[challengeId] !== undefined || false;
  }, [userDataFromContext]);

  const getChallengeCompletionDetails = useCallback((chapterId, challengeId) => {
    return userDataFromContext?.progress?.chapters?.[chapterId]?.challengeCompletions?.[challengeId] || null;
  }, [userDataFromContext]);

  const getReflection = useCallback((chapterId, reflectionId) => {
    // This still reads from the local UserContext cache.
    // To read the canonical version from Firestore, this function would need to become async
    // and query Firestore, or you would use the new useUserReflections hook for display.
    console.warn("[useGameProgress] getReflection is currently reading from local cache, not Firestore directly.");
    return userDataFromContext?.progress?.chapters?.[chapterId]?.reflections?.[reflectionId] || null;
  }, [userDataFromContext]);

  const getChapterProgress = useCallback((chapterId) => {
    const persistedChapterProgress = userDataFromContext?.progress?.chapters?.[chapterId];
    let fullProgress = {
        ...(getDefaultChapterProgressStructure(chapterId)),
        ...(persistedChapterProgress || {}),
    };
    if (chapterId === '1') {
        fullProgress.isUnlocked = true;
        if (!fullProgress.unlockedAt) {
             fullProgress.unlockedAt = new Date().toISOString();
        }
    }
    return fullProgress;
  }, [userDataFromContext]);

  const getOverallProgress = useCallback(() => {
    const chaptersProgress = userDataFromContext?.progress?.chapters || {};
    const totalChaptersKnownToUser = Object.keys(chaptersProgress).length;
    const completedChaptersCount = Object.values(chaptersProgress).filter(chapter => chapter.isCompleted).length;
    const totalChallengesCompleted = userDataFromContext?.challengesCompleted || 0;
    const totalReflectionsWritten = userDataFromContext?.reflectionsWritten || 0;
    const currentStreak = userDataFromContext?.streak || 0;
    return {
      completedChaptersCount,
      totalChaptersAvailable: totalChaptersKnownToUser, // This might be better sourced from `getChapters().length`
      totalChallengesCompleted,
      totalReflectionsWritten,
      currentStreak,
      currentLevel: userDataFromContext?.level || 1,
      currentXP: userDataFromContext?.xp || 0
    };
  }, [userDataFromContext]);

  useEffect(() => {
      if (userDataFromContext && userDataFromContext.progress) {
          const chapter1Progress = userDataFromContext.progress.chapters?.['1'];
          if (!chapter1Progress || !chapter1Progress.isUnlocked) {
              unlockChapter('1');
          }
      }
  }, [userDataFromContext, unlockChapter]); // unlockChapter is memoized with useCallback

  return {
    completeSection,
    completeChallenge,
    saveReflection,
    unlockChapter,
    isSectionCompleted,
    isChallengeCompleted,
    getChallengeCompletionDetails,
    getReflection,
    getChapterProgress,
    getOverallProgress,
  };
};

export default useGameProgress;