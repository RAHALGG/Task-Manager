import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-tasks"></i>
          TaskFlow
        </Link>
        {isAuthenticated && (
          <div className="navbar-search">
            <i className="fas fa-search search-icon"></i>
            <input type="text" placeholder="بحث..." />
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <div className="navbar-right">
          <button className="nav-btn create-btn">
            <i className="fas fa-plus"></i>
            إنشاء
          </button>
          <div className="nav-notifications">
            <i className="far fa-bell"></i>
          </div>
          <div className="nav-profile">
            <img src={user?.avatar || '/default-avatar.png'} alt="Profile" />
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <span>{user?.name}</span>
                <small>{user?.email}</small>
              </div>
              <div className="dropdown-divider"></div>
              <button onClick={logout}>تسجيل الخروج</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="navbar-right">
          <Link to="/login" className="nav-btn login-btn">تسجيل الدخول</Link>
          <Link to="/register" className="nav-btn signup-btn">إنشاء حساب</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 