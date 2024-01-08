import React, { useContext } from 'react';
import { ThemeContext, themes } from './theme-context';
import { FaMoon, FaSun } from 'react-icons/fa'; // Import icons

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Define button style
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5em',
    padding: '10px'
  };

  return (
    <button onClick={toggleTheme} style={buttonStyle}>
      {theme === themes.dark ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
