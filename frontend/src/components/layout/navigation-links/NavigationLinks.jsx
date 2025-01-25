import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationLinks = ({ onNavClick }) => (
  <div className="hidden lg:flex items-center space-x-4">
    <NavLink
      to="/"
      end
      className={({ isActive }) =>
        isActive ? 'text-brand font-semibold' : 'text-white hover:text-brand'
      }
      onClick={onNavClick}
    >
      Home
    </NavLink>
    <div className="border-l-2 border-nav-divider-bg h-4" />
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive ? 'text-brand font-semibold' : 'text-white hover:text-brand'
      }
      onClick={onNavClick}
    >
      Dashboard
    </NavLink>
    <div className="border-l-2 border-nav-divider-bg h-4" />
    <NavLink
      to="/form"
      className={({ isActive }) =>
        isActive ? 'text-brand font-semibold' : 'text-white hover:text-brand'
      }
      onClick={onNavClick}
    >
      Form
    </NavLink>
  </div>
);

export default NavigationLinks;
