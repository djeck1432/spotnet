import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './vaultLayout.css';

export function VaultLayout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-content">
          <h2 className="sidebar-title">Vault</h2>
          <nav className="sidebar-nav">
            <NavLink
              to="/"
              className="nav-item"
              activeClassName="active"
            >
              <span className="nav-bullet">•</span>
              Home
            </NavLink>
            <NavLink
              to="/stake"
              className="nav-item"
              activeClassName="active"
            >
              <span className="nav-bullet">•</span>
              Stake
            </NavLink>
            <NavLink
              to="/withdraw"
              className="nav-item"
              activeClassName="active"
            >
              <span className="nav-bullet">•</span>
              Withdraw
            </NavLink>
          </nav>
        </div>
      </aside>

      <main className="@media (max-width: 1024px) {
  .sidebar-content {
    display: none;
  }
}">
        {children}
        <Outlet />
      </main>
    </div>
  );
}
