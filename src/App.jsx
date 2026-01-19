// src/App.jsx (This is the change you need to make and save)
import React from 'react';
import './App.css';
// import { UserProvider } from './contexts/UserContext'; // <<< --- DELETE or COMMENT OUT this line
import { GameProvider } from './contexts/GameContext';
import AppRoutes from './routes';

function App() {
  return (
    // <UserProvider> {/* <<< --- DELETE or COMMENT OUT this line */}
      <GameProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </GameProvider>
    // </UserProvider> {/* <<< --- DELETE or COMMENT OUT this line */}
  );
}

export default App;