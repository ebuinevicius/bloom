import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  // const hello = api.example.hello.useQuery({ text: 'from tRPC' });
  const { data: sessionData } = useSession();

  useEffect(() => {
    console.log(sessionData);
    if (!sessionData) {
      router.push('/signup');
    }
  }, []);

  if (sessionData?.user !== undefined) {
    return <>logged in</>;
  }
  return <>logged out</>;
}
/* 
function AuthShowcase() {
  const { data: sessionData } = useSession();
  console.log('sessionData:', sessionData);

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
}
 */
