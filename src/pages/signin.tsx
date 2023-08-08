import React from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/server/auth';

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid place-items-center gap-4 p-10">
      <h1 className="text-4xl font-bold">Sign in to your account.</h1>
      <div className="flex px-6 py-4 justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-3/12">
        <div className="rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-white dark:hover:bg-gray-400 w-5/6 flex justify-center">
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className="">
              <button
                className="flex items-center gap-3 text-2xl font-light hover:bg-cool-gray-100 rounded py-2 px-3 text-gray-200 dark:text-gray-600"
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
  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
    alt="Google Logo"
    width="40"
    height="40"
  />
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
