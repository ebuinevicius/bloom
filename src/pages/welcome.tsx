import Link from 'next/link';
import React from 'react';

function Welcome() {
  return (
    <div className="h-screen bg-gradient-to-br from-[#3445e0] to-[#7b18d8]">
      <div className="grid place-items-center gap-4 p-10 text-center">
        <h1 className="text-5xl font-bold text-white">Welcome to Bloom</h1>
        <h2 className="text-2xl text-white">Where ideas bloom.</h2>
        <Link
          href="/signin"
          className="flex items-center gap-3 rounded text-2xl text-white dark:text-black bg-blue-400 hover:bg-blue-300 dark:bg-blue-300 dark:hover:bg-blue-400 px-3 py-1.5 font-semibold"
        >
          <p>Get Started</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
