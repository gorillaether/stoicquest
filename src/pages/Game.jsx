// src/pages/Game.jsx
import React, { useEffect, useState } from 'react';
import './Game.css';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import ChapterContent from '../components/game/ChapterContent';
import Challenge from '../components/game/Challenge';
import Reflection from '../components/game/Reflection';
import Progress from '../components/game/Progress';
import Achievement from '../components/game/Achievement';
import Card from '../components/ui/Card';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import useUserProgress from '../hooks/useUserProgress';
import { getChapterById } from '../data/chapters';
import { getAchievementById } from '../data/achievements'; // Make sure this function exists

const Game = () => {
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
    getOverallProgress,
    unlockChapter
  } = useUserProgress();

  const [currentChapterData, setCurrentChapterData] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [recentAchievements, setRecentAchievements] = useState([]);

  useEffect(() => {
    if (currentChapterId) {
      const fetchedChapterData = getChapterById(currentChapterId);
      setCurrentChapterData(fetchedChapterData);

      const userChapterProgress = getChapterProgress(currentChapterId);
      const initialSection = userChapterProgress.lastReadSection !== undefined
        ? Math.min(userChapterProgress.lastReadSection, (fetchedChapterData?.sections?.length || 1) - 1)
        : 0;
      setActiveSectionIndex(initialSection);
    } else {
      setCurrentChapterData(null);
      setActiveSectionIndex(0);
    }
  }, [currentChapterId, getChapterProgress]);

  useEffect(() => {
    // Track new achievements and show notification
    if (user?.achievements?.length) {
      const unseenAchievements = user.achievements.filter(
        (id) => !recentAchievements.some((ach) => ach.id === id)
      );

      unseenAchievements.forEach((id) => {
        const achievementData = getAchievementById(id);
        if (achievementData) {
          setRecentAchievements((prev) => [
            ...prev,
            { ...achievementData, id, isNew: true }
          ]);
        }
      });
    }
  }, [user?.achievements]);

  const dismissAchievement = (achievementId) => {
    setRecentAchievements((prev) => prev.filter((ach) => ach.id !== achievementId));
  };

  const handleNextSection = () => {
    if (currentChapterData && activeSectionIndex < currentChapterData.sections.length - 1) {
      completeSection(currentChapterId, currentChapterData.sections[activeSectionIndex].id);
      setActiveSectionIndex(activeSectionIndex + 1);
      window.scrollTo(0, 0);
    } else if (currentChapterData && activeSectionIndex === currentChapterData.sections.length - 1) {
      completeSection(currentChapterId, currentChapterData.sections[activeSectionIndex].id);
      console.log(`Completed last section of chapter ${currentChapterId}.`);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevSection = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(activeSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const displayChallenges =
    currentChapterData && activeSectionIndex === currentChapterData.sections.length - 1;

  const challengesForChapter = currentChapterData?.challenges;
  const challengeForThisChapter = challengesForChapter?.[0];
  const isCurrentChallengeCompleted = challengeForThisChapter
    ? isChallengeCompleted(currentChapterId, challengeForThisChapter.id)
    : false;

  const handleChallengeCompletion = (challengeId, score, details) => {
    completeChallenge(currentChapterId, challengeId, score, details);
    console.log(`Challenge ${challengeId} in chapter ${currentChapterId} completed.`);

    const userChapterProgress = getChapterProgress(currentChapterId);

    if (userChapterProgress.isCompleted && currentChapterData?.next) {
      unlockChapter(currentChapterData.next);
      console.log(`Chapter ${currentChapterData.next} unlocked`);

      // Optional: Trigger a chapter completion achievement
      const chapterCompleteAchievementId = `chapter-${currentChapterId}-complete`;
      const achievementData = getAchievementById(chapterCompleteAchievementId);
      if (achievementData) {
        setRecentAchievements((prev) => [
          ...prev,
          { ...achievementData, id: chapterCompleteAchievementId, isNew: true }
        ]);
      }
    }
  };

  return (
    <div className="game-container">
      <Header />
      <Sidebar />
      <main className="game-content">
        <Progress progress={getOverallProgress()} />
        {currentChapterData && (
          <>
            <ChapterContent
              chapter={currentChapterData}
              sectionIndex={activeSectionIndex}
              isCompleted={isSectionCompleted(currentChapterId, currentChapterData.sections[activeSectionIndex]?.id)}
              onNext={handleNextSection}
              onPrev={handlePrevSection}
            />
            {displayChallenges && challengeForThisChapter && !isCurrentChallengeCompleted && (
              <Challenge
                challenge={challengeForThisChapter}
                onComplete={handleChallengeCompletion}
                isCompleted={isCurrentChallengeCompleted}
                completionDetails={getChallengeCompletionDetails(currentChapterId, challengeForThisChapter.id)}
              />
            )}
            {displayChallenges && isCurrentChallengeCompleted && (
              <Reflection
                chapterId={currentChapterId}
                initialValue={getReflection(currentChapterId)}
                onSave={(text) => saveReflection(currentChapterId, text)}
              />
            )}
          </>
        )}
        {recentAchievements.map((ach) => (
          <Achievement key={ach.id} data={ach} onDismiss={() => dismissAchievement(ach.id)} />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Game;