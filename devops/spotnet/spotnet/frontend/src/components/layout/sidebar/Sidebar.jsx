import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';

const Sidebar = ({ title, items, className = '' }) => {
  const location = useLocation();
  const [activeItemId, setActiveItemId] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveItemId(hash);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    const currentPath = location.pathname;

    items.forEach((item) => {
      if (item.link === currentPath) {
        setActiveItemId(item.id);
      }
      if (item.children) {
        item.children.forEach((child) => {
          if (child.link === currentPath) {
            setActiveItemId(child.id);
            setExpandedItems((prev) => ({ ...prev, [item.id]: true }));
          }
        });
      }
    });
  }, [location, items]);

  const handleItemClick = (item) => {
    const elementId = item.link.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveItemId(item.id);
      window.history.pushState(null, '', item.link);
    }
    if (item.children) {
      setExpandedItems((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    }
  };

  const renderSidebarItem = (item, level = 0) => {
    const isActive = activeItemId === item.id;
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const itemClass = `w-full flex items-center p-[12.5px] text-gray hover:text-white transition cursor-pointer ${
      isActive ? 'text-white' : ''
    } ${level > 0 ? 'pl-2' : ''}`;

    return (
      <div key={item.id} className="w-full">
        {item.link.startsWith('#') ? (
          <button onClick={() => handleItemClick(item)} className={itemClass}>
            <SidebarItem item={item} isExpanded={isExpanded} hasChildren={hasChildren} isNested={level > 0} />
          </button>
        ) : (
          <Link to={item.link} className={itemClass}>
            <SidebarItem item={item} isExpanded={isExpanded} hasChildren={hasChildren} isNested={level > 0} />
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="ml-6">{item.children.map((child) => renderSidebarItem(child, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed top-[5.5rem] left-0 h-screen w-[375px] border-r border-[#300734] bg-black ${className} hidden lg:block`}
    >
      <nav className="flex flex-col p-8 pt-8 pl-20">
        {title && (
          <div className="border-border-color mb-3 border-b pb-2">
            <h2 className="text-[15px] font-normal text-white">{title}</h2>
          </div>
        )}
        {items.map((item) => renderSidebarItem(item))}
      </nav>
    </div>
  );
};

export default Sidebar;
