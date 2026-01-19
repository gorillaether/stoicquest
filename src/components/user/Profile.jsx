// src/components/user/Profile.jsx
import React from 'react';
import './Profile.css'; // Ensure this CSS file exists
import Avatar from './Avatar'; // Component to display the avatar image
import Inventory from './Inventory'; // Component to display inventory
import Card from '../ui/Card'; // Card wrapper component
import { useUser } from '../../contexts/UserContext'; // Import the useUser hook
import avatars from '../../data/avatars'; // Your local avatar data (still used for list/preview)
import MintAvatarButton from './MintAvatarButton'; // Button to trigger minting
import { AvatarStages } from '../../contractConfig'; // Import AvatarStages

const Profile = () => {
  const {
    user, // User data from localStorage
    currentAvatar, // Avatar data determined by UserContext based on NFT ownership
    loading: userContextLoading, // Overall loading state from UserContext
    walletAddress, // Connected wallet address
    isCorrectNetwork, // Whether the wallet is on the correct network
    ownsApprenticeNft, // NEW: Whether the user owns the Apprentice NFT (from blockchain check)
    isLoadingNftBalance, // NEW: Whether the NFT balance is currently being loaded
    activeNetwork, // <-- ADDED: Get activeNetwork config from UserContext
    // You might need signer here if MintAvatarButton doesn't get it via context/prop
    // signer,
  } = useUser(); // Use the user context hook

  // Determine if the Novice avatar is locally marked as owned (consider if this should also be an on-chain check)
  // For now, keeping the local check for the Novice button logic as it was.
  const hasNoviceLocally = user?.ownedNfts?.includes('novice');

  // Condition to show the "Mint Novice Avatar" button
  // Show if wallet connected, user data loaded, and locally marked as NOT having Novice
  const showMintNoviceButton = walletAddress && user && !hasNoviceLocally;

  // Condition to show the "Mint Apprentice Avatar" button
  // Show if wallet connected, user data loaded, on correct network, owns Novice locally (as prerequisite?),
  // AND does NOT own Apprentice NFT on-chain.
  // NOTE: Relying on `hasNoviceLocally` for a blockchain action prerequisite might be inconsistent.
  // A better approach would be to check Novice NFT ownership on-chain too.
  const showMintApprenticeButton = walletAddress && user && isCorrectNetwork && hasNoviceLocally && !ownsApprenticeNft;


  // Determine the next avatar for preview (still based on local level/data for preview purposes)
  const nextAvatar = avatars
    ?.filter(avatar => avatar.requiredLevel > (user?.level || 0))
    .sort((a, b) => a.requiredLevel - b.requiredLevel)[0];

  // --- Refined Loading State ---
  // Show loading if userContext is generally loading OR if wallet is connected but NFT balance is still loading
  if (userContextLoading || (walletAddress && isLoadingNftBalance)) { // Ensure walletAddress check for isLoadingNftBalance relevance
    return (
      <Card className="profile-container">
        <h2 className="profile-title">Loading Profile Data...</h2>
        {walletAddress && isLoadingNftBalance && <p>Checking NFT ownership...</p>} {/* More specific message */}
      </Card>
    );
  }

  // --- Handle Disconnected or Wrong Network State ---
  // If wallet not connected OR connected but on the wrong network, display a message
  if (!walletAddress || (walletAddress && !isCorrectNetwork)) {
    return (
      <Card className="profile-container">
        <h2 className="profile-title">Wallet Status</h2>
        {!walletAddress && <p>Please connect your wallet to view your profile and avatars.</p>}
        {walletAddress && !isCorrectNetwork && activeNetwork && ( // <-- Check if activeNetwork exists before using its properties
            <p>You are connected with wallet **{walletAddress.substring(0,6)}...** but on the wrong network. Please switch to the **{activeNetwork.networkName}** network.</p>
        )}
         {/* You could add a button here to trigger connectUserWallet or attemptSwitchToTargetNetwork from context */}
      </Card>
    );
  }


  // --- Main Render when loaded, connected, and on correct network ---
  // Also ensure activeNetwork is available if used below
  if (!activeNetwork) { // Fallback if activeNetwork somehow isn't loaded yet, though unlikely if other states are fine
      return (
          <Card className="profile-container">
              <h2 className="profile-title">Loading Configuration...</h2>
          </Card>
      );
  }

  return (
    <Card className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      <div className="profile-header">
        {/* Avatar component automatically uses currentAvatar from context */}
        <Avatar currentAvatar={currentAvatar} />
        <div className="profile-basic-info">
          {/* Use user?. for safe access in case user data is still populating immediately after wallet connect */}
          <p><strong>Username:</strong> {user?.name || 'Connected User'}</p>
          <p><strong>Wallet:</strong> {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}</p> {/* Display truncated address */}
          <p><strong>Level:</strong> {user?.level || 1}</p>
          <p><strong>Total XP:</strong> {user?.xp || 0}</p>
          {/* Display status based on NFT ownership check */}
          <p><strong>Current Status:</strong> {ownsApprenticeNft ? 'Apprentice' : 'Novice'}</p>
        </div>
      </div>

      {/* Inventory section (still uses local user data) */}
      {user && <Inventory tokens={user.inventory?.tokens} collectibles={user.inventory?.collectibles} ownedNfts={user.ownedNfts} />}

      <div className="profile-avatars-section">
        <h3 className="profile-section-title">Mint Your Stoic Avatars (on {activeNetwork.networkName})</h3>

        {/* Conditional rendering for Mint buttons */}
        {/* Only show minting section if wallet connected, user data available, AND on correct network */}
        {walletAddress && user && isCorrectNetwork ? (
          <>
            {/* Show Novice Mint button based on local state (consider changing to on-chain check) */}
            {showMintNoviceButton && (
              <div className="mint-section" style={{ marginBottom: '20px', padding: '15px', border: '1px dashed #ccc', borderRadius: '5px' }}>
                <p>Begin your journey: The path of the Novice awaits.</p>
                <MintAvatarButton
                  stageToMint={AvatarStages.Novice}
                  buttonLabel="Mint My Novice Avatar"
                   // Pass wallet connection state if button component needs it
                   walletAddress={walletAddress}
                   isCorrectNetwork={isCorrectNetwork}
                   // Maybe pass signer or provider if MintAvatarButton handles the call
                   // signer={signer}
                />
              </div>
            )}

            {/* Show Apprentice Mint button ONLY if user does NOT own Apprentice NFT on-chain */}
            {!ownsApprenticeNft && showMintApprenticeButton && ( // Keep showMintApprenticeButton logic (includes local novice & level?) but primary gate is !ownsApprenticeNft
               <div className="mint-section" style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', border: '1px dashed #ccc', borderRadius: '5px' }}>
                <p>Continue your training: Embrace the Apprentice stage.</p>
                <MintAvatarButton
                  stageToMint={AvatarStages.Apprentice}
                  buttonLabel="Mint My Apprentice Avatar"
                  walletAddress={walletAddress}
                  isCorrectNetwork={isCorrectNetwork}
                   // signer={signer}
                />
              </div>
            )}

            {/* Message if Apprentice is owned (assuming Novice was a prerequisite) */}
            {ownsApprenticeNft && (
                <p className="profile-empty-state">You have attained the Apprentice stage!</p>
                // You might add messages for higher stages if you add them
            )}

             {/* Consider edge cases: What if wallet is connected, but user data hasn't loaded yet?
                 The initial loading state handles this. */}
             {/* What if user owns Novice on-chain, but not locally? The current logic might show Novice mint button.
                 You might need to add an on-chain Novice check to UserContext as well for consistency. */}
          </>
        ) : (
          // Message shown if wallet not connected or user data not loaded (handled by initial checks now)
           null // This case is now handled by the explicit checks at the top
        )}

         {/* --- Your Avatar Collection (Locally Tracked) --- */}
         {/* NOTE: This section still displays avatars based on the 'ownedNfts' list
             stored in localStorage ('userData'). This list is separate from the
             on-chain NFT ownership check used for the 'Current Status' and Mint button logic.
             To make this list reflect actual owned NFTs, you would need to:
             1. Fetch all owned token IDs from the contract using a function like `tokenOfOwnerByIndex`
                (if ERC721 enumerable) or store token IDs when minted.
             2. Add this logic to UserContext or fetch it here and store in component state.
             3. Map the owned token IDs to your local avatar data (`avatars`).
         */}
        <h3 className="profile-section-title" style={{marginTop: '30px'}}>Your Avatar Collection (Locally Tracked)</h3>
        {user?.ownedNfts && Array.isArray(user.ownedNfts) && user.ownedNfts.length > 0 ? (
          <ul className="owned-avatars-list">
            {user.ownedNfts.map(avatarId => {
              const avatar = avatars?.find(a => a.id === avatarId);
              // Use local imageUrl if available, otherwise fallback
              const avatarImageUrl = avatar ? (avatar.imageUrl || avatar.imagePath) : null;
              return avatar ? (
                <li key={avatar.id} className="owned-avatar-item">
                  {avatarImageUrl && <img src={avatarImageUrl} alt={avatar.name} className="owned-avatar-thumbnail" />}
                  <span>{avatar.name} (Level {avatar.requiredLevel})</span>
                </li>
              ) : (
                <li key={avatarId} className="owned-avatar-item">
                  <span>Unknown Avatar (ID: {avatarId})</span>
                </li>
              );
            })}
          </ul>
        ) : (
           // Show this if wallet connected and user data loaded, but local ownedNfts is empty
           walletAddress && user && <p className="profile-empty-state">No avatars currently in your locally tracked collection.</p>
        )}


        {/* Next Avatar Preview (still based on local level/data) */}
        {user && nextAvatar && (
          <div className="next-avatar-preview">
             <h3 className="profile-section-title" style={{marginTop: '30px'}}>Next Avatar to Unlock</h3>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={nextAvatar.imagePath || nextAvatar.imageUrl} alt={`${nextAvatar.name} Preview`} className="next-avatar-thumbnail" style={{ marginRight: '15px', width: '50px', height: '50px', borderRadius: '50%' }} />
                  <div>
                     <p>The **{nextAvatar.name}** avatar unlocks at Level **{nextAvatar.requiredLevel}**.</p>
                  </div>
              </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Profile;