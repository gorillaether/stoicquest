// src/components/layout/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Credits, links, etc. */}
      <p>&copy; 2023 Game Title. All rights reserved.</p>
      <div className="footer-links">
        {/* Links */}
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;