import React from 'react';
import { NavLink } from 'react-router-dom';
import '../header/header.css';

const NavigationLinks = ({ onNavClick }) => (
  <div className="nav-items">
    <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link' : '')} onClick={onNavClick}>
      Home
    </NavLink>
    <div className="nav-divider"></div>
    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')} onClick={onNavClick}>
      Dashboard
    </NavLink>
    {/* <div className="nav-divider"></div> */}
    {/* <NavLink to="/stake" className={({ isActive }) => (isActive ? 'active-link' : '')} onClick={onNavClick}> */}
    {/* Vault */}
    {/* </NavLink> */}
  </div>
);

export default NavigationLinks;
