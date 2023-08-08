import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/20/solid';

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-8 h-8 text-gray-600" />
      ) : (
        <SunIcon className="w-8 h-8 text-white-400" />
      )}
    </button>
  );
}

export default ThemeSelector;
