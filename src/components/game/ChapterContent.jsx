// src/components/game/ChapterContent.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Book, BookOpen, Bookmark } from 'lucide-react';
import { UserContext } from '../../contexts/UserContext';
import Card from '../ui/Card';
import './ChapterContent.css'; // Import the CSS file

/**
 * Displays the Enchiridion text content for a specific chapter
 * @param {Object} props
 * @param {Object} props.chapter - The chapter data object
 * @param {string} props.chapter.id - Chapter ID
 * @param {string} props.chapter.title - Chapter title
 * @param {string} props.chapter.content - Chapter content (text of the Enchiridion)
 * @param {Array} props.chapter.sections - Array of sections within the chapter
 * @param {function} props.onProgressUpdate - Function to call when reading progress is updated
 */
const ChapterContent = ({ chapter, onProgressUpdate }) => {
  const { user, updateUser } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState(0);
  const [bookmarkPosition, setBookmarkPosition] = useState(null);
  const [hasReadFully, setHasReadFully] = useState(false);
  const [showTranslationOptions, setShowTranslationOptions] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState('standard');

  // Get saved progress from user data
  useEffect(() => {
    if (user && user.progress && user.progress.chapters) {
      const savedProgress = user.progress.chapters[chapter.id];
      if (savedProgress) {
        if (savedProgress.bookmarkPosition) {
          setBookmarkPosition(savedProgress.bookmarkPosition);
        }
        if (savedProgress.lastReadSection) {
          setActiveSection(savedProgress.lastReadSection);
        }
        if (savedProgress.hasReadFully) {
          setHasReadFully(true);
        }
      }
    }
  }, [user, chapter.id]);

  // Update progress when user navigates to a new section
  useEffect(() => {
    // Save the progress only if we've advanced
    const currentProgress = user?.progress?.chapters?.[chapter.id] || {};
    const isNewProgress = activeSection > (currentProgress.lastReadSection || 0);

    if (isNewProgress) {
      const updatedProgress = {
        ...user.progress,
        chapters: {
          ...(user.progress?.chapters || {}),
          [chapter.id]: {
            ...(user.progress?.chapters?.[chapter.id] || {}),
            lastReadSection: activeSection,
            lastReadAt: new Date().toISOString()
          }
        }
      };

      updateUser({ progress: updatedProgress });

      if (onProgressUpdate) {
        onProgressUpdate(activeSection, chapter.sections.length);
      }
    }
  }, [activeSection, chapter.id, user, updateUser, onProgressUpdate]);

  // Check if user has read the full chapter
  useEffect(() => {
    if (activeSection === chapter.sections.length - 1 && !hasReadFully) {
      setHasReadFully(true);

      const updatedProgress = {
        ...user.progress,
        chapters: {
          ...(user.progress?.chapters || {}),
          [chapter.id]: {
            ...(user.progress?.chapters?.[chapter.id] || {}),
            hasReadFully: true,
            completedAt: new Date().toISOString()
          }
        }
      };

      updateUser({ progress: updatedProgress });

      // Trigger the onProgressUpdate with completed status
      if (onProgressUpdate) {
        onProgressUpdate(chapter.sections.length, chapter.sections.length, true);
      }
    }
  }, [activeSection, chapter.id, chapter.sections.length, hasReadFully, user, updateUser, onProgressUpdate]);

  // Add a bookmark at the current position
  const handleAddBookmark = () => {
    setBookmarkPosition(activeSection);

    const updatedProgress = {
      ...user.progress,
      chapters: {
        ...(user.progress?.chapters || {}),
        [chapter.id]: {
          ...(user.progress?.chapters?.[chapter.id] || {}),
          bookmarkPosition: activeSection
        }
      }
    };

    updateUser({ progress: updatedProgress });
  };

  // Navigate to the next section
  const handleNextSection = () => {
    if (activeSection < chapter.sections.length - 1) {
      setActiveSection(activeSection + 1);
      window.scrollTo(0, 0);
    }
  };

  // Navigate to the previous section
  const handlePrevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle translation change
  const handleTranslationChange = (translation) => {
    setSelectedTranslation(translation);
    setShowTranslationOptions(false);
  };

  // Get the content based on the selected translation
  const getTranslatedContent = () => {
    const section = chapter.sections[activeSection];

    if (!section) return '';

    switch (selectedTranslation) {
      case 'modern':
        return section.modernContent || section.content;
      case 'simple':
        return section.simpleContent || section.content;
      case 'original':
        return section.originalContent || section.content;
      default:
        return section.content;
    }
  };

  // Render the section content
  const renderSectionContent = () => {
    const content = getTranslatedContent();

    // Split content into paragraphs and render
    return content.split('\n').map((paragraph, index) => (
      <p key={`p-${index}`} className="mb-4">
        {paragraph}
      </p>
    ));
  };

  const section = chapter.sections[activeSection];

  return (
    <Card className="chapter-content-card"> {/* Added a class name for the card */}
      <div className="chapter-content-header"> {/* Added class name */}
        <div className="chapter-title-area"> {/* Added class name */}
          <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
          <h2 className="chapter-title"> {/* Added class name */}
            {chapter.title}
          </h2>
        </div>

        <div className="chapter-controls"> {/* Added class name */}
          {/* Translation options */}
          <div className="translation-dropdown relative"> {/* Added class names */}
            <button
              className="translation-toggle text-sm flex items-center text-gray-600 hover:text-gray-800"
              onClick={() => setShowTranslationOptions(!showTranslationOptions)}
            >
              <span className="mr-1">Translation</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showTranslationOptions && (
              <div className="translation-options absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      selectedTranslation === 'standard'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTranslationChange('standard')}
                  >
                    Standard
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      selectedTranslation === 'modern'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTranslationChange('modern')}
                  >
                    Modern
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      selectedTranslation === 'simple'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTranslationChange('simple')}
                  >
                    Simplified
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      selectedTranslation === 'original'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTranslationChange('original')}
                  >
                    Original Greek
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bookmark button */}
          <button
            className={`bookmark-button p-1 rounded-full ${
              bookmarkPosition === activeSection
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={handleAddBookmark}
            aria-label={bookmarkPosition === activeSection ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Section title if available */}
      {section?.title && (
        <h3 className="section-title text-lg font-medium text-gray-700 mb-3"> {/* Added class name */}
          {section.title}
        </h3>
      )}

      {/* Chapter content */}
      <div className="chapter-text prose max-w-none"> {/* Added class name */}
        {renderSectionContent()}
      </div>

      {/* Navigation controls */}
      <div className="navigation-controls flex justify-between mt-8 pt-4 border-t border-gray-200"> {/* Added class name */}
        <button
          className={`nav-button prev-button flex items-center px-3 py-1 rounded-md ${
            activeSection > 0
              ? 'text-blue-600 hover:bg-blue-50'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          onClick={handlePrevSection}
          disabled={activeSection === 0}
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <div className="section-indicator text-sm text-gray-500"> {/* Added class name */}
          {activeSection + 1} of {chapter.sections.length}
        </div>

        <button
          className={`nav-button next-button flex items-center px-3 py-1 rounded-md ${
            activeSection < chapter.sections.length - 1
              ? 'text-blue-600 hover:bg-blue-50'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          onClick={handleNextSection}
          disabled={activeSection === chapter.sections.length - 1}
        >
          Next
          <svg
            className="w-5 h-5 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </Card>
  );
};

export default ChapterContent;