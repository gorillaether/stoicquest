// src/pages/About.jsx
import React from 'react';
import './About.css';
import Header from '../components/layout/Header'; // Import Header for consistent layout
import Footer from '../components/layout/Footer'; // Import Footer for consistent layout
import Card from '../components/ui/Card'; // Import Card to structure content

/**
 * About page component. Provides information about the game, Stoicism, Epictetus, and the Enchiridion.
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
            Stoic path. These avatars are unique NFTs, representing your dedication and
            progress within the game.
          </p>

          <h2 className="about-subtitle">Our Mission</h2> {/* Optional: Project Mission */}
          <p className="about-text">
            Our mission is to make Stoic philosophy practical and accessible to everyone,
            leveraging technology to create a unique learning experience that encourages
            consistent engagement and personal development.
          </p>

          {/* --- NEW SECTION: About Epictetus --- */}
          <h2 className="about-subtitle">About Epictetus (c. 50 – c. 135 AD)</h2>
          <p className="about-text">
            Epictetus was a Greek Stoic philosopher. He was born into slavery at Hierapolis, Phrygia
            (present day Pamukkale, Turkey) and lived in Rome until his banishment, when he went
            to Nicopolis in northwestern Greece for the rest of his life. His teachings were written
            down and published by his pupil Arrian in his Discourses and Enchiridion.
          </p>
          <p className="about-text">
            {/* Add more details about his life, his philosophy, key events, etc. */}
            {/* For example: */}
            Epictetus taught that philosophy is a way of life and not just a theoretical discipline.
            To Epictetus, all external events are beyond our control; we should accept whatever
            happens calmly and dispassionately. However, individuals are responsible for their
            own actions, which they can examine and control through rigorous self-discipline.
            {/* You can add links to biographies or further reading here if desired */}
            {/* Example Link: <a href="[URL_TO_EPICTETUS_BIO]" target="_blank" rel="noopener noreferrer">Learn more about Epictetus...</a> */}
          </p>

          {/* --- NEW SECTION: The Enchiridion (Handbook) --- */}
          <h2 className="about-subtitle">The Enchiridion of Epictetus</h2>
          <p className="about-text">
            The Enchiridion, or "Handbook," is a short manual of Stoic ethical advice compiled by Arrian,
            a pupil of Epictetus, in the early 2nd century. It is a guide to practical Stoicism,
            offering concise principles to help individuals live a virtuous and fulfilling life by
            focusing on what is within their control.
          </p>
          <div className="enchiridion-text-section">
            {/* OPTION 1: Link to an external full text (Recommended for very long texts) */}
            <p className="about-text">
              You can read the full text of the Enchiridion from various reputable sources online:
            </p>
            <ul className="about-list">
              <li>
                <a href="http://classics.mit.edu/Epictetus/enchirid.html" target="_blank" rel="noopener noreferrer">
                  The Enchiridion - The Internet Classics Archive (MIT)
                </a>
              </li>
              <li>
                <a href="https://www.gutenberg.org/ebooks/45109" target="_blank" rel="noopener noreferrer">
                  The Enchiridion - Project Gutenberg (multiple formats)
                </a>
              </li>
              {/* Add other links as you find them */}
            </ul>

            {/* OPTION 2: Embed a shorter summary or key excerpts directly (if preferred) */}
            {/*
            <h3 className="about-tertiary-title">Key Excerpts:</h3>
            <p className="about-text">
              "Some things are in our control and others not. Things in our control are opinion,
              pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not
              in our control are body, property, reputation, command, and, in one word, whatever
              are not our own actions." (Enchiridion, 1)
            </p>
            <p className="about-text">
              [Add more excerpts or a summary here if you choose this approach]
            </p>
            */}

            {/* OPTION 3: If the text is moderately short and you have it formatted,
                           you could create a scrollable div here.
                           However, for the full Enchiridion, linking is usually better for UX.
            */}
            {/*
            <div className="scrollable-text-area">
              <p>Full text pasted here...</p>
            </div>
            */}
          </div>

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