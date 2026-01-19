// src/components/user/MintAvatarButton.jsx
import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { AvatarStages, ACTIVE_NETWORK_CONFIG } from '../../contractConfig'; // Import activeNetwork for messages

// Ensure this URL is correct and points to your deployed Cloud Function
const REQUEST_MINT_FUNCTION_URL = "https://us-central1-stoic-quest.cloudfunctions.net/requestNftMint";

// Helper function to get the display name of a stage from its enum value
const getStageNameFromEnumValue = (enumValue) => {
    for (const name in AvatarStages) {
        if (AvatarStages[name] === enumValue) {
            return name; // Returns 'Novice', 'Apprentice', 'Practitioner', etc.
        }
    }
    return 'Unknown Stage';
};

// Helper function to call your Cloud Function (similar to logMintRequest in useGameProgress)
async function requestMintViaCloudFunction(walletAddress, stageToMint, stageNameForRequest, reason) {
  if (!walletAddress) {
    console.warn("[MintAvatarButton] No wallet address provided.");
    return { success: false, error: "No wallet address." };
  }
  if (!REQUEST_MINT_FUNCTION_URL || REQUEST_MINT_FUNCTION_URL.includes("YOUR_FUNCTION_URL")) {
    console.error("[MintAvatarButton] REQUEST_MINT_FUNCTION_URL is not defined or is a placeholder!");
    return { success: false, error: "Mint request URL is not configured." };
  }

  try {
    const response = await fetch(REQUEST_MINT_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // The Cloud Function expects stageToMint (number) and stageName (string)
      body: JSON.stringify({
        walletAddress,
        stageToMint, // The enum number
        stageName: stageNameForRequest, // The human-readable name like "Apprentice"
        reason
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error("[MintAvatarButton] Error logging mint request via CF. Status:", response.status, "Response:", responseData);
      return { success: false, error: responseData.message || responseData.error || "Failed to log request." };
    }
    console.log("[MintAvatarButton] Mint request logged successfully via CF:", responseData);
    return { success: true, data: responseData };
  } catch (error) {
    console.error("[MintAvatarButton] Network or other error logging mint request via CF:", error);
    return { success: false, error: error.message || "Network error." };
  }
}

const MintAvatarButton = ({ stageToMint, buttonLabel }) => {
    const { walletAddress, isCorrectNetwork, activeNetwork, user /*, updateUser */ } = useUser(); // updateUser if you add pending state
    const [isRequesting, setIsRequesting] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');

    const stageNameForDisplay = getStageNameFromEnumValue(stageToMint);

    const handleRequestMint = async () => {
        if (!walletAddress) {
            setRequestMessage("Please connect your wallet first.");
            return;
        }
        if (!isCorrectNetwork) {
            setRequestMessage(`Please switch to the ${activeNetwork.networkName} to request a mint.`);
            return;
        }
        if (stageToMint === undefined || stageToMint === null) {
            setRequestMessage("Stage to mint is not specified.");
            console.error("MintAvatarButton: stageToMint prop is missing.");
            return;
        }

        // Optional client-side check: Has this stage already been achieved/requested?
        // This relies on `user.ownedNfts` (localStorage) or a potential `user.pendingRequests`
        const currentStageNameKey = stageNameForDisplay.toLowerCase(); // e.g., 'novice', 'apprentice'
        if (user?.ownedNfts?.includes(currentStageNameKey)) {
             setRequestMessage(`You have already achieved the ${stageNameForDisplay} stage!`);
             return;
        }
        // if (user?.pendingAvatarRequests?.[currentStageNameKey]) { // If you implement pending state
        //      setRequestMessage(`Your request for the ${stageNameForDisplay} stage is already pending.`);
        //      return;
        // }

        setIsRequesting(true);
        setRequestMessage(`Submitting request for ${buttonLabel || stageNameForDisplay}...`);

        const reason = `User requested ${stageNameForDisplay} avatar via profile button.`;
        // Pass the enum number (stageToMint) and the string name (stageNameForDisplay)
        const result = await requestMintViaCloudFunction(walletAddress, stageToMint, stageNameForDisplay, reason);

        if (result.success) {
            setRequestMessage(`✅ Request for ${buttonLabel || stageNameForDisplay} submitted! An admin will process it shortly.`);
            // TODO Optional: Update a local 'pending state' in UserContext so the button might disable or change text
            // e.g., updateUser({ pendingAvatarRequests: { ...user.pendingAvatarRequests, [currentStageNameKey]: true } });
        } else {
            setRequestMessage(`Error: ${result.error || "Could not submit request."}`);
        }
        setIsRequesting(false);
    };

    const networkNameToDisplay = activeNetwork ? activeNetwork.networkName : "the correct network";

    if (!walletAddress) {
        return <p style={{color: '#e6b88a', margin: '10px 0'}}>Please connect your wallet to request an avatar.</p>;
    }
    if (!isCorrectNetwork) {
        return <p style={{color: '#e6b88a', margin: '10px 0'}}>Please switch to the {networkNameToDisplay} to request an avatar.</p>;
    }

    const mintButtonStyle = {
        padding: '12px 20px',
        fontSize: '1.1rem',
        backgroundColor: '#5cb85c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontFamily: "'Cinzel Decorative', cursive",
        margin: '10px 0'
    };

    // More robust check for already owned (relies on currentAvatarId and ownedNfts being accurate)
    // This might be better handled by the logic in Profile.jsx that decides to show the button or not.
    // For simplicity here, we'll primarily rely on the Profile.jsx conditions.
    // However, a quick check against localStorage `ownedNfts` can prevent re-requests for already *locally known* stages.
    const alreadyOwnedLocally = user?.ownedNfts?.includes(stageNameForDisplay.toLowerCase());

    return (
        <div>
            <button
                onClick={handleRequestMint}
                disabled={isRequesting || alreadyOwnedLocally}
                style={{...mintButtonStyle, backgroundColor: (alreadyOwnedLocally && !isRequesting) ? '#aaa' : (isRequesting ? '#f0ad4e' : '#5cb85c') }}
            >
                {isRequesting ? 'Submitting...' : (alreadyOwnedLocally ? `${stageNameForDisplay} Achieved/Pending` : (buttonLabel || `Request ${stageNameForDisplay} Avatar`))}
            </button>
            {requestMessage && <p style={{marginTop: '10px', color: requestMessage.startsWith('✅') ? 'green' : '#c0392b' }}>{requestMessage}</p>}
        </div>
    );
};

export default MintAvatarButton;