import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import ThemeSelector from './ThemeSelector';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

function Navbar() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  if (!sessionData?.user) {
    return (
      <nav className="bg-gray-100 border-gray-200 dark:border-dark-800 border-b-[1px] dark:bg-dark-900 w-2/2">
        <div className="max-w-screen-xl flex justify-around items-center mx-auto p-2 h-20">
          <div>
            <Link href="/" className="text-4xl font-bold text-dark-900 dark:text-white">
              Bloom
            </Link>
            <span className="text-xs text-dark-900 dark:text-white">Beta</span>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <ThemeSelector />
            <button
              className="rounded bg-gray-200 hover:bg-gray-300 dark:bg-dark-800 dark:hover:bg-gray-700 px-5 py-1 font-semibold text-black dark:text-white no-underline transition h-12 text-xl"
              onClick={sessionData ? () => signOut({ callbackUrl: '/' }) : () => router.push('/signin')}
            >
              {sessionData ? 'Sign out' : 'Sign in'}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-100 border-gray-200 dark:border-dark-800 border-b-[1px] dark:bg-dark-900 w-2/2">
      <div className="max-w-screen-xl flex justify-around items-center mx-auto p-2 h-20">
        <div>
          <Link href="/" className="text-4xl font-bold text-dark-900 dark:text-white">
            Bloom
          </Link>
          <span className="text-xs text-dark-900 dark:text-white">Beta</span>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <Link href={`/profiles/${sessionData?.user.id}`}>
            <Image
              className="rounded-full"
              src={`${sessionData?.user.image}`}
              alt="My Profile"
              width="48"
              height="48"
            />
          </Link>
          <ThemeSelector />
          <button
            className="rounded bg-gray-200 hover:bg-gray-300 dark:bg-dark-800 dark:hover:bg-gray-700 px-5 py-1 font-semibold text-black dark:text-white no-underline transition h-12 text-xl"
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
