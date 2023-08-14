import React from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/server/auth';

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid place-items-center gap-4 p-10 text-center">
      <h1 className="text-2xl lg:text-4xl font-bold">Sign in to your account.</h1>
      <div className="flex px-6 py-4 justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-dark-800 dark:border-gray-700 lg:w-4/6 lg:py-10 2xl:w-1/2">
        <div className="rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-white dark:hover:bg-gray-400 w-4/6 flex justify-center">
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className="">
              <button
                className="flex items-center gap-5 hover:bg-cool-gray-100 rounded py-2 px-2 text-gray-200 dark:text-gray-600 font-roboto"
                type="button"
                onClick={() => signIn(provider.id)}
              >
                {provider.name == 'Google' ? <GoogleIcon /> : ''}
                <span className="hidden lg:inline-block lg:text-xl">Sign in with {provider.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GoogleIcon = () => <Image src="/images/google_g_logo.png" alt="Google Logo" width="40" height="40" />;

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
