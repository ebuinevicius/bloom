import React from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/server/auth';

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid place-items-center gap-4 p-10">
      <h1 className="text-xl font-bold">Sign in to your account.</h1>
      <div className="flex flex-col px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="rounded-lg bg-slate-800 dark:bg-white h-fit">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="flex items-center text-xs font-light hover:font-normal hover:bg-cool-gray-100 rounded w-40 py-2 px-3 text-gray-200 dark:text-gray-600"
                type="button"
                onClick={() => signIn(provider.id)}
              >
                {provider.name == 'Google' ? <GoogleIcon /> : ''}
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <div className="flex-shrink-0 w-max-content pr-2">
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <g fill="#000" fillRule="evenodd">
        <path
          d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"
          fill="#EA4335"
        ></path>
        <path
          d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
          fill="#4285F4"
        ></path>
        <path
          d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z"
          fill="#FBBC05"
        ></path>
        <path
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"
          fill="#34A853"
        ></path>
        <path fill="none" d="M0 0h18v18H0z"></path>
      </g>
    </svg>
  </div>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
