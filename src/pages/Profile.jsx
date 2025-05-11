// src/pages/Profile.jsx
import React from 'react';
import './Profile.css';
import Header from '../components/layout/Header'; // Layout component
import Footer from '../components/layout/Footer'; // Layout component
import UserProfileComponent from '../components/user/Profile'; // Renamed import to avoid confusion with the page component
import Card from '../components/ui/Card'; // Use Card for content container

/**
 * Profile page component. Displays the user's profile information.
 */
const Profile = () => {
  return (
    <div className="profile-page-container">
      <Header /> {/* Include the Header component */}
      <div className="profile-page-content">
        {/* The UserProfileComponent fetches data from UserContext internally */}
        <UserProfileComponent /> {/* Use the UserProfileComponent */}
      </div>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default Profile;