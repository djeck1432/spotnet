import React, { useEffect, useState } from 'react';
import './tableOfContentStyles.css';

const TableOfContents = ({ items, defaultActiveId, tabelTitle, headerHeight = 80 }) => {
  const [activeId, setActiveId] = useState(defaultActiveId);

  useEffect(() => {
    if (defaultActiveId) {
      setActiveId(defaultActiveId);
    }

    const handleScroll = () => {
      const sections = document.querySelectorAll('.documentation-section');
      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - headerHeight;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveId(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [defaultActiveId, headerHeight]);

  const handleClick = (e, link) => {
    e.preventDefault();
    const targetId = link.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: targetId === defaultActiveId ? 0 : offsetPosition,
        // top: offsetPosition,

        behavior: 'smooth',
      });

      // setActiveId(targetId);
      setTimeout(() => {
        setActiveId(targetId);
      }, 250);
    }
  };

  return (
    <div className={'table-of-contents'}>
      <div className="toc-title-container">
        <h3 className={'toc-title'}>{tabelTitle}</h3>
      </div>
      <nav className={'toc-nav'}>
        {items.map((item, index) => (
          <div key={index} className={'toc-item'}>
            <a
              href={item.link}
              onClick={(e) => handleClick(e, item.link)}
              className={`${'toc-link'} ${activeId === item.link.replace('#', '') ? 'active' : ''}`}
            >
              • {item.title}
            </a>
            {item.subItems && (
              <div className={'toc-subitems'}>
                {item.subItems.map((subItem, subIndex) => (
                  <a
                    key={subIndex}
                    href={subItem.link}
                    onClick={(e) => handleClick(e, subItem.link)}
                    className={`${'toc-sublink'} ${activeId === subItem.link.replace('#', '') ? 'active' : ''}`}
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
