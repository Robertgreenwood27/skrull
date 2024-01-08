import React from 'react';

export const themes = {
    light: 'light-theme',
    dark: 'dark-theme'
};

export const ThemeContext = React.createContext(
    themes.dark // default value
);
