import React from 'react';
import ThemeSelector from './ThemeSelector';

function Navbar() {
  return (
    <nav className="bg-gray-100 border-gray-600 border-b-[1px] dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-2">
        <h2 className="text-2xl font-bold">Bloom</h2>
        <ThemeSelector />
      </div>
    </nav>
  );
}

export default Navbar;
