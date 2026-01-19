// src/pages/Home.jsx
import React from 'react';
import './Home.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Home = () => {
  const ipfsVideoUrl = 'https://aqua-gigantic-haddock-37.mypinata.cloud/ipfs/bafybeidghcupbhjze3l6abai7n4kaqmkupo4sf6bfty7233civrqm7oiuy';
  // The image URL for the page background will be used in CSS:
  // "https://aqua-gigantic-haddock-37.mypinata.cloud/ipfs/bafybeic5pzzwfcyo72u62ytmouta242hmgaeed3zjmmzhavboyur7vsrfa"

  // --- Discord Widget Configuration ---
  // vvv IMPORTANT: REPLACE THE LINE BELOW WITH YOUR ACTUAL DISCORD SERVER ID vvv
  const YOUR_DISCORD_SERVER_ID = "1352710232744398908"; 
  // ^^^ IMPORTANT: REPLACE THE LINE ABOVE WITH YOUR ACTUAL DISCORD SERVER ID ^^^
  const discordWidgetUrl = `https://discord.com/widget?id=${YOUR_DISCORD_SERVER_ID}&theme=dark`; // You can change theme to 'light'

  return (
    <div className="home-page-container">
      <Header />

      {/* This div will get the overall background image via CSS */}
      <div className="home-page-content">

        {/* Your existing Welcome Card */}
        <Card className="welcome-card">
          <h1 className="home-title">Welcome to Stoic Quest</h1>
          <p className="home-subtitle">Embark on a journey through Epictetus' Enchiridion and cultivate your inner wisdom.</p>
          <p className="home-text">
            Stoic Quest transforms philosophical study into an engaging game where your progress
            is reflected in the evolution of your unique NFT avatar. Read the Enchiridion,
            complete challenges, earn XP, level up, and unlock new stages of your avatar
            as you deepen your understanding of Stoic philosophy.
          </p>
          <div className="start-button-container">
            <Link to="/game">
              <Button variant="primary" size="large">Start Your Quest</Button>
            </Link>
          </div>
        </Card> {/* End of Welcome Card */}


        {/* --- IPFS Video Player Area --- */}
        {ipfsVideoUrl && ipfsVideoUrl !== 'YOUR_IPFS_VIDEO_URL_HERE' && (
          <div className="home-video-area">
             <h2>Intro to Stoic Quest</h2>
                <video width="100%" controls>
                  <source src={ipfsVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
             <p>Learn about your journey through the Enchiridion.</p>
          </div>
        )}
        {(ipfsVideoUrl === 'YOUR_IPFS_VIDEO_URL_HERE' || !ipfsVideoUrl) && (
             <div className="home-video-area">
                 <p>Intro video coming soon... Replace 'YOUR_IPFS_VIDEO_URL_HERE' with your Pinata video URL.</p>
             </div>
         )}
        {/* ---------------------------------------------------- */}

        {/* --- NEW: Discord Widget Section --- */}
        {YOUR_DISCORD_SERVER_ID && YOUR_DISCORD_SERVER_ID !== "YOUR_SERVER_ID_HERE" && YOUR_DISCORD_SERVER_ID !== "" ? (
          <Card className="discord-widget-card home-discord-widget"> {/* Added home-discord-widget for specific styling if needed */}
            <h2 className="discord-widget-title">Join Our Community!</h2>
            <p className="discord-widget-text">
              Connect with fellow Stoics, discuss your reflections, and get support on our Discord server.
            </p>
            <div className="discord-iframe-container">
              <iframe
                src={discordWidgetUrl}
                width="350" // You can adjust this
                height="500" // You can adjust this
                allowtransparency="true"
                frameBorder="0" // React prefers camelCase for HTML attributes like frameBorder
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                title="Discord Server Widget"
              ></iframe>
            </div>
          </Card>
        ) : (
          <Card className="discord-widget-card home-discord-widget">
            <h2 className="discord-widget-title">Community Hub</h2>
            <p className="discord-widget-text">
              Our community chat will be available here soon! Please ensure the Discord Server ID is configured in Home.jsx.
            </p>
          </Card>
        )}
        {/* --- End of Discord Widget Section --- */}

      </div> {/* Ends home-page-content */}

      <Footer />
    </div> // Ends home-page-container
  );
};

export default Home;