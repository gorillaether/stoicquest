// src/components/game/ChapterContent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Bookmark } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import Card from '../ui/Card';
import './ChapterContent.css';

const ChapterContent = ({
  chapter,
  sectionIndex,
  onPrev,
  onNext,
  onSectionComplete,
  onChapterComplete,
  onProgressUpdate,
}) => {
  // --- TOP LEVEL LOG: Does this component even render/re-render with new props? ---
  console.log('--- [ChapterContent.jsx] IS RENDERING ---');
  console.log('[ChapterContent.jsx] Props received:', { chapterId: chapter?.id, sectionIndex, onPrev: typeof onPrev, onNext: typeof onNext });

  const { user, updateUser, loading: userLoading } = useUser();
  const [bookmarkPosition, setBookmarkPosition] = useState(null);
  const [showTranslationOptions, setShowTranslationOptions] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState('standard');

  useEffect(() => {
    console.log('[ChapterContent.jsx] useEffect for bookmark/translation preference running. Chapter ID:', chapter?.id);
    if (!userLoading && user && chapter) {
      const savedChapterProgress = user.progress?.chapters?.[chapter.id];
      if (savedChapterProgress?.bookmarkPosition !== undefined) {
        setBookmarkPosition(savedChapterProgress.bookmarkPosition);
      } else {
        setBookmarkPosition(null);
      }
      if (user.settings?.translationPreference) {
        setSelectedTranslation(user.settings.translationPreference);
      } else {
        setSelectedTranslation('standard');
      }
    }
  }, [user, userLoading, chapter]);

  useEffect(() => {
    console.log('[ChapterContent.jsx] useEffect for onSectionComplete/onChapterComplete running. sectionIndex:', sectionIndex, 'Chapter ID:', chapter?.id);
    if (!userLoading && user && chapter && typeof sectionIndex === 'number') {
      if (sectionIndex > 0 && onSectionComplete) {
        const previouslyViewedSection = chapter.sections[sectionIndex - 1];
        if (previouslyViewedSection) {
          console.log('[ChapterContent.jsx] Calling onSectionComplete for section:', previouslyViewedSection.id);
          onSectionComplete(chapter.id, previouslyViewedSection.id);
        }
      }
      if (sectionIndex === chapter.sections.length - 1 && onChapterComplete) {
        console.log('[ChapterContent.jsx] Calling onChapterComplete for chapter:', chapter.id);
        onChapterComplete(chapter.id);
        if (onProgressUpdate) {
          onProgressUpdate(chapter.sections.length, chapter.sections.length, true);
        }
      } else if (onProgressUpdate) {
        onProgressUpdate(sectionIndex + 1, chapter.sections.length, false);
      }
    }
  }, [
    sectionIndex, chapter, user, userLoading,
    onSectionComplete, onChapterComplete, onProgressUpdate, updateUser
  ]);

  const handleAddBookmark = useCallback(() => {
    console.log('[ChapterContent.jsx] handleAddBookmark called for sectionIndex:', sectionIndex);
    const newBookmarkPosition = bookmarkPosition === sectionIndex ? null : sectionIndex;
    setBookmarkPosition(newBookmarkPosition);
    if (user && chapter) {
      const updatedProgress = { /* ... progress update ... */ };
      updateUser({ progress: updatedProgress });
    }
  }, [bookmarkPosition, sectionIndex, chapter, user, updateUser]);

  const handleTranslationChange = useCallback((translation) => {
    console.log('[ChapterContent.jsx] handleTranslationChange called with:', translation);
    setSelectedTranslation(translation);
    setShowTranslationOptions(false);
    if (user) {
      updateUser({ settings: { ...user.settings, translationPreference: translation } });
    }
  }, [user, updateUser]);

  const getTranslatedContent = useCallback(() => {
    const currentSectionData = chapter?.sections?.[sectionIndex];
    if (!currentSectionData) return '';
    // ... (translation logic remains the same)
    switch (selectedTranslation) {
      case 'modern': return currentSectionData.modernContent || currentSectionData.content || '';
      case 'simple': return currentSectionData.simpleContent || currentSectionData.content || '';
      case 'original': return currentSectionData.originalContent || currentSectionData.content || '';
      default: return currentSectionData.content || '';
    }
  }, [chapter, sectionIndex, selectedTranslation]);

  const renderSectionContent = useCallback(() => {
    const content = getTranslatedContent();
    return content.split('\n').map((paragraph, index) => (
      <p key={`p-${chapter?.id}-${sectionIndex}-${index}`} className="mb-4">{paragraph}</p>
    ));
  }, [getTranslatedContent, chapter, sectionIndex]);

  if (userLoading || !chapter || typeof sectionIndex !== 'number' || !chapter.sections || sectionIndex < 0 || sectionIndex >= chapter.sections.length) {
    console.log('[ChapterContent.jsx] Rendering loading/error state:', { userLoading, chapterExists: !!chapter, sectionIndex, sectionsExists: !!chapter?.sections, sectionLength: chapter?.sections?.length });
    return (
      <Card className="chapter-content-card">
        <div className="chapter-content-header"><h2 className="chapter-title">Loading Content...</h2></div>
      </Card>
    );
  }

  const currentSectionData = chapter.sections[sectionIndex];

  return (
    <Card className="chapter-content-card">
      <div className="chapter-content-header">
        <div className="chapter-title-area">
          <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
          <h2 className="chapter-title">{chapter.title}</h2>
        </div>
        <div className="chapter-controls">
          {/* ... translation and bookmark buttons ... */}
           <div className="translation-dropdown relative">
            <button
              className="translation-toggle text-sm flex items-center text-gray-600 hover:text-gray-800"
              onClick={() => setShowTranslationOptions(!showTranslationOptions)}
            >
              <span className="mr-1">Translation: {selectedTranslation}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTranslationOptions && (
              <div className="translation-options absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {['standard', 'modern', 'simple', 'original'].map(transKey => (
                    <button
                      key={transKey}
                      className={`block px-4 py-2 text-sm text-left w-full capitalize ${
                        selectedTranslation === transKey ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTranslationChange(transKey)}
                    >
                      {transKey === 'standard' ? 'Standard' : transKey === 'original' ? 'Original Greek' : transKey.charAt(0).toUpperCase() + transKey.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            className={`bookmark-button p-1 rounded-full ${
              bookmarkPosition === sectionIndex ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={handleAddBookmark}
            aria-label={bookmarkPosition === sectionIndex ? 'Remove bookmark from this section' : 'Add bookmark to this section'}
          >
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>

      {currentSectionData?.title && (
        <h3 className="section-title text-lg font-medium text-gray-700 mb-3">{currentSectionData.title}</h3>
      )}
      <div className="chapter-text prose max-w-none">{renderSectionContent()}</div>
      <div className="navigation-controls flex justify-between mt-8 pt-4 border-t border-gray-200">
        <button
          className={`nav-button prev-button flex items-center px-3 py-1 rounded-md ${sectionIndex > 0 ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`}
          onClick={() => {
            console.log('--- [ChapterContent.jsx] PREVIOUS BUTTON CLICKED ---');
            if (onPrev) onPrev(); else console.error('[ChapterContent.jsx] onPrev prop is missing!');
          }}
          disabled={sectionIndex === 0}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Previous
        </button>
        <div className="section-indicator text-sm text-gray-500">{sectionIndex + 1} of {chapter.sections.length}</div>
        <button
          className={`nav-button next-button flex items-center px-3 py-1 rounded-md ${sectionIndex < chapter.sections.length - 1 ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`}
          onClick={() => {
            console.log('--- [ChapterContent.jsx] NEXT BUTTON CLICKED ---');
            if (onNext) onNext(); else console.error('[ChapterContent.jsx] onNext prop is missing!');
          }}
          // For this test, let's ensure it's not the disabled attribute itself causing confusion with clicks
          // disabled={!chapter?.sections || sectionIndex === chapter.sections.length - 1}
        >
          Next
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </Card>
  );
};
export default ChapterContent;