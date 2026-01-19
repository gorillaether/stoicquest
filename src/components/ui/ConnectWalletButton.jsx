// src/components/ui/ConnectWalletButton.jsx
import React, { useState, useContext } // useContext is still needed if useUser is not used, but we WILL use useUser
    from 'react';

// 1. Import your useUser hook (ensure the path is correct)
import { useUser } from '../../contexts/UserContext'; // Assuming UserContext.jsx is in src/contexts/

// No need to import ethers or contractConfig constants here directly,
// as UserContext should handle interactions and provide all necessary state.

const ConnectWalletButton = () => {
    // 2. Consume values and functions from UserContext via the useUser hook
    const {
        userAddress,
        isCorrectNetwork,
        connectUserWallet,         // Function from UserContext
        attemptSwitchToAmoyNetwork, // Function from UserContext (for manual switch)
        walletError,               // Error message from UserContext
        isConnectingWallet,        // Loading state from UserContext for connection attempts
        // provider, // You might not need provider directly in this button if actions are in context
        // signer,   // You might not need signer directly in this button if actions are in context
    } = useUser();

    // Local loading state specifically for immediate button click feedback,
    // complements isConnectingWallet from context which might have a slight delay.
    const [isButtonClickedProcessing, setIsButtonClickedProcessing] = useState(false);

    const handleConnect = async () => {
        setIsButtonClickedProcessing(true);
        try {
            await connectUserWallet(); // Call the function from UserContext
        } catch (e) {
            // Errors should ideally be caught and set within connectUserWallet in UserContext,
            // so walletError from context will reflect it.
            console.error("ConnectWalletButton: connectUserWallet action threw an error:", e.message);
        }
        setIsButtonClickedProcessing(false);
    };

    const handleSwitchNetwork = async () => {
        setIsButtonClickedProcessing(true);
        try {
            await attemptSwitchToAmoyNetwork(); // Call the function from UserContext
        } catch (e) {
            console.error("ConnectWalletButton: attemptSwitchToAmoyNetwork action threw an error:", e.message);
        }
        setIsButtonClickedProcessing(false);
    };

    // Determine overall loading state for the button
    const isLoading = isConnectingWallet || isButtonClickedProcessing;

    return (
        <div>
            {userAddress ? (
                <div style={accountDisplayStyle}>
                    Connected: {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                    {!isCorrectNetwork && ( // If connected but not on the correct network
                        <button
                            onClick={handleSwitchNetwork}
                            disabled={isLoading}
                            style={{...buttonStyle, marginLeft: '10px', backgroundColor: '#e74c3c', fontSize: '0.9em'}}
                        >
                            {isLoading ? 'Processing...' : 'Switch to Amoy'}
                        </button>
                    )}
                </div>
            ) : (
                <button onClick={handleConnect} disabled={isLoading} style={buttonStyle}>
                    {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
            )}
            {walletError && <p style={errorStyle}>{walletError}</p>} {/* Display error from UserContext */}
        </div>
    );
};

// Your existing styles (ensure these are defined or imported)
const buttonStyle = {
    padding: '10px 15px',
    fontSize: '1rem',
    backgroundColor: '#a16e2b', // Your bronze color
    color: '#f0f0e0',       // Light text
    border: '2px solid #e6b88a',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: "'Cinzel Decorative', cursive", // Using a theme font
    transition: 'background-color 0.3s ease, border-color 0.3s ease'
};

const accountDisplayStyle = {
    padding: '12px 15px',
    fontSize: '1rem',
    color: '#a16e2b', // Bronze color for text
    fontWeight: 'bold',
    fontFamily: "'Cormorant Garamond', Georgia, serif", // Body text font
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle background
    borderRadius: '5px',
    border: '2px solid transparent'
};

const errorStyle = {
    color: '#c0392b', // A reddish error color
    fontSize: '0.9em',
    marginTop: '8px'
};

export default ConnectWalletButton;