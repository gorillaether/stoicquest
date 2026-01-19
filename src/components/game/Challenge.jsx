// src/components/game/Challenge.jsx
import React, { useState, useEffect } from 'react';
import './Challenge.css';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Challenge Component
 */
const Challenge = ({ challengeData, onChallengeComplete, isCompleted, completionDetails }) => {
  const [reflectionText, setReflectionText] = useState('');
  const [listText, setListText] = useState('');
  const [journalText, setJournalText] = useState('');
  const [isSubmittedState, setIsSubmittedState] = useState(false);
  const [currentChallengeId, setCurrentChallengeId] = useState(null);

  useEffect(() => {
    if (!challengeData) {
      setCurrentChallengeId(null);
      setIsSubmittedState(false);
      setReflectionText('');
      setListText('');
      setJournalText('');
      return;
    }

    if (challengeData.id !== currentChallengeId) {
      setCurrentChallengeId(challengeData.id);
      const submitted = isCompleted || false;
      setIsSubmittedState(submitted);

      const savedAnswer = completionDetails?.answer || ''; // unified key

      if (challengeData.type === 'reflection') {
        setReflectionText(submitted ? savedAnswer : '');
        setListText('');
        setJournalText('');
      } else if (challengeData.type === 'list') {
        setListText(submitted ? savedAnswer : '');
        setReflectionText('');
        setJournalText('');
      } else if (challengeData.type === 'journal') {
        setJournalText(submitted ? savedAnswer : '');
        setReflectionText('');
        setListText('');
      } else {
        setReflectionText('');
        setListText('');
        setJournalText('');
      }
    }
  }, [challengeData, isCompleted, completionDetails]);

  const handleSubmit = (type, content) => {
    if (!challengeData || isSubmittedState) return;
    onChallengeComplete(challengeData.id, challengeData.xpAward, { answer: content });
    setIsSubmittedState(true);
  };

  const renderChallengeType = () => {
    if (!challengeData) return <p>No challenge available.</p>;

    const commonProps = {
      className: "w-full p-2 border border-gray-300 rounded-md mt-2 focus:ring-blue-500 focus:border-blue-500",
      disabled: isSubmittedState
    };

    switch (challengeData.type) {
      case 'multiple-choice':
        return <p className="text-sm text-gray-500 mt-2">[Multiple Choice UI - Coming Soon]</p>;

      case 'reflection':
        return (
          <>
            <textarea
              {...commonProps}
              rows="4"
              placeholder="Write your thoughts here..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />
            <Button
              onClick={() => handleSubmit('reflection', reflectionText)}
              disabled={isSubmittedState || !reflectionText.trim()}
              className="mt-3"
            >
              {isSubmittedState ? 'Submitted' : 'Submit Reflection'}
            </Button>
          </>
        );

      case 'list':
        return (
          <>
            <textarea
              {...commonProps}
              rows="6"
              placeholder="Enter list items, one per line..."
              value={listText}
              onChange={(e) => setListText(e.target.value)}
            />
            <Button
              onClick={() => handleSubmit('list', listText)}
              disabled={isSubmittedState || !listText.trim()}
              className="mt-3"
            >
              {isSubmittedState ? 'List Submitted' : 'Submit List'}
            </Button>
          </>
        );

      case 'journal':
        return (
          <>
            <textarea
              {...commonProps}
              rows="8"
              placeholder="Write your journal entry here..."
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
            />
            <Button
              onClick={() => handleSubmit('journal', journalText)}
              disabled={isSubmittedState || !journalText.trim()}
              className="mt-3"
            >
              {isSubmittedState ? 'Entry Submitted' : 'Submit Journal Entry'}
            </Button>
          </>
        );

      case 'matching':
        return <p className="text-sm text-gray-500 mt-2">[Matching UI - Coming Soon]</p>;

      default:
        return <p>Unknown challenge type: {challengeData.type || "N/A"}</p>;
    }
  };

  const displayAsSuccessfullySubmitted = isSubmittedState && currentChallengeId === challengeData?.id;

  return (
    <Card className={`challenge-container ${displayAsSuccessfullySubmitted ? 'challenge-submitted opacity-75' : ''}`}>
      <h3 className="challenge-title font-semibold text-lg">
        Challenge: {challengeData?.title || 'Untitled Challenge'}
      </h3>
      {challengeData?.description && (
        <p className="challenge-description text-sm text-gray-700 mt-1 mb-3">
          {challengeData.description}
        </p>
      )}
      <div className="challenge-interactive-area">
        {renderChallengeType()}
      </div>
      {displayAsSuccessfullySubmitted && (
        <p className="challenge-completion-message text-sm text-green-600 mt-3">
          {challengeData.type === 'reflection' ? 'Reflection submitted!' :
           challengeData.type === 'list' ? 'List submitted!' :
           challengeData.type === 'journal' ? 'Journal entry submitted!' :
           'Challenge completed!'}
        </p>
      )}
    </Card>
  );
};

export default Challenge;