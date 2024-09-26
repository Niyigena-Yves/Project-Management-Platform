import React from 'react'; 
import { Link } from 'react-router-dom';
import '../App.css'; 
const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to ProjectPulse</h1>
      <p>Manage your projects and organizations efficiently.</p>
      <div className="link-container">
        <Link to="/register" className="button get-started">Get Started</Link>
        <Link to="/login" className="button login">Login</Link>
      </div>
    </div>
  );
};

export default Home;
