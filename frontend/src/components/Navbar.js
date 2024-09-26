import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          ProjectPulse
        </Link>

        <div className="nav-center">
          {user && (
            <>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/organizations" className="nav-item">Organizations</Link>
              <Link to="/projects" className="nav-item">Projects</Link>
            </>
          )}
        </div>

        <div className="nav-right">
          {user ? (
            <button onClick={logout} className="logout-button nav-item">Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register" className="nav-item register-button">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
