import React, { useContext } from 'react';
import { ThemeContext, themes } from './theme-context'; // Ensure this path is correct


const Divider = () => {
  const { theme } = useContext(ThemeContext);

  const backgroundImageClass = theme === themes.dark ? 'dark-theme-divider' : 'light-theme-divider';

  return (
    <div className={backgroundImageClass}>
    </div>
  );
}

export default Divider;
