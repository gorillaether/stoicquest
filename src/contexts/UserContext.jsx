// src/contexts/UserContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { ethers } from 'ethers';
import { Alchemy, Network } from 'alchemy-sdk';
import useLocalStorage from '../hooks/useLocalStorage';
import { getAvatarById } from '../data/avatars';
import { calculateLevel } from '../utils/levelUtils';

import { ACTIVE_NETWORK_CONFIG, STOIC_AVATAR_NFT_ABI, AvatarStages } from '../contractConfig';

// Firebase Imports
import { auth, db } from '../firebase'; // Ensure db is exported from your firebase.js
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import {
  collection,
  query,
  getDocs
} from 'firebase/firestore';

const STOIC_AVATAR_NFT_CONTRACT_ADDRESS = ACTIVE_NETWORK_CONFIG.stoicAvatarNftContractAddress;

const UserContext = createContext(undefined);
console.log("DEBUG: UserContext.jsx - UserContext Initializing. Active Network:", ACTIVE_NETWORK_CONFIG.networkName, "Contract Address:", STOIC_AVATAR_NFT_CONTRACT_ADDRESS);

const getStageNameFromEnum = (enumValue) => {
    for (const name in AvatarStages) {
        if (AvatarStages[name] === enumValue) {
            return name.toLowerCase();
        }
    }
    return 'novice';
};

