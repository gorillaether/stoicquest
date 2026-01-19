// src/components/layout/Sidebar.jsx
import React from 'react';
import './Sidebar.css';
// FIX: Import the getAllChapters function instead of trying to import 'chapters' directly
import { getAllChapters } from '../../data/chapters';
import { useUser } from '../../contexts/UserContext'; // Import UserContext

/**
 * Sidebar component for navigation and chapter selection.
 * @param {Object} props
 * @param {function} props.onChapterSelect - Callback function when a chapter is selected. Receives the chapter ID.
 * @param {string} props.currentChapterId - The ID of the currently active chapter.
 */
const Sidebar = ({ onChapterSelect, currentChapterId }) => {
   const { user } = useUser(); // Get user data to check level for locked chapters

  // Get the list of all chapters using the exported function
  const allChapters = getAllChapters();

  return (
    <aside className="sidebar-container">
      <h2>Chapters</h2>
      <nav className="sidebar-nav">
        <ul>
          {/* Use the result of getAllChapters().map instead of chapters.map */}
          {allChapters.map((chapter) => {
            // Determine if the chapter is unlocked (Example: based on level or previous completion)
            // Assuming chapters in your data have a 'requiredLevel' property
            const isUnlocked = user.level >= (chapter.requiredLevel || 1); // Use requiredLevel consistent with avatars.js

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