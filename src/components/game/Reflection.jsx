// src/components/game/Reflection.jsx
import React, { useState, useEffect } from 'react';
import './Reflection.css'; // Make sure you have this CSS file or create it for basic styling
import Button from '../ui/Button'; // Ensure this path is correct for your Button component

const Reflection = ({
  promptText,
  reflectionId,
  chapterId, // Added chapterId in case onSave or other logic needs it contextually
  initialContent = '',
  onSave, // Expected signature: onSave(reflectionId, text, chapterId)
}) => {
  // --- CONSOLE LOG TO CHECK PROPS RECEIVED ---
  console.log('[Reflection.jsx] Component rendering/re-rendering. Props received:', {
    promptText,
    reflectionId,
    chapterId,
    initialContentProvided: initialContent, // Log the actual content
    onSaveExists: typeof onSave === 'function',
  });
  // --- END OF CONSOLE LOG ---

  const [text, setText] = useState(initialContent);

  // Update text if the initialContent prop changes (e.g., navigating to a new section)
  useEffect(() => {
    console.log(`[Reflection.jsx] useEffect for initialContent. ID: ${reflectionId}, New initialContent:`, initialContent);
    setText(initialContent || '');
  }, [initialContent, reflectionId]); // Re-run if these change

  const handleSaveClick = () => {
    console.log(`[Reflection.jsx] "Save Reflection" CLICKED. ID: ${reflectionId}, ChapterID: ${chapterId}, Current text:`, text);
    if (onSave) {
      onSave(reflectionId, text, chapterId); // Pass back reflectionId, text, and chapterId
    } else {
      console.error('[Reflection.jsx] onSave prop is missing!');
    }
  };

  return (
    <div className="reflection-area"> {/* Add a class for styling */}
      {promptText && (
        <>
          <h4 className="reflection-prompt-title">Ponder This:</h4>
          <p className="reflection-prompt-text">{promptText}</p>
        </>
      )}
      {!promptText && chapterId && reflectionId && ( // Only show this if prompt is missing but component is rendered
         <p className="reflection-prompt-text">[No specific reflection prompt for this section, feel free to journal.]</p>
      )}
      <textarea
        className="reflection-textarea" // Add class for styling
        placeholder="Your thoughts..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="5"
      />
      <Button onClick={handleSaveClick} className="reflection-save-button" style={{marginTop: '10px'}}>
        Save Reflection
      </Button>
    </div>
  );
};

export default Reflection;