import { getSession, useSession } from 'next-auth/react';
import { useState } from 'react';
import CreatePostModal from '~/components/CreatePostModal';
import ProfileCard from '~/components/ProfileCard';

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: 'from tRPC' });
  const { data: session, status } = useSession();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const closeModal = () => {
    setIsPostModalOpen(false);
  };

  if (status === 'loading') return <p>Loading</p>;

  return (
    <div className="mt-5 grid grid-cols-3 place-items-center">
      <ProfileCard onAddNewPost={() => setIsPostModalOpen(true)} />
      {/* Render the modal conditionally */}
      {isPostModalOpen && <CreatePostModal isOpen={isPostModalOpen} onClose={closeModal} />}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/welcome',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
