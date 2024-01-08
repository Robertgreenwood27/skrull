import { useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ThemeContext, themes } from '@/components/theme-context';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState(themes.dark); // Default to dark mode

    const toggleTheme = () => {
      setTheme(theme === themes.dark ? themes.light : themes.dark);
    };

  return (
    <div className={theme}>
      <Component {...pageProps} />
      </div>
  );
}
