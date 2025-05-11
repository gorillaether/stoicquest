import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star } from 'lucide-react';

/**
 * Achievement component that displays notifications when a user unlocks an achievement
 * @param {Object} props
 * @param {Object} props.achievement - Achievement data object
 * @param {string} props.achievement.id - Unique identifier
 * @param {string} props.achievement.title - Achievement title
 * @param {string} props.achievement.description - Achievement description
 * @param {string} props.achievement.type - Achievement type (e.g., 'milestone', 'special', 'hidden')
 * @param {number} props.achievement.points - Points awarded for this achievement
 * @param {boolean} props.achievement.rare - Whether this is a rare achievement
 * @param {boolean} props.isNew - Whether this achievement was just unlocked
 * @param {function} props.onDismiss - Function to call when dismissing the notification
 */
const Achievement = ({ achievement, isNew = false, onDismiss }) => {
  const [visible, setVisible] = useState(isNew);
  const [animateOut, setAnimateOut] = useState(false);
  
  // Auto-dismiss the notification after 5 seconds if it's a new achievement
  useEffect(() => {
    let timer;
    if (isNew) {
      timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isNew]);
  
  // Handle the dismissal animation
  const handleDismiss = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, 500); // Animation duration
  };
  
  // If not visible, don't render anything
  if (!visible) return null;
  
  // Determine the icon based on achievement type
  const renderIcon = () => {
    switch (achievement.type) {
      case 'milestone':
        return <Trophy className="w-10 h-10 text-yellow-500" />;
      case 'special':
        return <Star className="w-10 h-10 text-blue-500" />;
      default:
        return <Award className="w-10 h-10 text-purple-500" />;
    }
  };
  
  // Animation classes
  const animationClass = animateOut 
    ? 'animate-slide-out-right' 
    : 'animate-slide-in-right';
  
  return (
    <div className={`fixed top-20 right-4 z-50 ${animationClass}`}>
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-yellow-500 p-4 w-72 flex items-start">
        <div className="mr-4 flex-shrink-0">
          {renderIcon()}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800">{achievement.title}</h3>
            <button 
              onClick={handleDismiss} 
              className="text-gray-400 hover:text-gray-600"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              +{achievement.points} points
            </span>
            
            {achievement.rare && (
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Rare!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Static component function to display achievements in profile view
Achievement.Badge = function AchievementBadge({ achievement, unlocked = false }) {
  return (
    <div 
      className={`border rounded-lg p-3 ${
        unlocked 
          ? 'bg-white shadow-sm' 
          : 'bg-gray-100 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {unlocked ? (
            achievement.type === 'milestone' ? (
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            ) : achievement.type === 'special' ? (
              <Star className="w-5 h-5 text-blue-500 mr-2" />
            ) : (
              <Award className="w-5 h-5 text-purple-500 mr-2" />
            )
          ) : (
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-2" />
          )}
          <h4 className={`font-medium ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
            {unlocked ? achievement.title : 'Locked Achievement'}
          </h4>
        </div>
        
        {achievement.rare && unlocked && (
          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Rare
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600">
        {unlocked ? achievement.description : 'Continue your journey to unlock this achievement.'}
      </p>
      
      {unlocked && (
        <div className="mt-2 text-xs font-medium text-yellow-800">
          +{achievement.points} points
        </div>
      )}
    </div>
  );
};

export default Achievement;