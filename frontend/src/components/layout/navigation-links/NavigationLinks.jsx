import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationLinks = ({ onNavClick }) => (
  <div className="absolute left-[50%] hidden translate-x-[-50%] items-center gap-[1em] text-base font-medium capitalize duration-300 lg:flex">
    <NavLink
      to="/"
      end
      className={({ isActive }) =>
        isActive
          ? 'text-nav-button-hover font-semibold'
          : 'font-primary relative leading-[150%] font-medium text-white capitalize duration-300 hover:text-[var(--nav-button-hover)]'
      }
      onClick={onNavClick}
    >
      Home
    </NavLink>

    <div className="bg-light-purple h-4 w-[1.5px] rounded-md" />

    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive
          ? 'text-nav-button-hover font-semibold'
          : 'font-primary relative leading-[150%] font-medium text-white capitalize duration-300 hover:text-[var(--nav-button-hover)]'
      }
      onClick={onNavClick}
    >
      Dashboard
    </NavLink>

    

    

    {/* <NavLink
      to="/form"
      className={({ isActive }) =>
        isActive
          ? 'text-nav-button-hover font-semibold'
          : 'font-primary relative leading-[150%] font-medium text-white capitalize duration-300 hover:text-[var(--nav-button-hover)]'
      }
      onClick={onNavClick}
    >
      Form
    </NavLink> */}

    {/* <div className="h-4 w-[1.5px] rounded-md bg-light-purple" /> */}
{/*     
    <NavLink 
      to="/vault" 
      className={({ isActive }) => 
        isActive ? 'text-[var(--nav-button-hover)] font-semibold' : 
        'hover:text-[var(--nav-button-hover)] duration-300 font-medium relative capitalize font-primary leading-[150%] text-white'
      } 
      onClick={onNavClick}
    >
      Vault
    </NavLink>

    <div className="h-4 w-[1.5px] rounded-md bg-light-purple" />

    <NavLink 
      to="/leaderboard" 
      className={({ isActive }) => 
        isActive ? 'text-[var(--nav-button-hover)]' : 
        'hover:text-[var(--nav-button-hover)] duration-300 font-[var(--font-weight-md)] relative capitalize leading-[150%] text-white'
      } 
      onClick={onNavClick}
    >
      Leaderboard
    </NavLink> */}
  </div>
);

export default NavigationLinks;
