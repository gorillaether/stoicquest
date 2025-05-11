// src/contexts/GameContext.jsx
import React, { createContext, useState, useContext } from 'react';
// useLocalStorage is not needed here as user data is in UserContext
// chapters and achievements data can be imported directly where needed, not stored in context state
// import chapters from '../data/chapters';
// import achievements from '../data/achievements';

// Create the context
export const GameContext = createContext();

/**
 * GameContext provider component that manages state related to the current game session or view.
 * User-specific progression, stats, and inventory are managed in UserContext.
 */
export const GameProvider = ({ children }) => {
  // State to manage the ID of the chapter currently being viewed/played
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [isLoadingGame, setIsLoadingGame] = useState(false); // Example loading state

  // Functions to update game session state
  const selectChapter = (chapterId) => {
      // Potentially set loading state here
      setIsLoadingGame(true);
       // In a real app, you might load chapter data here if not already loaded
       // For now, just update the state and stop loading after a delay
      setCurrentChapterId(chapterId);
       setTimeout(() => setIsLoadingGame(false), 300); // Simulate loading time
  };


  // The progression logic (markSectionCompleted, awardAchievement, etc.)
  // will *not* be defined here. These actions will use the useUser() hook
  // in components or other hooks to update the UserContext directly.

  // Context value that will be provided to components
  const contextValue = {
    currentChapterId,
    selectChapter,
    isLoadingGame,
     // You might expose static game data here if you prefer central access
     // chaptersData: chapters,
     // achievementsData: achievements,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to easily access the GameContext
export const useGame = () => useContext(GameContext);

// Export the context itself for provider usage
export default GameContext;