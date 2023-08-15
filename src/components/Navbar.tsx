import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import ThemeSelector from './ThemeSelector';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProfileImage from './ProfileImage';

function Navbar() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-gray-100 border-gray-200 dark:border-dark-800 border-b-[1px] dark:bg-dark-900 w-full">
      <div className="flex justify-around items-center mx-auto p-2 h-20">
        <div>
          <Link href="/" className="text-2xl lg:text-4xl font-bold text-dark-900 dark:text-white">
            Bloom
          </Link>
          <span className="text-xs text-dark-900 dark:text-white">Beta</span>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          {sessionData?.user && (
            <Link href={`/profiles/${sessionData?.user.id}`}>
              <ProfileImage className="h-8 w-8 lg:h-12 lg:w-12" src={`${sessionData?.user.image}`} />
            </Link>
          )}
          <ThemeSelector />
          <button
            className="rounded bg-gray-200 hover:bg-gray-300 dark:bg-dark-800 dark:hover:bg-gray-700 py-1 font-semibold text-gray-800 dark:text-white no-underline transition px-2 lg:px-4 h-8 lg:h-12 lg:text-xl flex items-center w-fit"
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
