// src/contractConfig.js

// 1. Import the ABI from your StoicAvatarNFT.json file
import ABI_FROM_JSON from './abis/StoicAvatarNFT.json'; // Ensure this path is correct

// 2. Export the ABI (it's the same for the contract on any network)
export const STOIC_AVATAR_NFT_ABI = ABI_FROM_JSON;

// --- Polygon Amoy Testnet Details ---
const AMOY_STOIC_AVATAR_NFT_ADDRESS = "0x6a856c10Cb553D7a2F33E66138940A6B53E32025"; // Your existing Amoy contract address
const AMOY_RPC_URL_CONFIG = "https://polygon-amoy.g.alchemy.com/v2/HW1z4HTOtIDsKBkg1HNgksnJLbMvDRaY";
const AMOY_ALCHEMY_API_KEY_CONFIG = "HW1z4HTOtIDsKBkg1HNgksnJLbMvDRaY"; // Extracted API key for SDK
const AMOY_CHAIN_ID_CONFIG = 80002;
const AMOY_CHAIN_ID_HEX_CONFIG = '0x13882';
const AMOY_NETWORK_NAME_CONFIG = 'Polygon Amoy Testnet';
const AMOY_NATIVE_CURRENCY_NAME_CONFIG = 'MATIC';
const AMOY_NATIVE_CURRENCY_SYMBOL_CONFIG = 'MATIC';
const AMOY_NATIVE_CURRENCY_DECIMALS_CONFIG = 18;
const AMOY_BLOCK_EXPLORER_URL_CONFIG = 'https://amoy.polygonscan.com';
const AMOY_ALCHEMY_SDK_NETWORK_NAME = "polygon-amoy"; // Network name for Alchemy SDK

// --- Polygon Mainnet Details ---
// 🔴 IMPORTANT: Replace with your deployed Polygon Mainnet contract address AFTER deployment
const MAINNET_STOIC_AVATAR_NFT_ADDRESS = "0x924c54f50FF70C0Ab42845F305aF629091AB879e";
// 🔴 IMPORTANT: Replace with your actual Alchemy Polygon Mainnet RPC URL (which includes your API key)
const MAINNET_RPC_URL_CONFIG = "https://polygon-mainnet.g.alchemy.com/v2/LGcc39jQFNudKYZqt9nky";
// 🔴 IMPORTANT: Replace with just your Alchemy Polygon Mainnet API Key (the string after /v2/)
const MAINNET_ALCHEMY_API_KEY_CONFIG = "LGcc39jQFNudKYZqt9nky";
const MAINNET_CHAIN_ID_CONFIG = 137;
const MAINNET_CHAIN_ID_HEX_CONFIG = '0x89';
const MAINNET_NETWORK_NAME_CONFIG = 'Polygon Mainnet';
const MAINNET_NATIVE_CURRENCY_NAME_CONFIG = 'MATIC';
const MAINNET_NATIVE_CURRENCY_SYMBOL_CONFIG = 'MATIC';
const MAINNET_NATIVE_CURRENCY_DECIMALS_CONFIG = 18;
const MAINNET_BLOCK_EXPLORER_URL_CONFIG = 'https://polygonscan.com';
const MAINNET_ALCHEMY_SDK_NETWORK_NAME = "polygon-mainnet"; // Network name for Alchemy SDK


// --- Environment Selector ---
const CURRENT_NETWORK_ENV = import.meta.env.VITE_NETWORK || 'mainnet';

let activeConfig;

if (CURRENT_NETWORK_ENV === 'mainnet') {
    activeConfig = {
        stoicAvatarNftContractAddress: MAINNET_STOIC_AVATAR_NFT_ADDRESS,
        rpcUrl: MAINNET_RPC_URL_CONFIG,
        alchemyApiKey: MAINNET_ALCHEMY_API_KEY_CONFIG, // For Alchemy SDK
        networkForAlchemySdk: MAINNET_ALCHEMY_SDK_NETWORK_NAME, // For Alchemy SDK
        chainId: MAINNET_CHAIN_ID_CONFIG,
        chainIdHex: MAINNET_CHAIN_ID_HEX_CONFIG,
        networkName: MAINNET_NETWORK_NAME_CONFIG,
        nativeCurrency: {
            name: MAINNET_NATIVE_CURRENCY_NAME_CONFIG,
            symbol: MAINNET_NATIVE_CURRENCY_SYMBOL_CONFIG,
            decimals: MAINNET_NATIVE_CURRENCY_DECIMALS_CONFIG,
        },
        blockExplorerUrl: MAINNET_BLOCK_EXPLORER_URL_CONFIG,
    };
} else { // Defaulting to Amoy if not 'mainnet'
    activeConfig = {
        stoicAvatarNftContractAddress: AMOY_STOIC_AVATAR_NFT_ADDRESS,
        rpcUrl: AMOY_RPC_URL_CONFIG,
        alchemyApiKey: AMOY_ALCHEMY_API_KEY_CONFIG, // For Alchemy SDK
        networkForAlchemySdk: AMOY_ALCHEMY_SDK_NETWORK_NAME, // For Alchemy SDK
        chainId: AMOY_CHAIN_ID_CONFIG,
        chainIdHex: AMOY_CHAIN_ID_HEX_CONFIG,
        networkName: AMOY_NETWORK_NAME_CONFIG,
        nativeCurrency: {
            name: AMOY_NATIVE_CURRENCY_NAME_CONFIG,
            symbol: AMOY_NATIVE_CURRENCY_SYMBOL_CONFIG,
            decimals: AMOY_NATIVE_CURRENCY_DECIMALS_CONFIG,
        },
        blockExplorerUrl: AMOY_BLOCK_EXPLORER_URL_CONFIG,
    };
}

// --- Export the Active Configuration ---
export const ACTIVE_NETWORK_CONFIG = activeConfig;

// AvatarStages Enum (matching your Solidity contract)
export const AvatarStages = {
    Novice: 0,
    Apprentice: 1,
    Practitioner: 2,
    Scholar: 3,
    Sage: 4,
    Epictetus: 5
};