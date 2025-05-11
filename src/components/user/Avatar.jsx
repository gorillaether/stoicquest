// src/components/user/Avatar.jsx
import React from 'react';
import './Avatar.css';
import { useUser } from '../../contexts/UserContext'; // Use UserContext

const Avatar = () => {
  const { currentAvatar } = useUser(); // Get current avatar data from context

  // Fallback for cases where currentAvatar might not be loaded yet or is null
  const avatarSrc = currentAvatar?.imageUrl || '/assets/images/avatars/default.png';
  const avatarAlt = currentAvatar?.name || 'User Avatar';

  return (
    <div className="avatar-container">
      {/* User's current NFT avatar display */}
      <img src={avatarSrc} alt={avatarAlt} className="avatar-image" />
    </div>
  );
};

export default Avatar;