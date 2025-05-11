// src/routes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your page components
import Home from './pages/Home';
import Game from './pages/Game';
// import Chapter from './pages/Chapter'; // Include if you want a dedicated page for chapters by ID
import Profile from './pages/Profile';
import About from './pages/About';

/**
 * Component that defines the application's routing configuration.
 * Uses react-router-dom to map URLs to page components.
 */
const AppRoutes = () => {
  return (
    // Use BrowserRouter for standard browser history routing
    // Consider HashRouter if deploying to a static server that doesn't handle history mode
    <Router>
      {/* Routes component wraps all individual Route definitions */}
      <Routes>
        {/* Define a Route for each page */}
        {/* The "element" prop specifies which component to render for the given path */}
        <Route path="/" element={<Home />} /> {/* Home page at the root path */}
        <Route path="/game" element={<Game />} /> {/* Main game interface page */}
        {/*
          // Include this route if you want a dedicated page for viewing a specific chapter by ID.
          // Note: If your Game.jsx page dynamically loads chapters based on a selected ID
          // from the sidebar and GameContext, this dedicated Chapter.jsx route might be
          // redundant or serve a different purpose (e.g., deep linking, a non-interactive view).
          <Route path="/chapter/:chapterId" element={<Chapter />} />
        */}
        <Route path="/profile" element={<Profile />} /> {/* User profile page */}
        <Route path="/about" element={<About />} /> {/* About the game page */}

        {/*
          // Optional: Add a catch-all route for 404 Not Found pages
          // <Route path="*" element={<NotFoundPage />} /> // Requires a NotFoundPage component
        */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;