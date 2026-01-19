// src/pages/Chapter.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Chapter.css'; // Ensure you have this CSS file

// Layout Components
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// UI Components
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Game Components
import ChapterContent from '../components/game/ChapterContent';
import Challenge from '../components/game/Challenge';
import Reflection from '../components/game/Reflection';
// import Progress from '../components/game/Progress'; // Uncomment if you use it

// Hooks and Data
import { useUser } from '../contexts/UserContext'; // Assuming useGameProgress doesn't re-export user
import useGameProgress from '../hooks/useGameProgress';
import { getChapterById } from '../data/chapters';

const ChapterPage = () => {
  console.log('--- [Chapter.jsx Page] IS RENDERING (Top Level) ---');
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [chapterData, setChapterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [error, setError] = useState(null);

  const {
    user, // Assuming useUser provides the user object directly
    loading: userLoading,
  } = useUser(); // Get user and loading state

  const {
    getChapterProgress,
    completeSection,
    completeChallenge,
    getReflection,
    saveReflection,
    // isChapterUnlocked, // Assuming useGameProgress provides this
    markChapterAsCompleted,
  } = useGameProgress();

  // Effect to fetch chapter data and set initial state
  useEffect(() => {
    console.log(`[Chapter.jsx Page] useEffect - Loading chapter data for chapterId: ${chapterId}. userLoading: ${userLoading}`);
    setIsLoading(true);
    setError(null);

    if (userLoading) {
      console.log("[Chapter.jsx Page] User context is loading, waiting to fetch chapter data...");
      // Don't setIsLoading(false) here, wait for userLoading to be false
      return;
    }

    const fetchedChapter = getChapterById(chapterId);
    console.log('[Chapter.jsx Page] Fetched chapter from data file:', fetchedChapter);

    if (fetchedChapter) {
      // Assuming isChapterUnlocked is a concept handled by getChapterProgress returning null/undefined or a specific flag
      const chapterProgressData = getChapterProgress(chapterId);
      console.log('[Chapter.jsx Page] Fetched chapter progress data:', chapterProgressData);

      // Simple check: if chapterProgressData indicates it's unlocked or it's chapter '1' (always unlocked)
      const isUnlocked = chapterProgressData?.isUnlocked || chapterId === '1'; // Example: Chapter '1' is always unlocked

      if (isUnlocked) {
        setChapterData(fetchedChapter);
        const initialSection = chapterProgressData?.lastReadSection || 0;
        // Ensure initialSection is within bounds
        const boundedInitialSection = Math.min(initialSection, (fetchedChapter.sections?.length || 1) - 1);
        setActiveSectionIndex(boundedInitialSection);
        console.log(`[Chapter.jsx Page] Chapter '${fetchedChapter.title}' data loaded. Initial sectionIndex: ${boundedInitialSection}`);
      } else {
        setError(`Chapter "${fetchedChapter.title}" (${chapterId}) is locked.`);
        console.warn(`[Chapter.jsx Page] Chapter ${chapterId} is locked.`);
      }
    } else {
      setError(`Chapter with ID ${chapterId} not found.`);
      console.error(`[Chapter.jsx Page] Chapter data not found for chapterId: ${chapterId}`);
    }
    setIsLoading(false);
  }, [chapterId, userLoading, user, getChapterProgress]); // Added user to dependencies for unlock check

  const currentSection = chapterData?.sections?.[activeSectionIndex];

  const handleNextSection = useCallback(() => {
    console.log('[Chapter.jsx Page] handleNextSection called. Current activeSectionIndex:', activeSectionIndex);
    if (chapterData && currentSection) {
      console.log(`[Chapter.jsx Page] Marking section ${currentSection.id} as complete for chapter ${chapterId}.`);
      completeSection(chapterId, currentSection.id); // Mark current section as read

      if (activeSectionIndex < chapterData.sections.length - 1) {
        const newIndex = activeSectionIndex + 1;
        console.log('[Chapter.jsx Page] Advancing to next section. New activeSectionIndex:', newIndex);
        setActiveSectionIndex(newIndex);
        window.scrollTo(0, 0);
      } else {
        console.log('[Chapter.jsx Page] Reached the end of sections for chapter:', chapterId);
        // Logic for what happens after the last section (e.g., show challenges or complete button)
      }
    } else {
      console.error('[Chapter.jsx Page] handleNextSection: chapterData or currentSection is missing.');
    }
  }, [activeSectionIndex, chapterData, chapterId, currentSection, completeSection]);

  const handlePrevSection = useCallback(() => {
    console.log('[Chapter.jsx Page] handlePrevSection called. Current activeSectionIndex:', activeSectionIndex);
    if (activeSectionIndex > 0) {
      const newIndex = activeSectionIndex - 1;
      console.log('[Chapter.jsx Page] Moving to previous section. New activeSectionIndex:', newIndex);
      setActiveSectionIndex(newIndex);
      window.scrollTo(0, 0);
    } else {
      console.log('[Chapter.jsx Page] Already on the first section.');
    }
  }, [activeSectionIndex]);

  const handleReflectionSave = useCallback((reflectionId, content) => {
    console.log(`[Chapter.jsx Page] handleReflectionSave called. ID: ${reflectionId}, Chapter: ${chapterId}, Content:`, content);
    saveReflection(chapterId, reflectionId, content);
    // alert('Reflection saved!'); // Optional feedback
  }, [chapterId, saveReflection]);

  const handleChallengeComplete = useCallback((challengeId, score, details) => {
    console.log(`[Chapter.jsx Page] handleChallengeComplete called for challenge: ${challengeId}, Score: ${score}`);
    completeChallenge(chapterId, challengeId, score, details);
  }, [chapterId, completeChallenge]);

  // --- RENDER LOGIC ---
  console.log('[Chapter.jsx Page] Pre-render checks:', { isLoading, userLoading, error, chapterDataExists: !!chapterData, currentSectionExists: !!currentSection });

  if (isLoading || userLoading) {
    return (
      <div className="chapter-page-container">
        <Header />
        <main className="chapter-page-content loading">
          <Card><p>Loading Chapter...</p></Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="chapter-page-container">
        <Header />
        <main className="chapter-page-content">
          <Card className="chapter-error-card">
            <h1>Error</h1>
            <p>{error}</p>
            <Button onClick={() => navigate('/game')}>Back to Game Hub</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!chapterData || !currentSection) {
    return (
      <div className="chapter-page-container">
        <Header />
        <main className="chapter-page-content">
          <Card className="chapter-not-found-card">
            <h1>Chapter Not Found</h1>
            <p>The content for this chapter could not be loaded.</p>
            <Button onClick={() => navigate('/game')}>Back to Game Hub</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Example: Determine if challenges should be shown
  const showChallenges = activeSectionIndex === chapterData.sections.length - 1; // Show challenges after the last section
  const firstChallenge = chapterData.challenges?.[0];

  return (
    <div className="chapter-page-container">
      <Header />
      <main className="chapter-page-content">
        <h1 className="chapter-page-title">{chapterData.title}</h1>
        <ChapterContent
          chapter={chapterData}
          sectionIndex={activeSectionIndex}
          onPrev={handlePrevSection}
          onNext={handleNextSection}
          // Pass onSectionComplete from useGameProgress if ChapterContent should call it
          // based on its internal logic (e.g., after its own useEffect detects sectionIndex change).
          // For now, completeSection is called directly in handleNextSection above.
          // onSectionComplete={(chId, secId) => completeSection(chId, secId)}
        />

        {/* --- Reflection Area for the current section --- */}
        <Card className="reflection-card-container" style={{ marginTop: '30px' }}> {/* Added class from your CSS */}
          <h3 className="chapter-area-title">Reflection: {currentSection.title}</h3> {/* Used chapter-area-title from your CSS */}
          <Reflection
            promptText={currentSection.reflectionPrompt}
            reflectionId={currentSection.id}
            initialContent={getReflection(chapterId, currentSection.id)?.content || ''}
            onSave={handleReflectionSave}
          />
        </Card>

        {/* Conditional Rendering for Challenges */}
        {showChallenges && firstChallenge && (
          <Card className="chapter-challenges-area" style={{ marginTop: '30px' }}> {/* Added class from your CSS */}
            <h2 className="chapter-area-title">Chapter Challenge</h2> {/* Used chapter-area-title */}
            <Challenge
              challengeData={firstChallenge}
              onChallengeComplete={(score, details) => handleChallengeComplete(firstChallenge.id, score, details)}
              // You'll need to pass other props like isCompleted if Challenge.jsx expects them
            />
          </Card>
        )}

        {/* Button to mark chapter as complete or go to next chapter */}
        {activeSectionIndex === chapterData.sections.length - 1 && (
          <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
            <Button
              onClick={() => {
                console.log(`[Chapter.jsx Page] User clicked "Complete Chapter & Proceed" for ${chapterId}`);
                if(markChapterAsCompleted) markChapterAsCompleted(chapterId); else console.warn("markChapterAsCompleted not available from useGameProgress");

                if (chapterData.next) {
                  console.log(`[Chapter.jsx Page] Navigating to next chapter: ${chapterData.next}`);
                  // Reset activeSectionIndex for the new chapter if navigating within this component structure
                  // Or better, navigate to a new route that re-initializes ChapterPage for the new ID
                  setActiveSectionIndex(0); // Reset for potential re-render with new chapter ID if route doesn't change fully
                  navigate(`/chapter/${chapterData.next}`);
                } else {
                  console.log('[Chapter.jsx Page] No next chapter, navigating to game hub.');
                  navigate('/game'); // Or a "congratulations" page
                }
              }}
              variant="primary"
              size="large"
            >
              {chapterData.next ? 'Complete Chapter & Next' : 'Finish Chapter'}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ChapterPage;