// src/contexts/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage'; // Import the hook
import { avatars, getAvatarById } from '../data/avatars'; // Import avatars data and helper
import { calculateLevel } from '../utils/levelUtils'; // Import level calculation utility

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useLocalStorage('gameUserData', {
    name: 'Player',
    xp: 0, // Track XP
    level: 1, // Track Level
    currentAvatarId: 'default', // Store the ID of the current avatar (linked to NFT)
    ownedNfts: [], // Array of owned NFT identifiers (could be token IDs, etc.)
    inventory: {
        tokens: 0,
        collectibles: []
    },
    achievements: [],
    progress: {
      chapters: {}
    },
    settings: {
      translationPreference: 'standard'
    }
  });

  // Effect to update level and avatar when XP changes
  useEffect(() => {
    const newLevel = calculateLevel(userData.xp);
    if (newLevel > userData.level) {
      // Level Up!
      const unlockedAvatars = avatars.filter(avatar => avatar.levelRequired <= newLevel && avatar.levelRequired > userData.level);

      setUserData(prevUserData => {
        const updatedOwnedNfts = [...prevUserData.ownedNfts];
        let newAvatarId = prevUserData.currentAvatarId;

        // Assuming the first unlocked avatar at the new level becomes the current
        if (unlockedAvatars.length > 0) {
             // In a real NFT game, you'd likely mint or assign the NFT here
             // For this simulation, we'll just update the currentAvatarId
            newAvatarId = unlockedAvatars[0].id; // Set the first unlocked as current
             if (!updatedOwnedNfts.includes(newAvatarId)) {
                 updatedOwnedNfts.push(newAvatarId); // Add to owned if not already there
             }
             console.log(`Level Up! Reached level ${newLevel}. New avatar unlocked: ${unlockedAvatars[0].name}`);
        } else if (newLevel > prevUserData.level) {
             console.log(`Level Up! Reached level ${newLevel}. No new avatar unlocked at this level.`);
        }


        return {
          ...prevUserData,
          level: newLevel,
          currentAvatarId: newAvatarId,
          ownedNfts: updatedOwnedNfts,
           // Potentially add achievement for leveling up
           // achievements: checkLevelUpAchievements(prevUserData.level, newLevel)
        };
      });
    } else {
         // If level didn't change, just ensure the level is correct based on XP
         setUserData(prevUserData => ({
            ...prevUserData,
            level: newLevel,
         }));
    }
  }, [userData.xp]); // Depend on XP changing

  // Function to update user data with merging for nested objects
  const updateUser = (updates) => {
    setUserData(prevUserData => {
      const newState = { ...prevUserData };

      // Deep merge logic for specific nested objects
      if (updates.progress) {
        newState.progress = {
          ...prevUserData.progress,
          ...updates.progress,
          chapters: {
              ...prevUserData.progress.chapters,
              ...(updates.progress.chapters || {})
          }
        };
        delete updates.progress; // Remove from updates to avoid shallow merge
      }

       if (updates.inventory) {
        newState.inventory = {
          ...prevUserData.inventory,
          ...updates.inventory
        };
        delete updates.inventory;
      }

      if (updates.settings) {
        newState.settings = {
          ...prevUserData.settings,
          ...updates.settings
        };
         delete updates.settings;
      }

      // Shallow merge for remaining top-level properties
      return { ...newState, ...updates };
    });
  };


  // Get the current avatar data
  const currentAvatar = getAvatarById(userData.currentAvatarId);


  return (
    <UserContext.Provider value={{ user: userData, updateUser, currentAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);