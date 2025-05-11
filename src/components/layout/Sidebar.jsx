// src/components/layout/Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import { chapters } from '../../data/chapters'; // Import chapters data
import { useUser } from '../../contexts/UserContext'; // Import UserContext (if locking chapters by level)

/**
 * Sidebar component for navigation and chapter selection.
 * @param {Object} props
 * @param {function} props.onChapterSelect - Callback function when a chapter is selected. Receives the chapter ID.
 * @param {string} props.currentChapterId - The ID of the currently active chapter.
 */
const Sidebar = ({ onChapterSelect, currentChapterId }) => {
   const { user } = useUser(); // Get user data to check level for locked chapters

  return (
    <aside className="sidebar-container">
      <h2>Chapters</h2>
      <nav className="sidebar-nav">
        <ul>
          {chapters.map((chapter) => {
            // Determine if the chapter is unlocked (Example: based on level or previous completion)
            const isUnlocked = user.level >= (chapter.levelRequired || 1); // Assuming chapters have a levelRequired property

            return (
              <li
                key={chapter.id}
                className={`sidebar-chapter-item ${
                  chapter.id === currentChapterId ? 'sidebar-chapter-active' : ''
                } ${isUnlocked ? '' : 'sidebar-chapter-locked'}`}
                onClick={() => isUnlocked && onChapterSelect(chapter.id)} // Only allow selection if unlocked
              >
                {chapter.title}
                {!isUnlocked && <span className="sidebar-lock-icon">🔒</span>} {/* Optional lock icon */}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;