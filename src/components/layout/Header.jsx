// src/components/layout/Header.jsx
import React from 'react';
import './Header.css';
import { useUser } from '../../contexts/UserContext'; // Import UserContext
import useGameProgress from '../../hooks/useGameProgress'; // Import the game progress hook
import Avatar from '../user/Avatar'; // Import the Avatar component
import ProgressBar from '../ui/ProgressBar'; // Import ProgressBar component
// import { getXpForNextLevel } from '../../utils/levelUtils'; // Assuming a utility to get XP needed for next level

const Header = () => {
  const { user } = useUser(); // Get user data from context
  const { overallProgress } = useGameProgress(); // Get overall game progress

  // Calculate progress towards the next level (Example)
  // const xpNeededForNextLevel = getXpForNextLevel(user.level);
  // const xpProgressPercentage = xpNeededForNextLevel > 0 ? ((user.xp - getXpForCurrentLevel(user.level)) / xpNeededForNextLevel) * 100 : 0; // Requires getXpForCurrentLevel utility


  return (
    <header className="header-container">
      {/* App title */}
      <div className="game-title">
         <h1>Game Title</h1>
      </div>


      <div className="user-status-section">
        {/* User Avatar, Name, Level */}
        <div className="user-info">
          <Avatar /> {/* Use the Avatar component */}
          <div className="user-details">
             <span className="user-name">{user?.name || 'Guest'}</span> {/* Display user name */}
             <span className="user-level">Level: {user?.level || 1}</span> {/* Display user level */}
          </div>
        </div>

        {/* Overall Game Progress and optionally Next Level Progress */}
        <div className="game-progress-info">
          <div className="overall-progress">
              <span className="progress-label">Overall Progress:</span>
              <ProgressBar percentage={overallProgress} /> {/* Use ProgressBar for overall game progress */}
              <span className="progress-percentage">{overallProgress.toFixed(0)}%</span>
          </div>

           {/* Optional: Progress towards the next level */}
           {/* <div className="next-level-progress">
               <span className="progress-label">Next Level:</span>
               <ProgressBar percentage={xpProgressPercentage} />
               <span className="progress-text">{user.xp} / {user.xp + xpNeededForNextLevel} XP</span>
           </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;