// src/components/user/Profile.jsx
import React from 'react';
import './Profile.css';
import Avatar from './Avatar'; // Import the Avatar component
import Inventory from './Inventory';
import Card from '../ui/Card';
import { useUser } from '../../contexts/UserContext'; // Use UserContext
import { avatars } from '../../data/avatars'; // Import all avatars for listing

const Profile = () => {
  const { user, currentAvatar } = useUser(); // Get user and current avatar from context

  // Determine the next avatar the user can unlock
  const nextAvatar = avatars
    .filter(avatar => avatar.levelRequired > user.level)
    .sort((a, b) => a.levelRequired - b.levelRequired)[0]; // Get the next one by level required

  return (
    <Card className="profile-container">
      {/* User profile and stats */}
      <h2 className="profile-title">User Profile</h2>
      <div className="profile-header">
        <Avatar /> {/* Use the Avatar component */}
        <div className="profile-basic-info">
          <p><strong>Username:</strong> {user?.name || 'N/A'}</p>
          <p><strong>Level:</strong> {user?.level || 1}</p>
          <p><strong>Total XP:</strong> {user?.xp || 0}</p>
          {currentAvatar && <p><strong>Current Avatar:</strong> {currentAvatar.name}</p>}
        </div>
      </div>
      <Inventory tokens={user?.inventory?.tokens} collectibles={user?.inventory?.collectibles} />

      <div className="profile-avatars-section">
          <h3 className="profile-section-title">Your Avatars (NFTs)</h3>
          {user?.ownedNfts && user.ownedNfts.length > 0 ? (
              <ul className="owned-avatars-list">
                  {user.ownedNfts.map(avatarId => {
                      const avatar = avatars.find(a => a.id === avatarId);
                      return avatar ? (
                          <li key={avatar.id} className="owned-avatar-item">
                               <img src={avatar.imageUrl} alt={avatar.name} className="owned-avatar-thumbnail" />
                               <span>{avatar.name} (Level {avatar.levelRequired})</span>
                           </li>
                      ) : null;
                  })}
              </ul>
          ) : (
              <p className="profile-empty-state">No avatars collected yet.</p>
          )}

          {nextAvatar && (
              <div className="next-avatar-preview">
                   <h4 className="next-avatar-title">Next Avatar Unlock:</h4>
                   <div className="next-avatar-info">
                        <img src={nextAvatar.imageUrl} alt={nextAvatar.name} className="next-avatar-thumbnail" />
                        <p>{nextAvatar.name} at Level {nextAvatar.levelRequired}</p>
                   </div>
              </div>
          )}
      </div>
    </Card>
  );
};

export default Profile;