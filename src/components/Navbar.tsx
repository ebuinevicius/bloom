import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import ThemeSelector from './ThemeSelector';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Navbar() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-gray-100 border-gray-200 dark:border-gray-800 border-b-[1px] dark:bg-gray-900 w-2/2">
      <div className="max-w-screen-xl flex justify-around items-center mx-auto p-2 h-20">
        <Link href="/" className="text-4xl font-bold">
          Bloom
        </Link>
        <div className="flex flex-row space-x-2 items-center">
          <ThemeSelector />
          <button
            className="rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 px-5 py-1 font-semibold text-black dark:text-white no-underline transition h-12 text-xl"
            onClick={sessionData ? () => signOut({ callbackUrl: '/' }) : () => router.push('/signin')}
          >
            {sessionData ? 'Sign out' : 'Sign in'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
