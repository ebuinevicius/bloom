import Link from 'next/link';
import React from 'react';

function Welcome() {
  return (
    <div className="grid place-items-center gap-4 p-10">
      <h1 className="text-3xl font-bold">Welcome to Bloom</h1>
      <h2 className="text-sm">Where ideas bloom.</h2>
      <Link
        href="/signin"
        className="flex items-center gap-1 rounded text-xs text-white dark:text-black bg-blue-400 dark:bg-blue-300 px-3 py-1.5 font-semibold"
      >
        <p>Get Started</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-2.5 h-2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}

export default Welcome;
