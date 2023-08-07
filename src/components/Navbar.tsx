import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import ThemeSelector from './ThemeSelector';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';

function Navbar() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-gray-100 border-gray-600 border-b-[1px] dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-2">
        <h2 className="text-2xl font-bold">Bloom</h2>
        <div className="flex flex-row space-x-2 items-center">
          <ThemeSelector />
          <button
            className="rounded bg-gray-200 dark:bg-gray-800 px-3 py-1 font-semibold text-black dark:text-white no-underline transition hover:bg-white/20"
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
