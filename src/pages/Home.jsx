// src/pages/Home.jsx
import React from 'react';
import './Home.css';
import Header from '../components/layout/Header'; // Optional: Include Header for consistency
import Footer from '../components/layout/Footer'; // Optional: Include Footer for consistency
import Card from '../components/ui/Card'; // Use Card for content container
import Button from '../components/ui/Button'; // Use Button for the call to action
import { Link } from 'react-router-dom'; // Use Link for navigation

/**
 * Home page component. Serves as the landing/welcome screen for the game.
 */
const Home = () => {
  return (
    <div className="home-page-container">
      {/* Optional: Include Header. Some landing pages have minimal headers. */}
      <Header />
      <div className="home-page-content">
        <Card className="welcome-card"> {/* Wrap content in a Card */}
          <h1 className="home-title">Welcome to Stoic Quest</h1> {/* Game Title */}
          <p className="home-subtitle">Embark on a journey through Epictetus' Enchiridion and cultivate your inner wisdom.</p>
          <p className="home-text">
            Stoic Quest transforms philosophical study into an engaging game where your progress
            is reflected in the evolution of your unique NFT avatar. Read the Enchiridion,
            complete challenges, earn XP, level up, and unlock new stages of your avatar
            as you deepen your understanding of Stoic philosophy.
          </p>
          {/* Call to Action Button */}
          <div className="start-button-container">
            <Link to="/game"> {/* Link to the main game page */}
              <Button variant="primary" size="large">Start Your Quest</Button> {/* Prominent button */}
            </Link>
          </div>
        </Card>
      </div>
      {/* Optional: Include Footer */}
      <Footer />
    </div>
  );
};

export default Home;