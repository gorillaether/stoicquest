// src/components/game/Challenge.jsx
import React, { useState, useEffect } from 'react'; // Added useState and useEffect as they will likely be needed
import './Challenge.css';
import Card from '../ui/Card';

/**
 * Displays and handles interactive challenges for a chapter section.
 * This component will need to render different challenge types based on challengeData.
 * @param {Object} props
 * @param {Object} props.challengeData - The data for the specific challenge
 * @param {string} props.challengeData.id - Unique challenge ID
 * @param {string} props.challengeData.type - Type of challenge (e.g., 'multiple-choice', 'reflection', 'matching')
 * @param {string} props.challengeData.description - Description or prompt for the challenge
 * @param {any} props.challengeData. correctAnswer - The correct answer or criteria for completion
 * @param {number} props.challengeData.xpAward - XP points awarded for completing this challenge
 * @param {function} props.onChallengeComplete - Function to call when the challenge is successfully completed
 */
const Challenge = ({ challengeData, onChallengeComplete }) => {
  // State to manage user interaction or challenge progress (example)
  // const [userAnswer, setUserAnswer] = useState(null);
  // const [isCompleted, setIsCompleted] = useState(false);

  // useEffect(() => {
  //   // Logic to reset challenge state when challengeData changes
  //   // setIsCompleted(false);
  //   // setUserAnswer(null);
  // }, [challengeData]);

  // Function to handle user input or interaction
  // const handleUserInteraction = (input) => {
  //   // Update state based on input
  //   // setUserAnswer(input);
  // };

  // Function to check if the challenge is completed correctly
  // const checkCompletion = () => {
  //   // Logic to compare userAnswer with challengeData.correctAnswer
  //   // If correct:
  //   // setIsCompleted(true);
  //   // if (onChallengeComplete) {
  //   //   onChallengeComplete(challengeData.id, challengeData.xpAward); // Notify parent component
  //   // }
  // };

  // Function to render the specific challenge type based on challengeData.type
  const renderChallengeType = () => {
    if (!challengeData) {
      return <p>No challenge available for this section.</p>;
    }

    switch (challengeData.type) {
      case 'multiple-choice':
        // Render multiple choice options
        return (
          <div>
            <p>{challengeData.description}</p>
            {/* Map through options and render buttons/radio buttons */}
            {/* {challengeData.options.map(option => (
              <button key={option.id} onClick={() => handleUserInteraction(option.id)}>
                {option.text}
              </button>
            ))} */}
             <p>[Multiple Choice Options Here]</p>
          </div>
        );
      case 'reflection':
        // Render a textarea for reflection
        return (
           <div>
             <p>{challengeData.description}</p>
             {/* <textarea value={userAnswer || ''} onChange={(e) => handleUserInteraction(e.target.value)} /> */}
             {/* <button onClick={checkCompletion}>Submit Reflection</button> */}
              <p>[Reflection Textarea and Submit Button Here]</p>
           </div>
        );
       case 'matching':
           // Render matching pairs
           return (
               <div>
                    <p>{challengeData.description}</p>
                    {/* Render matching game UI */}
                    <p>[Matching Game UI Here]</p>
               </div>
           );
      default:
        return <p>Unknown challenge type.</p>;
    }
  };


  return (
    <Card className={`challenge-container ${/*isCompleted ? 'challenge-completed' : ''*/ ''}`}>
      {/* Interactive challenges for each chapter */}
      <h3 className="challenge-title">Challenge: {challengeData?.title || 'Untitled Challenge'}</h3> {/* Use challengeData title if available */}
      {challengeData?.description && <p className="challenge-description">{challengeData.description}</p>}

      <div className="challenge-interactive-area">
        {/* Placeholder for interactive elements - Logic will go here */}
        {renderChallengeType()}
      </div>

      {/* Example of a completion message (will be conditional) */}
      {/* {isCompleted && <p className="challenge-completion-message">Challenge Completed!</p>} */}
    </Card>
  );
};

export default Challenge;