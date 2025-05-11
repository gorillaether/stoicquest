// src/components/game/Reflection.jsx
import React from 'react';
import './Reflection.css';
import Card from '../ui/Card'; // Assuming Card might be used here

const Reflection = () => {
  return (
    <Card className="reflection-container">
      {/* Space for user reflections/notes */}
      <h3 className="reflection-title">Your Reflection</h3>
      <textarea className="reflection-textarea" placeholder="Write your thoughts here..."></textarea>
    </Card>
  );
};

export default Reflection;