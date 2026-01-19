// src/pages/Game.jsx
import React, { useEffect, useState } from 'react';
import './Game.css'; // Assuming you have styles here

// Layout Components
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

// UI Components
import Card from '../components/ui/Card';

// Game Components
import ChapterContent from '../components/game/ChapterContent';
import Challenge from '../components/game/Challenge';
import Reflection from '../components/game/Reflection';
import Progress from '../components/game/Progress';
import Achievement from '../components/game/Achievement'; // Ensure this path is correct

// Hooks and Data
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import useGameProgress from "../hooks/useGameProgress";
import { getChapterById, getAllChapters } from '../data/chapters';
import { getAchievementById } from '../data/achievements';

const Game = () => {
  console.log('--- [Game.jsx] IS RENDERING (Top Level) ---');

  const { currentChapterId, selectChapter, isLoadingGame } = useGame();
  const { user } = useUser();
  const {
    getChapterProgress,
    completeSection,
    completeChallenge,
    saveReflection,
    isSectionCompleted,
    isChallengeCompleted,
    getReflection,
    getChallengeCompletionDetails,
  } = useGameProgress();

  const [currentChapterData, setCurrentChapterData] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const ipfsVideoUrl = 'https://aqua-gigantic-haddock-37.mypinata.cloud/ipfs/bafybeidghcupbhjze3l6abai7n4kaqmkupo4sf6bfty7233civrqm7oiuy';

  const YOUR_DISCORD_SERVER_ID = "1352710232744398908";
  const discordWidgetUrl = `https://discord.com/widget?id=${YOUR_DISCORD_SERVER_ID}&theme=dark`;


  useEffect(() => {
    console.log(`[Game.jsx] useEffect for currentChapterId. currentChapterId: ${currentChapterId}`);
    if (currentChapterId) {
      const fetchedChapterData = getChapterById(currentChapterId);
      console.log(`[Game.jsx] Fetched chapter data for ID ${currentChapterId}:`, fetchedChapterData ? `Title: ${fetchedChapterData.title}` : 'null/undefined');
      setCurrentChapterData(fetchedChapterData);

      if (fetchedChapterData?.sections?.length > 0) {
        const userChapterProgress = getChapterProgress(currentChapterId);
        console.log(`[Game.jsx] User chapter progress for Ch ${currentChapterId}:`, userChapterProgress);
        const sectionCount = fetchedChapterData.sections.length;
        const lastRead = userChapterProgress?.lastReadSection;
        const initialSection = (typeof lastRead === 'number' && lastRead >= 0 && lastRead < sectionCount)
          ? lastRead
          : 0;
        console.log(`[Game.jsx] Setting initial activeSectionIndex to: ${initialSection} for Ch ${currentChapterId}`);
        setActiveSectionIndex(initialSection);
      } else {
        console.warn(`[Game.jsx] Fetched chapter data for ID ${currentChapterId} has no sections or is invalid. Resetting section index.`);
        setActiveSectionIndex(0);
        if(!fetchedChapterData) setCurrentChapterData(null);
      }
    } else {
      console.log('[Game.jsx] No currentChapterId. Resetting chapter data and section index.');
      setCurrentChapterData(null);
      setActiveSectionIndex(0);
    }
  }, [currentChapterId, getChapterProgress]);

  useEffect(() => {
    if (user?.achievements && Array.isArray(user.achievements)) {
      const unseenAchievementIds = user.achievements.filter(
        (achId) => !recentAchievements.some((recentAch) => recentAch.id === achId)
      );
      if (unseenAchievementIds.length > 0) {
        console.log('[Game.jsx] New unseen achievement IDs found:', unseenAchievementIds);
        const newAchievementsData = unseenAchievementIds.map(achId => {
          const achievementData = getAchievementById(achId);
          return achievementData ? { ...achievementData, isNew: true } : null;
        }).filter(Boolean);

        if (newAchievementsData.length > 0) {
            setRecentAchievements((prev) => [...prev, ...newAchievementsData]);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.achievements]);

  const dismissAchievement = (achievementId) => {
    console.log(`[Game.jsx] Dismissing achievement: ${achievementId}`);
    setRecentAchievements((prev) => prev.filter((ach) => ach.id !== achievementId));
  };

  const handleNextSection = () => {
    console.log(`--- [Game.jsx] handleNextSection CALLED --- Current activeSectionIndex: ${activeSectionIndex}`);
    if (currentChapterData?.sections?.length > 0) {
      const currentSectionToMark = currentChapterData.sections[activeSectionIndex];
      if (currentSectionToMark && currentChapterId) {
        console.log(`[Game.jsx] Marking section ${currentSectionToMark.id} (Chapter ${currentChapterId}) as complete before moving.`);
        completeSection(currentChapterId, currentSectionToMark.id);
      }

      if (activeSectionIndex < currentChapterData.sections.length - 1) {
        const newIndex = activeSectionIndex + 1;
        console.log(`[Game.jsx] Advancing to next section. New activeSectionIndex: ${newIndex}`);
        setActiveSectionIndex(newIndex);
        window.scrollTo(0, 0);
      } else {
        console.log('[Game.jsx] Already on the LAST section. No "next" section to advance to.');
      }
    } else {
      console.error('[Game.jsx] handleNextSection: currentChapterData or its sections are invalid!');
    }
  };

  const handlePrevSection = () => {
    console.log(`--- [Game.jsx] handlePrevSection CALLED --- Current activeSectionIndex: ${activeSectionIndex}`);
    if (activeSectionIndex > 0) {
      const newIndex = activeSectionIndex - 1;
      console.log(`[Game.jsx] Moving to previous section. New activeSectionIndex: ${newIndex}`);
      setActiveSectionIndex(newIndex);
      window.scrollTo(0, 0);
    } else {
      console.log('[Game.jsx] Already on the FIRST section.');
    }
  };

  const handleChallengeCallbackFromChallengeComponent = (challengeIdArg, xpAwardArg, detailsArg) => {
    // challengeIdArg is intended to be challengeData.id from Challenge.jsx
    // xpAwardArg is intended to be challengeData.xpAward from Challenge.jsx
    // detailsArg is intended to be { answer: content } from Challenge.jsx

    console.log(`[Game.jsx] handleChallengeCallbackFromChallengeComponent received. ChallengeID: ${challengeIdArg}, XP Value: ${xpAwardArg}, Details:`, detailsArg);

    if (currentChapterId && challengeIdArg && typeof xpAwardArg === 'number') {
      // Call useGameProgress.completeChallenge with arguments in the correct order:
      // completeChallenge(chapterId, challengeId, xpToAward, details)
      completeChallenge(currentChapterId, challengeIdArg, xpAwardArg, detailsArg);
    } else {
      console.error(
        "[Game.jsx] Cannot complete challenge via callback: currentChapterId or challengeIdArg is missing, or xpAwardArg is not a number.",
        { currentChapterId, challengeIdArg, xpAwardArg, detailsArg }
      );
      // Optional: If xpAwardArg is specifically the problem but other IDs are fine,
      // you might choose to complete the challenge with 0 XP to still record the attempt.
      if (currentChapterId && challengeIdArg && (xpAwardArg === undefined || typeof xpAwardArg !== 'number')) {
         console.warn(`[Game.jsx] xpAwardArg was invalid or missing for challenge ${challengeIdArg}. Completing with 0 XP.`);
         completeChallenge(currentChapterId, challengeIdArg, 0, detailsArg); // Award 0 XP
      }
    }
  };

  const handleSaveReflection = (reflectionId, content, chId) => {
    const targetChapterId = chId || currentChapterId;
    console.log(`[Game.jsx] handleSaveReflection called. Chapter: ${targetChapterId}, Reflection ID (Section ID): ${reflectionId}, Content Length:`, content?.length);
    if (targetChapterId && reflectionId) {
      saveReflection(targetChapterId, reflectionId, content);
    } else {
      console.error("[Game.jsx] Could not save reflection: targetChapterId or reflectionId (sectionId) missing.");
    }
  };

  const allChaptersArray = getAllChapters();
  const currentSection = currentChapterData?.sections?.[activeSectionIndex];
  const savedReflectionForCurrentSection = currentSection && currentChapterId
    ? getReflection(currentChapterId, currentSection.id)
    : null;

  const isChapterFullyRead = currentChapterData?.sections?.length > 0
    ? currentChapterData.sections.every(section => isSectionCompleted(currentChapterId, section.id))
    : false;

  const challengesForChapter = currentChapterData?.challenges;
  const shouldDisplayChallengeArea = isChapterFullyRead && challengesForChapter && challengesForChapter.length > 0;
  const challengeToDisplay = shouldDisplayChallengeArea ? challengesForChapter[0] : null;

  const isCurrentChallengeCompleted = challengeToDisplay && currentChapterId
    ? isChallengeCompleted(currentChapterId, challengeToDisplay.id)
    : false;
  const currentChallengeCompletionDetails = challengeToDisplay && currentChapterId
    ? getChallengeCompletionDetails(currentChapterId, challengeToDisplay.id)
    : null;

  console.log(`[Game.jsx] PRE-RENDER | currentChapterId: ${currentChapterId}, activeSectionIndex: ${activeSectionIndex}`);

  return (
    <div className="game-container">
      <Header />
      {ipfsVideoUrl && ipfsVideoUrl !== 'YOUR_IPFS_VIDEO_URL_HERE' && (
        <div className="ipfs-video-area" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#e9ecef' }}>
          <h2>Welcome to Stoic Quest - Introduction!</h2>
          <video width="80%" style={{ maxWidth: '720px' }} controls>
            <source src={ipfsVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>Watch this short introduction to begin your philosophical journey.</p>
        </div>
      )}

      <div className="game-main">
        <Sidebar chapters={allChaptersArray} onChapterSelect={selectChapter} currentChapterId={currentChapterId} />
        <main className="game-content">
          {isLoadingGame ? (
            <Card><p>Loading game data...</p></Card>
          ) : currentChapterData && currentChapterData.sections && currentChapterData.sections.length > 0 ? (
            <>
              <Progress current={activeSectionIndex + 1} total={currentChapterData.sections.length} />
              <ChapterContent
                chapter={currentChapterData}
                sectionIndex={activeSectionIndex}
                onNext={handleNextSection}
                onPrev={handlePrevSection}
              />

              {currentSection && (
                <Card className="reflection-card" style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <h3>Reflection for: {currentSection.title || 'Current Section'}</h3>
                  <Reflection
                    promptText={currentSection.reflectionPrompt || ''}
                    reflectionId={currentSection.id}
                    chapterId={currentChapterId}
                    initialContent={savedReflectionForCurrentSection?.content || ''}
                    onSave={handleSaveReflection}
                  />
                </Card>
              )}
              
              {shouldDisplayChallengeArea && challengeToDisplay && (
                <Card className="challenge-card" style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <Challenge
                    challengeData={challengeToDisplay}
                    onChallengeComplete={handleChallengeCallbackFromChallengeComponent}
                    isCompleted={isCurrentChallengeCompleted}
                    completionDetails={currentChallengeCompletionDetails}
                  />
                </Card>
              )}

              {YOUR_DISCORD_SERVER_ID && YOUR_DISCORD_SERVER_ID !== "YOUR_SERVER_ID_HERE" && YOUR_DISCORD_SERVER_ID !== "1352710232744398908" /* Example, ensure your actual ID works or remove this part of condition */ ? (
                <Card className="discord-widget-card game-discord-widget" style={{ marginTop: '40px' }}>
                  <h2 className="discord-widget-title">Community Chat & Support</h2>
                  <p className="discord-widget-text">
                    Have questions or want to discuss this chapter? Join us on Discord!
                  </p>
                  <div className="discord-iframe-container">
                    <iframe
                      src={discordWidgetUrl}
                      width="350"
                      height="500"
                      allowtransparency="true"
                      frameBorder="0"
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                      title="Discord Server Widget"
                    ></iframe>
                  </div>
                </Card>
              ) : (
                <Card className="discord-widget-card game-discord-widget" style={{ marginTop: '40px' }}>
                  <h2 className="discord-widget-title">Community Chat</h2>
                  { YOUR_DISCORD_SERVER_ID === "1352710232744398908" ? /* Specific message if it's the placeholder */
                    <p className="discord-widget-text">Discord widget is configured with the example ID. Replace it with your actual server ID in Game.jsx.</p> :
                    <p className="discord-widget-text">Discord widget is not configured or using a placeholder ID.</p>
                  }
                </Card>
              )}

            </>
          ) : (
            <Card className="no-chapter-selected" style={{textAlign: 'center', padding: '30px'}}>
              <h1>Welcome!</h1>
              <p>Select a chapter from the sidebar to begin your philosophical journey through the Enchiridion.</p>
              {currentChapterId && !isLoadingGame && (!currentChapterData || !currentChapterData.sections || currentChapterData.sections.length === 0) && (
                <p style={{color: 'red', marginTop: '10px'}}>
                  It seems there's no content for the selected chapter (ID: {currentChapterId}). Please check the chapter data.
                </p>
              )}
            </Card>
          )}
          {recentAchievements.map((ach) => (
            ach && <Achievement key={ach.id} achievement={ach} isNew={ach.isNew} onDismiss={() => dismissAchievement(ach.id)} />
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Game;