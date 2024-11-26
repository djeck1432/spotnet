import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TableOfContents = ({ items }) => {
  const location = useLocation();
  const [activeId, setActiveId] = useState('stake');

  useEffect(() => {
    if (location.pathname === '/vault') {
      setActiveId('stake');
    }

    const handleScroll = () => {
      const sections = document.querySelectorAll('.documentation-section');
      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveId(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleClick = (e, link) => {
    e.preventDefault();
    const targetId = link.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: targetId === 'stake' ? 0 : offsetPosition,
        behavior: 'smooth'
      });

      setActiveId(targetId);
    }
  };

  return (
    <div className="table-of-contents">
      <h3 className="toc-title">Vault</h3>
      <nav className="toc-nav">
        {items.map((item, index) => (
          <div key={index} className="toc-item">
            <a 
              href={item.link}
              onClick={(e) => handleClick(e, item.link)}
              className={`toc-link ${activeId === item.link.replace('#', '') ? 'active' : ''}`}
            >
              • {item.title}
            </a>
            {item.subItems && (
              <div className="toc-subitems">
                {item.subItems.map((subItem, subIndex) => (
                  <a 
                    key={subIndex}
                    href={subItem.link}
                    onClick={(e) => handleClick(e, subItem.link)}
                    className={`toc-sublink ${activeId === subItem.link.replace('#', '') ? 'active' : ''}`}
                  >
                    {subItem.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;