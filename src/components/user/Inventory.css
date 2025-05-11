// src/components/user/Inventory.jsx
import React from 'react';
import './Inventory.css';
import { useUser } from '../../contexts/UserContext'; // Import UserContext
import { avatars } from '../../data/avatars'; // Import avatars data to potentially show owned avatar details

/**
 * Displays the user's inventory, including tokens, collectibles, and owned NFT avatars.
 */
const Inventory = () => {
  const { user } = useUser(); // Get user data from context

  // Helper to get avatar details by ID for owned NFTs
  const getAvatarDetails = (avatarId) => {
      return avatars.find(avatar => avatar.id === avatarId);
  }

  return (
    <div className="inventory-container">
      {/* Tokens */}
      <div className="inventory-section">
        <h3 className="inventory-title">Tokens</h3>
        <p className="inventory-tokens">🪙 Tokens: {user?.inventory?.tokens || 0}</p> {/* Display token count */}
      </div>

      {/* Collectibles */}
      <div className="inventory-section">
        <h3 className="inventory-title">Collectibles</h3>
        {user?.inventory?.collectibles && user.inventory.collectibles.length > 0 ? (
          <ul className="inventory-list collectibles-list">
            {user.inventory.collectibles.map((collectible, index) => (
              <li key={index} className="inventory-item collectible-item">
                {/* Display collectible details - adjust based on collectible data structure */}
                <span>✨ {collectible.name || `Collectible ${index + 1}`}</span>
                {/* Add more details if available, e.g., quantity, description */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="inventory-empty">No collectibles found yet.</p>
        )}
      </div>

      {/* Owned NFT Avatars */}
       <div className="inventory-section">
        <h3 className="inventory-title">Owned Avatars (NFTs)</h3>
        {user?.ownedNfts && user.ownedNfts.length > 0 ? (
          <ul className="inventory-list owned-nfts-list">
            {user.ownedNfts.map((avatarId) => {
                const avatar = getAvatarDetails(avatarId); // Get avatar details
                return avatar ? (
                     <li key={avatar.id} className="inventory-item owned-nft-item">
                       {/* Display owned NFT avatar details */}
                       <img src={avatar.imageUrl} alt={avatar.name} className="owned-nft-thumbnail" />
                       <span>{avatar.name} (Level {avatar.levelRequired})</span> {/* Show name and required level */}
                       {/* In a real app, you might link to the NFT on a marketplace */}
                       {/* <a href={`[Link to Marketplace]/token/${avatar.id}`} target="_blank" rel="noopener noreferrer">View NFT</a> */}
                     </li>
                ) : (
                     <li key={avatarId} className="inventory-item owned-nft-item">
                         <span>Unknown Avatar (ID: {avatarId})</span> {/* Handle cases where avatar data is missing */}
                     </li>
                );
            })}
          </ul>
        ) : (
          <p className="inventory-empty">No NFT avatars collected yet.</p>
        )}
      </div>

    </div>
  );
};

export default Inventory;