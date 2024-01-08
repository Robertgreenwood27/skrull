import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext, themes } from './theme-context';
import DeskView from './deskView';
import MobileView from './mobileView';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    // ... more links
  ];

  return (
    <div className={`${theme === themes.dark ? 'dark-theme' : 'light-theme'} header relative`}>
      {/* Top row for theme toggle and menu button */}
      <div className="top-row flex justify-between items-center px-4 py-2">
        <ThemeToggle toggleTheme={toggleTheme} />
        {isMobile && (
          <button onClick={() => setIsOpen(!isOpen)} className="menu-button p-2 rounded-md focus:outline-none">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        )}
      </div>
      {/* Content for mobile view or desktop view */}
      {isMobile ? (
        <MobileView isOpen={isOpen} links={links} />
      ) : (
        <DeskView links={links} />
      )}
    </div>
  );
};

export default Header;
