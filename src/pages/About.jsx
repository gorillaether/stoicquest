// src/pages/About.jsx
import React from 'react';
import './About.css';
import Header from '../components/layout/Header'; // Import Header for consistent layout
import Footer from '../components/layout/Footer'; // Import Footer for consistent layout
import Card from '../components/ui/Card'; // Import Card to structure content

/**
 * About page component. Provides information about the game.
 */
const About = () => {
  return (
    <div className="about-page-container">
      <Header /> {/* Include the Header component */}
      <div className="about-page-content">
        <Card className="about-card"> {/* Wrap content in a Card */}
          <h1 className="about-title">About Stoic Quest</h1> {/* Game Title */}
          <p className="about-text">
            Stoic Quest is a unique application designed to help you engage with and apply
            the timeless wisdom of Epictetus' Enchiridion in a modern, interactive way.
            We believe that by gamifying the learning process, we can make philosophical study
            more accessible, engaging, and rewarding.
          </p>
          <p className="about-text">
            Our journey through the Enchiridion is broken down into chapters and sections,
            each accompanied by reflections and challenges designed to test your understanding
            and encourage practical application of Stoic principles in your daily life.
          </p>
          <h2 className="about-subtitle">Your Evolving NFT Avatar</h2> {/* Highlight the NFT aspect */}
          <p className="about-text">
            A core element of Stoic Quest is your personal, evolving NFT avatar. As you
            progress through the chapters, complete challenges, and gain experience points (XP),
            your avatar will level up and visually transform, reflecting your growth on the
            Stoic path. These avatars are soul-bound NFTs, representing your dedication and
            progress within the game.
          </p>
          <h2 className="about-subtitle">Our Mission</h2> {/* Optional: Project Mission */}
          <p className="about-text">
            Our mission is to make Stoic philosophy practical and accessible to everyone,
            leveraging technology to create a unique learning experience that encourages
            consistent engagement and personal development.
          </p>
          {/* Optional: Add sections about the team, technology, or contact info */}
          {/* <div className="about-links">
            <a href="/contact">Contact Us</a>
            <a href="[Link to Project Repository/Website]" target="_blank" rel="noopener noreferrer">Learn More</a>
          </div> */}
        </Card>
      </div>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default About;