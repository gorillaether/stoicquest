// src/App.jsx
import React from 'react';
import './App.css'; // Import global styles for the App container
import { UserProvider } from './contexts/UserContext'; // Import the User Context Provider
import { GameProvider } from './contexts/GameContext'; // Import the Game Context Provider
import AppRoutes from './routes'; // Import the AppRoutes component that defines your routes

function App() {
  return (
    // Wrap the entire application with the context providers
    <UserProvider>
      <GameProvider>
        <div className="App">
          {/*
            The AppRoutes component contains your routing configuration.
            It will render the appropriate page component (Home, Game, Profile, etc.)
            based on the current URL path.
          */}
          <AppRoutes />
        </div>
      </GameProvider>
    </UserProvider>
  );
}

export default App;