// src/components/layout/Header.jsx
import React from 'react';
import './Header.css'; // Ensure this CSS file exists or remove if not used
import { useUser } from '../../contexts/UserContext';
import useGameProgress from '../../hooks/useGameProgress';
import Avatar from '../user/Avatar';
import ProgressBar from '../ui/ProgressBar';
import { Link } from 'react-router-dom';
import ConnectWalletButton from '../ui/ConnectWalletButton';
import { getLevelProgressPercentage } from '../../utils/levelUtils'; // <-- IMPORT THIS

const Header = () => {
  // console.log("DEBUG: Header.jsx - Rendering. Attempting to call useUser().");
  const contextFromHook = useUser();
  // console.log("DEBUG: Header.jsx - Value RECEIVED from useUser():", contextFromHook);

  if (contextFromHook === undefined) {
    console.error("DEBUG: Header.jsx - CRITICAL - useUser() returned undefined to Header.jsx. CANNOT DESTRUCTURE.");
    // Fallback UI
    return (
        <header className="header-container">
            <div className="game-title">
               <Link to="/"><h1>Stoic Quest</h1></Link>
            </div>
            <nav className="main-nav"> {/* Navigation for fallback */}
              <ul className="nav-list">
                <li className="nav-item"><Link to="/">Home</Link></li>
                <li className="nav-item"><Link to="/game">Game</Link></li>
                <li className="nav-item"><Link to="/profile">Profile</Link></li>
                <li className="nav-item"><Link to="/about">About</Link></li>
              </ul>
            </nav>
             <div className="user-status-section">
                  <span style={{ marginRight: '20px', color: 'red' }}>Error: User Context not loaded!</span>
                  <ConnectWalletButton />
             </div>
        </header>
    );
  }

  const { 
    user, 
    currentAvatar, 
    loading: userLoading, 
    walletAddress: userAddress
  } = contextFromHook; 
  
  // console.log("DEBUG: Header.jsx - Destructuring successful. User from context:", user, "Effective userAddress (from walletAddress):", userAddress);

  const { getOverallProgress } = useGameProgress(); // <-- Get the FUNCTION

  // Call the function to get progress data
  const gameProgressData = getOverallProgress(); 
  
  // Calculate the display percentage using currentXP from gameProgressData and levelUtils
  // Ensure gameProgressData and gameProgressData.currentXP are available
  const displayOverallProgress = gameProgressData && typeof gameProgressData.currentXP === 'number'
    ? getLevelProgressPercentage(gameProgressData.currentXP) 
    : 0;

  const userName = user?.name || 'Guest';
  const userLevel = gameProgressData?.currentLevel || user?.level || 1; // Prefer level from gameProgressData if available

  if (userLoading && !userAddress) { 
      // console.log("DEBUG: Header.jsx - Showing loading state (userLoading true, no userAddress).");
      // Fallback UI for loading state
      return (
          <header className="header-container">
              <div className="game-title">
                 <Link to="/"><h1>Stoic Quest</h1></Link>
              </div>
              <nav className="main-nav"> {/* Navigation for loading state */}
                <ul className="nav-list">
                  <li className="nav-item"><Link to="/">Home</Link></li>
                  <li className="nav-item"><Link to="/game">Game</Link></li>
                  <li className="nav-item"><Link to="/profile">Profile</Link></li>
                  <li className="nav-item"><Link to="/about">About</Link></li>
                </ul>
              </nav>
               <div className="user-status-section">
                    <span style={{ marginRight: '20px' }}>Loading...</span>
                    <ConnectWalletButton />
               </div>
          </header>
      );
  }

  // console.log("DEBUG: Header.jsx - Rendering normal header. User:", userName, "Level:", userLevel, "userAddress:", userAddress, "Progress%:", displayOverallProgress);
  return (
    <header className="header-container">
      <div className="game-title">
         <Link to="/"><h1>Stoic Quest</h1></Link>
      </div>

      <nav className="main-nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">Home</Link></li>
          <li className="nav-item"><Link to="/game">Game</Link></li>
          <li className="nav-item"><Link to="/profile">Profile</Link></li>
          <li className="nav-item"><Link to="/about">About</Link></li>
        </ul>
      </nav>

      <div className="user-status-section">
        {userAddress ? ( 
          <>
            <div className="user-info">
              <Avatar currentAvatar={currentAvatar} />
              <div className="user-details">
                 <span className="user-name">{userName}</span>
                 <span className="user-level">Level: {userLevel}</span>
              </div>
            </div>

            <div className="game-progress-info">
              <div className="overall-progress">
                  <span className="progress-label">Overall Progress:</span>
                  <ProgressBar percentage={displayOverallProgress} />
                  <span className="progress-percentage">{displayOverallProgress.toFixed(0)}%</span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ minWidth: '200px' }}> {/* Placeholder for when no wallet is connected */} </div>
        )}
        
        <ConnectWalletButton />
      </div>
    </header>
  );
};

export default Header;