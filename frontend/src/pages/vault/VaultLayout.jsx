import React from 'react';
import { Outlet } from 'react-router-dom';
 import './vaultLayout.css';
import Sidebar from 'components/ui/Components/Sidebar/Sidebar';

export function VaultLayout({ children }) {
  const vaultItems = [
    {
      id: 'home',
      name: 'Home',
      link: '/',
      icon: '•'
    },
    {
      id: 'stake ',
      name: 'Stake',
      link: '/stake',
      icon: '•'
    },
  {
    id: 'withdraw',
    name: 'Withdraw',
    link: '/withdraw',
    icon: '•'
  }
  ];
  return (
    <div className="layout">
      {/* <aside className="sidebar">
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
       </aside> */}
      <Sidebar 
      title='Vault'
  items={vaultItems}
  className=""
/>

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
