// src/components/game/Progress.jsx
import React from 'react';
import './Progress.css';
import ProgressBar from '../ui/ProgressBar';

const Progress = ({ current, total }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="progress-container">
      {/* Visual progress indicators */}
      <h4 className="progress-title">Chapter Progress</h4>
      <ProgressBar percentage={progressPercentage} />
      <p className="progress-text">{current} out of {total} tasks completed</p>
    </div>
  );
};

export default Progress;