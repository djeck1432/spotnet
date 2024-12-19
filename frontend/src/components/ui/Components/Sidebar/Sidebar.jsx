import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  title, 
  items, 
  className = '' 
}) => {
  const location = useLocation();
  const [activeItemId, setActiveItemId] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    // Handle hash changes for scroll navigation
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveItemId(hash);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Find and set active item based on current path
    const currentPath = location.pathname;
    items.forEach(item => {
      if (item.link === currentPath) {
        setActiveItemId(item.id);
      }
      if (item.children) {
        item.children.forEach(child => {
          if (child.link === currentPath) {
            setActiveItemId(child.id);
            setExpandedItems(prev => ({ ...prev, [item.id]: true }));
          }
        });
      }
    });
  }, [location, items]);

  const handleItemClick = (item) => {
    if (item.children) {
      // Toggle expansion for items with children
      setExpandedItems(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }));
    } else if (item.link.startsWith('#')) {
      // Handle hash navigation
      const elementId = item.link.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveItemId(item.id);
        // Update URL with hash
        window.history.pushState(null, '', item.link);
      }
    }
  };

  const renderSidebarItem = (item, level = 0) => {
    const isActive = activeItemId === item.id;
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const itemClass = `sidebar-item ${isActive ? 'active' : ''} ${level > 0 ? 'nested' : ''}`;

    return (
      <div key={item.id} className="sidebar-item-wrapper">
        {item.link.startsWith('#') ? (
          <button
            onClick={() => handleItemClick(item)}
            className={itemClass}
          >
            {item.icon && (
              <span className="item-icon">
                {item.icon}
              </span>
            )}
            <span className="item-name">{item.name}</span>
            {hasChildren && (
              <span className="expand-icon">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            )}
          </button>
        ) : (
          <Link
            to={item.link}
            className={itemClass}
          >
            {item.icon && (
              <span className="item-icon">
                {item.icon}
              </span>
            )}
            <span className="item-name">{item.name}</span>
            {hasChildren && (
              <span className="expand-icon">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            )}
          </Link>
        )}
        
        {hasChildren && isExpanded && (
          <div className="nested-items">
            {item.children.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar ${className}`}>
      {title && (
        <div className="sidebar-title">
          <h2>{title}</h2>
        </div>
      )}
      <nav className="sidebar-nav">
        {items.map(item => renderSidebarItem(item))}
      </nav>
    </div>
  );
};

export default Sidebar;