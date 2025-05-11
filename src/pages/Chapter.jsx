// src/pages/Chapter.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Hook to get parameters from the URL
import './Chapter.css';
import Header from '../components/layout/Header'; // Layout component
import Footer from '../components/layout/Footer'; // Layout component
import ChapterContent from '../components/game/ChapterContent'; // Displays section text
import Challenge from '../components/game/Challenge'; // Displays challenges
import Reflection from '../components/game/Reflection'; // Provides reflection space
import Progress from '../components/game/Progress'; // Displays progress bar
import Card from '../components/ui/Card'; // Container component
import Button from '../components/ui/Button'; // Button component
import { getChapterById } from '../data/chapters'; // Function to fetch chapter data
import useUserProgress from '../hooks/useUserProgress'; // Hook to manage user progress
import { useUser } from '../contexts/UserContext'; // Use UserContext if needed for locked state check

/**
 * Page component to display a specific chapter of the Enchiridion.
 * Manages the flow between sections, challenges, and reflections within the chapter.
 */
const Chapter = () => {
  const { chapterId } = useParams(); // Get the chapterId from the URL (e.g., /chapter/1)
  const [chapterData, setChapterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0); // State to track the current section being viewed

  const {
    getChapterProgress,
    completeSection,
    completeChallenge,
    saveReflection,
    isSectionCompleted,
    isChallengeCompleted,
    getReflection,
    getChallengeCompletionDetails
  } = useUserProgress(); // Get progress data and update functions

  const { user } = useUser(); // Get user to check if chapter is unlocked

  // Fetch chapter data and set initial section based on user progress
  useEffect(() => {
    setIsLoading(true);
    const fetchedChapterData = getChapterById(chapterId);

    if (fetchedChapterData) {
      setChapterData(fetchedChapterData);

      // Get user's saved progress for this chapter
      const userChapterProgress = getChapterProgress(chapterId);

      // Set the active section to the last read section, or 0 if none saved
      // Ensure the index is within the bounds of the fetched chapter's sections
      const initialSection = userChapterProgress.lastReadSection !== undefined
        ? Math.min(userChapterProgress.lastReadSection, fetchedChapterData.sections.length - 1)
        : 0;
      setActiveSectionIndex(initialSection);

      // Mark chapter as started if it's the first visit beyond unlocking
      if (!userChapterProgress.isStarted && userChapterProgress.isUnlocked) {
          // Use a timeout to avoid state update loop with getChapterProgress
          setTimeout(() => {
               // Need a function in useUserProgress to mark as started
               // For now, we can just check if lastVisited is set
                console.log(`Started chapter ${chapterId}`);
          }, 0);

      }


    } else {
      setChapterData(null); // Chapter not found
    }
    setIsLoading(false);
  }, [chapterId, getChapterProgress]); // Depend on chapterId and getChapterProgress


   // Determine if the chapter is unlocked for the user
   const userChapterProgress = getChapterProgress(chapterId);
   const isChapterUnlocked = userChapterProgress.isUnlocked;

   // Redirect or show locked message if chapter is not unlocked
   if (!isLoading && !chapterData) {
       return (
           <div className="chapter-page-container">
                <Header />
                <div className="chapter-page-content">
                     <Card className="chapter-not-found-card">
                          <h1>Chapter Not Found</h1>
                          <p>The requested chapter could not be found.</p>
                     </Card>
                </div>
                <Footer />
           </div>
       );
   }

    if (!isLoading && chapterData && !isChapterUnlocked) {
       return (
            <div className="chapter-page-container">
                <Header />
                <div className="chapter-page-content">
                     <Card className="chapter-locked-card">
                          <h1>Chapter Locked</h1>
                          <p>You need to unlock this chapter to access its content.</p>
                           {/* Optional: Button to go back to game/sidebar */}
                           {/* <Link to="/game"><Button>Back to Game</Button></Link> */}
                     </Card>
                </div>
                <Footer />
           </div>
       );
   }


  // Get the current section data to display
  const currentSection = chapterData?.sections[activeSectionIndex];

  // Logic to determine which challenge to display (Example: display challenges after all sections are read)
  // A more complex game might tie challenges to specific sections.
  const displayChallenges = chapterData && activeSectionIndex === chapterData.sections.length - 1;
  const challengeForThisChapter = chapterData?.challenges?.[0]; // Assuming one challenge per chapter for simplicity, get the first one

  // Determine if the challenge for this chapter is completed
  const isCurrentChallengeCompleted = challengeForThisChapter ? isChallengeCompleted(chapterId, challengeForThisChapter.id) : false;


   // Handle completing a section (called when user navigates past the last part of a section)
  const handleSectionComplete = () => {
      if (currentSection) {
           completeSection(chapterId, currentSection.id); // Mark the section as completed in user progress
           // Note: The logic for advancing to the next section is in handleNextSection
      }
  };


  // Handle navigation to the next section
  const handleNextSection = () => {
    if (chapterData && activeSectionIndex < chapterData.sections.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1);
      // When moving to the next section, mark the *previous* section as complete
      handleSectionComplete();
      window.scrollTo(0, 0); // Scroll to top of the page
    } else if (chapterData && activeSectionIndex === chapterData.sections.length - 1) {
       // If at the last section, clicking next could potentially trigger something else
       // like showing challenges or marking the chapter as fully read/ready for challenge.
       // The section completion is handled above.
       console.log(`Reached end of sections for chapter ${chapterId}`);
       window.scrollTo(0, 0); // Still scroll to top
    }
  };

  // Handle navigation to the previous section
  const handlePrevSection = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(activeSectionIndex - 1);
      window.scrollTo(0, 0); // Scroll to top of the page
    }
  };

  // Handle challenge completion
  const handleChallengeCompletion = (challengeId, score, details) => {
      completeChallenge(chapterId, challengeId, score, details); // Update user progress
      console.log(`Challenge ${challengeId} in chapter ${chapterId} completed with score ${score}`);
      // Optional: Show a completion message or trigger next steps
  };

   // Handle saving a reflection
   const handleSaveReflection = (reflectionId, content) => {
       saveReflection(chapterId, reflectionId, content); // Save reflection in user progress
        console.log(`Reflection saved for chapter ${chapterId}, ID: ${reflectionId}`);
       // Optional: Show a confirmation message
   };


  if (isLoading) {
    return (
        <div className="chapter-page-container">
             <Header />
              <div className="chapter-page-content loading">
                 <Card>Loading chapter...</Card>
              </div>
             <Footer />
        </div>
    );
  }


  // Ensure chapterData and currentSection exist before rendering content
  if (!chapterData || !currentSection) {
      // This case should ideally be handled by the loading/not found checks above,
      // but as a fallback:
       return (
           <div className="chapter-page-container">
                <Header />
                <div className="chapter-page-content">
                     <Card className="chapter-error-card">
                          <h1>Error Loading Chapter</h1>
                          <p>There was an issue displaying this chapter.</p>
                     </Card>
                </div>
                <Footer />
           </div>
       );
  }


  // Determine the progress percentage for the section progress bar
  const sectionProgressPercentage = chapterData
    ? ((activeSectionIndex + 1) / chapterData.sections.length) * 100
    : 0;

  // Determine if the current section is already marked as completed in user progress
  const isCurrentSectionCompleted = isSectionCompleted(chapterId, currentSection.id);


  // Get the user's saved reflection for the current section (using section ID as reflection ID)
  const savedReflection = getReflection(chapterId, currentSection.id);


  return (
    <div className="chapter-page-container">
      <Header /> {/* Display the application header */}
      <div className="chapter-page-content">
        {/* Main content area for the chapter */}
        <h1 className="chapter-page-title">{chapterData.title}</h1> {/* Chapter Title */}

        {/* Section Progress Indicator */}
        <Progress
          current={activeSectionIndex + 1}
          total={chapterData.sections.length}
        />

        {/* Display the current section content */}
        <ChapterContent
          chapter={{ // Pass relevant chapter/section data to ChapterContent
            id: chapterData.id,
            title: chapterData.title,
            sections: chapterData.sections, // Pass all sections so ChapterContent can determine next/prev
            // Note: ChapterContent will need to display the section at activeSectionIndex
            // The previous ChapterContent implementation had its own activeSection state and navigation.
            // We need to adjust ChapterContent to take activeSectionIndex or just the current section
            // and let this Chapter page handle navigation.
             // Let's simplify ChapterContent to just take the current section data and the total sections count
             // and let THIS page handle the index and navigation logic.
             // OR, revert ChapterContent to manage its own index but call a parent handler on section completion.
             // Given the provided ChapterContent had internal index and navigation, let's pass the chapterData
             // and update ChapterContent to use the initialSection from prop if available, and call a prop handler on completion.
             // Reverting to passing full chapterData and letting ChapterContent manage index internally for now,
             // BUT ensuring it calls handleSectionComplete when appropriate (e.g., on next button click at end of a section).
             // This makes ChapterContent more self-contained for navigation within sections.

             // Revised approach: Let Chapter.jsx manage activeSectionIndex and pass *only* the current section data
             // to ChapterContent, along with total sections count and navigation handlers.
             // ChapterContent becomes a pure display component for one section.
          }}
           section={currentSection} // Pass only the current section data
           totalSections={chapterData.sections.length}
           onSectionComplete={handleSectionComplete} // Pass handler for section completion
           onNextSection={handleNextSection} // Pass navigation handlers
           onPrevSection={handlePrevSection}
           activeSectionIndex={activeSectionIndex} // Pass active index for internal display/logic if needed
        />

        {/* Display Challenges after completing sections (Example logic) */}
        {displayChallenges && challengeForThisChapter && (
            <div className="chapter-challenges-area">
                 <h2 className="chapter-area-title">Challenge</h2>
                 <Challenge
                    challengeData={challengeForThisChapter} // Pass the challenge data
                     onChallengeComplete={handleChallengeCompletion} // Pass completion handler
                     isCompleted={isCurrentChallengeCompleted} // Indicate if already completed
                     completionDetails={getChallengeCompletionDetails(chapterId, challengeForThisChapter.id)} // Pass completion details
                 />
            </div>
        )}

        {/* Display Reflection area */}
         <div className="chapter-reflection-area">
             <h2 className="chapter-area-title">Reflection</h2>
             <Reflection
                 chapterId={chapterId} // Associate reflection with the chapter
                 reflectionId={currentSection.id} // Associate reflection with the current section
                 initialText={savedReflection?.content || ''} // Load saved reflection text
                 onSave={(content) => handleSaveReflection(currentSection.id, content)} // Pass save handler, using section ID as reflection ID
             />
         </div>


      </div>
      <Footer /> {/* Display the application footer */}
    </div>
  );
};

export default Chapter;