export const UserProvider = ({ children }) => {
  const initialGameUserData = useMemo(() => ({
    name: 'Player', xp: 0, level: 1, currentAvatarId: 'novice', ownedNfts: ['novice'],
    inventory: { tokens: 0, collectibles: [] },
    achievements: [],
    progress: { chapters: {} },
    settings: { translationPreference: 'standard' }, challengesCompleted: 0, reflectionsWritten: 0,
    streak: 0, lastLogin: null,
    stoicQuestAvatarTokenId: null,
  }), []);

  const [userData, setUserData] = useLocalStorage('gameUserData', initialGameUserData);
  const [isUserDataInitialized, setIsUserDataInitialized] = useState(false);

  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletError, setWalletError] = useState(null);

  const [stoicAvatarNftBalance, setStoicAvatarNftBalance] = useState(0);
  const [isLoadingNftBalance, setIsLoadingNftBalance] = useState(true);
  const [onChainAvatarStage, setOnChainAvatarStage] = useState(null);
  const [isLoadingOnChainAvatarStage, setIsLoadingOnChainAvatarStage] = useState(false);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firebaseAuthLoading, setFirebaseAuthLoading] = useState(true);
  const [isLoadingFirestoreReflections, setIsLoadingFirestoreReflections] = useState(false);

  const backgroundAudioRef = useRef(null);
  const backgroundAudioPath = '/assets/audio/your-looping-audio-file.mp3';

  const alchemyClient = useMemo(() => {
    if (ACTIVE_NETWORK_CONFIG.alchemyApiKey && ACTIVE_NETWORK_CONFIG.networkForAlchemySdk) {
        const settings = {
            apiKey: ACTIVE_NETWORK_CONFIG.alchemyApiKey,
            network: ACTIVE_NETWORK_CONFIG.networkForAlchemySdk === "polygon-mainnet"
                ? Network.MATIC_MAINNET
                : ACTIVE_NETWORK_CONFIG.networkForAlchemySdk === "polygon-amoy"
                    ? Network.MATIC_AMOY
                    : undefined,
        };
        if (!settings.network) {
            console.warn(`DEBUG: UserContext.jsx - Unsupported networkForAlchemySdk: ${ACTIVE_NETWORK_CONFIG.networkForAlchemySdk}. Alchemy client not initialized.`);
            return null;
        }
        console.log("DEBUG: UserContext.jsx - Initializing Alchemy SDK with network:", settings.network, "API Key set:", !!settings.apiKey);
        return new Alchemy(settings);
    }
    console.warn("DEBUG: UserContext.jsx - Alchemy API Key or Network for SDK not configured. Alchemy client not initialized.");
    return null;
  }, []);

  useEffect(() => {
    if (userData && userData.hasOwnProperty('xp') && userData.lastLogin !== undefined) {
      setIsUserDataInitialized(true);
    }
  }, [userData]);

  const updateUser = useCallback((updates) => {
    setUserData(prev => {
      let newState = { ...prev };
      if (typeof updates === 'function') {
        newState = updates(prev);
      } else {
        for (const key in updates) {
          if (Object.prototype.hasOwnProperty.call(updates, key)) {
            if (
              typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key]) &&
              key === 'progress' &&
              typeof newState[key] === 'object' && newState[key] !== null && !Array.isArray(newState[key])
            ) {
              newState.progress = {
                ...(newState.progress || {}),
                ...updates.progress,
                chapters: {
                  ...(newState.progress?.chapters || {}),
                  ...(updates.progress?.chapters || {}),
                }
              };
              if (updates.progress?.chapters) {
                Object.keys(updates.progress.chapters).forEach(chapterId => {
                  if (updates.progress.chapters[chapterId]?.reflections) {
                    if (!newState.progress.chapters[chapterId]) {
                      newState.progress.chapters[chapterId] = {};
                    }
                    newState.progress.chapters[chapterId].reflections = {
                      ...(newState.progress.chapters[chapterId]?.reflections || {}),
                      ...updates.progress.chapters[chapterId].reflections,
                    };
                  }
                });
              }
            } else if (
              typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key]) &&
              typeof newState[key] === 'object' && newState[key] !== null && !Array.isArray(newState[key])
            ) {
               newState[key] = { ...newState[key], ...updates[key] };
            }
             else {
              newState[key] = updates[key];
            }
          }
        }
      }
      console.log("[UserContext] updateUser. New state:", newState);
      return newState;
    });
  }, [setUserData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setFirebaseAuthLoading(false);
      console.log("[UserContext] Firebase Auth state changed, firebaseUser:", user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (firebaseUser && db && isUserDataInitialized) {
      console.log(`[UserContext] Auth state change or userData init: User ${firebaseUser.uid}. Fetching reflections.`);
      setIsLoadingFirestoreReflections(true);
      const reflectionsCollectionRef = collection(db, 'users', firebaseUser.uid, 'reflections');
      
      getDocs(reflectionsCollectionRef)
        .then((querySnapshot) => {
          const fetchedUserReflectionsByChapter = {};
          querySnapshot.forEach((doc) => {
            const reflection = doc.data();
            const chapterId = reflection.chapterId;
            const reflectionSectionId = reflection.reflectionSectionId;

            if (!chapterId || !reflectionSectionId) {
              console.warn("[UserContext] Fetched reflection missing chapterId or reflectionSectionId:", doc.id, reflection);
              return;
            }
            if (!fetchedUserReflectionsByChapter[chapterId]) {
              fetchedUserReflectionsByChapter[chapterId] = { reflections: {} };
            }
            fetchedUserReflectionsByChapter[chapterId].reflections[reflectionSectionId] = {
              content: reflection.content,
              timestamp: reflection.createdAt?.toDate ? reflection.createdAt.toDate().toISOString() : new Date().toISOString(),
            };
          });

          console.log("[UserContext] Reflections fetched from Firestore (organized by chapter):", fetchedUserReflectionsByChapter);

          if (Object.keys(fetchedUserReflectionsByChapter).length > 0) {
            updateUser(prevUserData => {
              const newProgress = prevUserData.progress ? JSON.parse(JSON.stringify(prevUserData.progress)) : { chapters: {} };
              if (!newProgress.chapters) {
                newProgress.chapters = {};
              }

              Object.keys(fetchedUserReflectionsByChapter).forEach(chapterId => {
                if (!newProgress.chapters[chapterId]) {
                  newProgress.chapters[chapterId] = { reflections: {} };
                } else if (!newProgress.chapters[chapterId].reflections) {
                  newProgress.chapters[chapterId].reflections = {};
                }
                
                newProgress.chapters[chapterId].reflections = {
                  ...(newProgress.chapters[chapterId].reflections), 
                  ...fetchedUserReflectionsByChapter[chapterId].reflections,
                };
              });
              console.log("[UserContext] Merging Firestore reflections. Updated progress:", newProgress);
              return { ...prevUserData, progress: newProgress };
            });
          } else {
            console.log("[UserContext] No reflections found in Firestore for this user or all were invalid.");
          }
          setIsLoadingFirestoreReflections(false);
        })
        .catch((error) => {
          console.error("[UserContext] Error fetching reflections from Firestore:", error);
          setIsLoadingFirestoreReflections(false);
        });
    } else if (!firebaseUser && isUserDataInitialized) {
      console.log("[UserContext] No Firebase user logged in. Using local reflections data if any.");
    }
  }, [firebaseUser, updateUser, isUserDataInitialized]);

  const signUpWithEmail = useCallback(async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const firebaseLogout = useCallback(async () => {
    console.log("[UserContext] firebaseLogout called. Current firebaseUser:", firebaseUser?.uid);
    return firebaseSignOut(auth);
  }, [firebaseUser]);

  const handleLoginStreak = useCallback(() => {
    if (!isUserDataInitialized || !userData) return;
    // ...
  }, [isUserDataInitialized, userData]);

  useEffect(() => {
    if (isUserDataInitialized && walletAddress) {
        handleLoginStreak();
    }
  }, [isUserDataInitialized, walletAddress, handleLoginStreak]);

  useEffect(() => {
    if (!isUserDataInitialized || !userData ) return;
    if (typeof userData.xp !== 'number') {
        console.warn(`[UserContext] User XP is not a number: '${userData.xp}'. Level calculation skipped. XP should be corrected.`);
        return;
    }
    const newLevel = calculateLevel(userData.xp);
    if (newLevel !== userData.level) {
      updateUser({ level: newLevel });
    }
  }, [userData?.xp, userData?.level, isUserDataInitialized, updateUser]);

  useEffect(() => {
    const fetchUserAvatarData = async () => {
        if (!provider || !walletAddress || !isCorrectNetwork || !alchemyClient) { 
            setStoicAvatarNftBalance(0);
            setOnChainAvatarStage(null);
            setIsLoadingNftBalance(false);
            setIsLoadingOnChainAvatarStage(false);
            if (isUserDataInitialized) updateUser({ stoicQuestAvatarTokenId: null }); 
            if (!alchemyClient && provider && walletAddress && isCorrectNetwork) { 
                console.warn("DEBUG: UserContext.jsx - fetchUserAvatarData: Alchemy client not available.");
            }
            return;
        }
        if (!STOIC_AVATAR_NFT_CONTRACT_ADDRESS || STOIC_AVATAR_NFT_CONTRACT_ADDRESS.includes("YOUR_") || STOIC_AVATAR_NFT_CONTRACT_ADDRESS === "") {
            console.warn(`DEBUG: UserContext.jsx - Contract address not configured. Skipping avatar data fetch.`);
            setStoicAvatarNftBalance(0); setOnChainAvatarStage(null); setIsLoadingNftBalance(false); setIsLoadingOnChainAvatarStage(false);
            if (isUserDataInitialized) updateUser({ stoicQuestAvatarTokenId: null });
            return;
        }
        setIsLoadingNftBalance(true); setIsLoadingOnChainAvatarStage(true); setOnChainAvatarStage(null);
        if (isUserDataInitialized) updateUser({ stoicQuestAvatarTokenId: null });
        try {
            const contract = new ethers.Contract(STOIC_AVATAR_NFT_CONTRACT_ADDRESS, STOIC_AVATAR_NFT_ABI, provider);
            const balanceBigInt = await contract.balanceOf(walletAddress);
            const balanceNum = Number(balanceBigInt);
            setStoicAvatarNftBalance(balanceNum);
            console.log(`DEBUG: UserContext.jsx - NFT balance for ${walletAddress}: ${balanceNum}`);
            if (balanceNum > 0) {
                console.log(`DEBUG: UserContext.jsx - Fetching tokenId(s) via Alchemy: ${STOIC_AVATAR_NFT_CONTRACT_ADDRESS}`);
                const ownedNftsResponse = await alchemyClient.nft.getNftsForOwner(walletAddress, {
                    contractAddresses: [STOIC_AVATAR_NFT_CONTRACT_ADDRESS],
                });
                console.log("DEBUG: UserContext.jsx - Alchemy getNftsForOwner response:", ownedNftsResponse);
                if (ownedNftsResponse && ownedNftsResponse.ownedNfts.length > 0) {
                    const userToken = ownedNftsResponse.ownedNfts[0];
                    const userTokenIdString = userToken.tokenId;
                    if (userTokenIdString !== null && userTokenIdString !== undefined) {
                        console.log(`DEBUG: UserContext.jsx - Found tokenId via Alchemy: ${userTokenIdString}`);
                        if (isUserDataInitialized) updateUser({ stoicQuestAvatarTokenId: userTokenIdString });
                        const stageEnum = await contract.getAvatarInfo(BigInt(userTokenIdString));
                        const stageNumber = Number(stageEnum);
                        setOnChainAvatarStage(stageNumber);
                        console.log(`DEBUG: UserContext.jsx - On-chain avatar stage for ${userTokenIdString}: ${stageNumber}`);
                    } else {
                        console.warn("DEBUG: UserContext.jsx - TokenId missing from Alchemy response.");
                        setOnChainAvatarStage(null);
                    }
                } else {
                    console.warn(`DEBUG: UserContext.jsx - Alchemy found no specific NFTs for ${STOIC_AVATAR_NFT_CONTRACT_ADDRESS}, despite balance > 0.`);
                    setOnChainAvatarStage(null);
                }
            } else {
                setOnChainAvatarStage(null);
            }
        } catch (error) {
            console.error("DEBUG: UserContext.jsx - Error fetchUserAvatarData:", error);
            setOnChainAvatarStage(null);
        } finally {
            setIsLoadingNftBalance(false);
            setIsLoadingOnChainAvatarStage(false);
        }
    };
    if (walletAddress && isCorrectNetwork && alchemyClient) {
      fetchUserAvatarData();
    } else { 
      setStoicAvatarNftBalance(0); setOnChainAvatarStage(null); setIsLoadingNftBalance(false); setIsLoadingOnChainAvatarStage(false);
      if (isUserDataInitialized) updateUser({ stoicQuestAvatarTokenId: null });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, walletAddress, isCorrectNetwork, chainId, alchemyClient, updateUser, isUserDataInitialized]);

  useEffect(() => {
    const audioEl = backgroundAudioRef.current;
    if (audioEl) {
      if (walletAddress && isCorrectNetwork) {
        audioEl.play().catch(error => console.warn("DEBUG: UserContext.jsx - Looping audio autoplay prevented:", error.message));
      } else {
        audioEl.pause();
      }
    }
  }, [walletAddress, isCorrectNetwork]);

  const disconnectUserWallet = useCallback(() => {
    setWalletAddress(null); setSigner(null); setProvider(null); setChainId(null);
    setIsCorrectNetwork(false); setWalletError(null); setIsConnectingWallet(false);
    setStoicAvatarNftBalance(0); setOnChainAvatarStage(null);
    setIsLoadingNftBalance(true); setIsLoadingOnChainAvatarStage(true);
    if (isUserDataInitialized) updateUser({ stoicQuestAvatarTokenId: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUser, isUserDataInitialized]);

  const attemptSwitchToTargetNetwork = useCallback(async () => {
    if (!window.ethereum) { setWalletError("MetaMask not available."); return false; }
    setWalletError(null);
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: ACTIVE_NETWORK_CONFIG.chainIdHex }] });
      return true;
    } catch (switchError) {
      const errorCode = (switchError && typeof switchError.code !== 'undefined') ? switchError.code : null;
      if (errorCode === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: ACTIVE_NETWORK_CONFIG.chainIdHex,
              chainName: ACTIVE_NETWORK_CONFIG.networkName,
              rpcUrls: [ACTIVE_NETWORK_CONFIG.rpcUrl],
              nativeCurrency: ACTIVE_NETWORK_CONFIG.nativeCurrency,
              blockExplorerUrls: [ACTIVE_NETWORK_CONFIG.blockExplorerUrl],
            }],
          });
          return true;
        } catch (addError) {
          console.error("DEBUG: UserContext.jsx - Failed to add network:", addError);
          setWalletError(`Failed to add ${ACTIVE_NETWORK_CONFIG.networkName}. Please add it manually.`); return false;
        }
      } else if (errorCode === 4001) {
        setWalletError(`Request to switch to ${ACTIVE_NETWORK_CONFIG.networkName} rejected by user.`);
      } else {
        console.error("DEBUG: UserContext.jsx - Failed to switch network:", switchError);
        setWalletError(`Could not switch to ${ACTIVE_NETWORK_CONFIG.networkName}. Code: ${errorCode || 'unknown'}`);
      }
      return false;
    }
  }, []); 

  const connectUserWallet = useCallback(async (isEagerAttempt = false, preAuthorizedAccounts = null) => {
    if (isConnectingWallet && !isEagerAttempt) {
        console.log("DEBUG: UserContext.jsx - connectUserWallet: Already connecting.");
        return false;
    }
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      if (!isEagerAttempt) setWalletError('Please install MetaMask.');
      console.warn("DEBUG: UserContext.jsx - connectUserWallet: MetaMask not available.");
      return false;
    }
    setIsConnectingWallet(true);
    if (!isEagerAttempt) setWalletError(null);
    try {
      const accounts = preAuthorizedAccounts && preAuthorizedAccounts.length > 0
        ? preAuthorizedAccounts
        : await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        const connectedAddress = ethers.getAddress(accounts[0]);
        setWalletAddress(connectedAddress);
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethersProvider);
        const network = await ethersProvider.getNetwork();
        const currentChainIdNum = Number(network.chainId);
        setChainId(currentChainIdNum);
        if (currentChainIdNum === ACTIVE_NETWORK_CONFIG.chainId) {
          setIsCorrectNetwork(true);
          const ethersSigner = await ethersProvider.getSigner(connectedAddress);
          setSigner(ethersSigner);
        } else {
          setIsCorrectNetwork(false); setSigner(null);
          setStoicAvatarNftBalance(0); setOnChainAvatarStage(null); 
          if (isUserDataInitialized) updateUser({ stoicQuestAvatarTokenId: null });
          const wrongNetworkMsg = `Please switch to ${ACTIVE_NETWORK_CONFIG.networkName}. You are on Chain ID: ${currentChainIdNum}.`;
          if (!isEagerAttempt) {
            setWalletError(wrongNetworkMsg);
            await attemptSwitchToTargetNetwork();
          } else {
            setWalletError(wrongNetworkMsg);
          }
        }
        setIsConnectingWallet(false); return connectedAddress;
      } else {
        if (!isEagerAttempt) setWalletError('No accounts selected or available.');
        setWalletAddress(null); setIsConnectingWallet(false); return false;
      }
    } catch (error) {
      console.error("DEBUG: UserContext.jsx - connectUserWallet error:", error);
      const errorCode = (error && typeof error.code !== 'undefined') ? error.code : null;
      const errorMessage = (error && error.message) ? error.message : String(error);
      const userDenied = errorCode === 4001;
      const alreadyProcessing = errorCode === -32002;
      if (!isEagerAttempt) {
        if (userDenied) setWalletError('Connection request denied by user.');
        else if (alreadyProcessing) setWalletError('MetaMask is busy. Please try again.');
        else setWalletError(errorMessage);
      }
      setWalletAddress(null); setIsConnectingWallet(false); return false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptSwitchToTargetNetwork, isConnectingWallet, updateUser, isUserDataInitialized]); 

  useEffect(() => {
    let isMounted = true;
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      const handleAccountsChanged = (accounts) => {
        if (!isMounted) return;
        console.log("DEBUG: UserContext.jsx - MetaMask accountsChanged:", accounts);
        if (accounts.length === 0) {
          disconnectUserWallet();
        } else {
          connectUserWallet(false, accounts).catch(err => console.warn("DEBUG: UserContext.jsx - accountsChanged re-connect error:", (err && err.message ? err.message : String(err))));
        }
      };
      const handleChainChanged = async (_chainIdHex) => {
        if (!isMounted) return;
        const newChainId = Number(BigInt(_chainIdHex));
        console.log(`DEBUG: UserContext.jsx - MetaMask chainChanged to: ${newChainId}`);
        setChainId(newChainId);
        if (walletAddress && window.ethereum) {
            const ethersProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(ethersProvider);
            if (newChainId === ACTIVE_NETWORK_CONFIG.chainId) {
                setIsCorrectNetwork(true); setWalletError(null);
                try {
                    const newSigner = await ethersProvider.getSigner(walletAddress);
                    if (isMounted) setSigner(newSigner);
                } catch (err) {
                    console.error("DEBUG: UserContext.jsx - Error getting signer on chainChanged:", err);
                    if (isMounted) setSigner(null);
                }
            } else {
                setIsCorrectNetwork(false); setSigner(null);
                setWalletError(`Incorrect network. Please switch to ${ACTIVE_NETWORK_CONFIG.networkName}.`);
            }
        } else {
            if (newChainId === ACTIVE_NETWORK_CONFIG.chainId) {
                setIsCorrectNetwork(true); setWalletError(null);
            } else {
                setIsCorrectNetwork(false);
            }
            if (window.ethereum) setProvider(new ethers.BrowserProvider(window.ethereum));
            else setProvider(null);
            setSigner(null);
        }
        setStoicAvatarNftBalance(0); setOnChainAvatarStage(null);
        if (isUserDataInitialized) updateUser({ stoicQuestAvatarTokenId: null });
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      if (isUserDataInitialized && !walletAddress && !isConnectingWallet) {
        const tryEagerConnect = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (isMounted && accounts && accounts.length > 0) {
                    console.log("DEBUG: UserContext.jsx - Eager connect: Found accounts", accounts);
                    await connectUserWallet(true, accounts);
                } else if (isMounted) {
                    console.log("DEBUG: UserContext.jsx - Eager connect: No accounts found.");
                }
            } catch (error) {
                if (isMounted) console.warn("DEBUG: UserContext.jsx - Eager connect eth_accounts error:", (error && error.message ? error.message : String(error)));
            }
        };
        tryEagerConnect();
      }
      return () => {
        isMounted = false;
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, connectUserWallet, disconnectUserWallet, isUserDataInitialized, isConnectingWallet, updateUser]);

  const determineCurrentAvatarId = useCallback(() => {
    if (walletAddress && isCorrectNetwork && !isLoadingOnChainAvatarStage && onChainAvatarStage !== null) {
        return getStageNameFromEnum(onChainAvatarStage);
    }
    if (walletAddress && isCorrectNetwork && !isLoadingNftBalance && stoicAvatarNftBalance > 0 && onChainAvatarStage === null && !isLoadingOnChainAvatarStage) {
        console.warn("[UserContext] determineCurrentAvatarId: Owns NFT(s), but stage not determined. Fallback.");
        if (userData?.currentAvatarId && userData.currentAvatarId !== 'novice' && userData.ownedNfts?.includes(userData.currentAvatarId)) return userData.currentAvatarId;
        return 'novice';
    }
    if (!walletAddress || !isCorrectNetwork || isLoadingNftBalance || isLoadingOnChainAvatarStage) {
        if (userData?.currentAvatarId && userData.ownedNfts?.includes(userData.currentAvatarId)) return userData.currentAvatarId;
        return 'novice';
    }
    return userData?.currentAvatarId || 'novice';
  }, [
    walletAddress, isCorrectNetwork, isLoadingNftBalance, stoicAvatarNftBalance,
    onChainAvatarStage, isLoadingOnChainAvatarStage,
    userData?.currentAvatarId, userData?.ownedNfts
  ]);

  const currentAvatarId = determineCurrentAvatarId();
  const currentAvatarData = useMemo(() => getAvatarById(currentAvatarId) || getAvatarById('novice'), [currentAvatarId]);

  useEffect(() => {
    if (isUserDataInitialized && userData && currentAvatarId && userData.currentAvatarId !== currentAvatarId) {
      let updatesToMake = { currentAvatarId: currentAvatarId };
      const currentOwnedNfts = Array.isArray(userData.ownedNfts) && userData.ownedNfts.length > 0 ? userData.ownedNfts : ['novice'];
      let newOwnedNfts = [...currentOwnedNfts];
      if (!newOwnedNfts.includes(currentAvatarId)) {
        newOwnedNfts = [...new Set([...newOwnedNfts, currentAvatarId])];
      }
      if (JSON.stringify(newOwnedNfts) !== JSON.stringify(currentOwnedNfts)) {
        updatesToMake.ownedNfts = newOwnedNfts;
      }
      if (updatesToMake.currentAvatarId !== userData.currentAvatarId || updatesToMake.ownedNfts) {
          updateUser(updatesToMake);
      }
    }
  }, [isUserDataInitialized, userData, currentAvatarId, updateUser]);

  const contextValue = useMemo(() => {
    const isLoadingOverall = !isUserDataInitialized || firebaseAuthLoading || isConnectingWallet ||
                         (walletAddress && isCorrectNetwork && (isLoadingNftBalance || isLoadingOnChainAvatarStage || isLoadingFirestoreReflections)) ||
                         (walletAddress && !isCorrectNetwork && !walletError) ;

    return {
        user: userData,
        updateUser,
        walletAddress, signer, provider, chainId, isCorrectNetwork,
        connectUserWallet, disconnectUserWallet, attemptSwitchToTargetNetwork,
        walletError, isConnectingWallet,
        activeNetwork: ACTIVE_NETWORK_CONFIG,
        currentAvatarId: currentAvatarId,
        currentAvatar: currentAvatarData,
        stoicAvatarNftBalance,
        isLoadingNftBalance,
        onChainAvatarStage,
        isLoadingOnChainAvatarStage,
        ownsStoicQuestAvatar: stoicAvatarNftBalance > 0,
        loading: isLoadingOverall,
        firebaseUser,
        firebaseAuthLoading,
        isLoadingFirestoreReflections, 
        signUpWithEmail,
        signInWithEmail,
        firebaseLogout,
    };
  }, [
    userData, updateUser,
    walletAddress, signer, provider, chainId, isCorrectNetwork,
    connectUserWallet, disconnectUserWallet, attemptSwitchToTargetNetwork,
    walletError, isConnectingWallet,
    currentAvatarId, currentAvatarData, stoicAvatarNftBalance, isLoadingNftBalance,
    onChainAvatarStage, isLoadingOnChainAvatarStage,
    isUserDataInitialized, firebaseAuthLoading, isLoadingFirestoreReflections,
    signUpWithEmail, signInWithEmail, firebaseLogout
  ]);

  return (
    <UserContext.Provider value={contextValue}>
      <audio ref={backgroundAudioRef} src={backgroundAudioPath} loop preload="auto" />
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider.');
    }
    return context;
};