// src/components/ui/ProgressBar.jsx
import React from 'react';
import './ProgressBar.css';

/**
 * Visual progress indicator bar.
 * Displays a fill percentage based on the provided value.
 * @param {Object} props
 * @param {number} props.percentage - The percentage of progress (0-100).
 * @param {string} [props.className] - Optional additional CSS classes for the container.
 */
const ProgressBar = ({ percentage, className = '' }) => {
  // Ensure percentage is between 0 and 100
  const progressWidth = Math.max(0, Math.min(100, percentage));

  return (
    <div className={`progress-bar-container ${className}`}>
      {/* The fill element whose width represents the progress */}
      <div
        className="progress-bar-fill"
        style={{ width: `${progressWidth}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;