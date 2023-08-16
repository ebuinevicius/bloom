import { getSession, useSession } from 'next-auth/react';
import { useState } from 'react';
import CreatePostModal from '~/components/CreatePostModal';
import ProfileCard from '~/components/profiles/ProfileCard';
import { api } from '~/utils/api';
import { LoadingSpinner } from '~/components/LoadingSpinner';
import InfinitePostList from '~/components/InfinitePostList';
import { GetServerSidePropsContext } from 'next';
import SuggestedUsersCard from '~/components/SuggestedUsersCard';
import { Button } from '~/components/buttons/Button';
import MobileProfileCard from '~/components/profiles/MobileProfileCard';

export default function Home() {
  const { data: session, status } = useSession();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const closeModal = () => {
    setIsPostModalOpen(false);
  };

  if (status === 'loading' || !session?.user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 xl:place-items-center min-h-screen">
      <div className="hidden xl:contents">
        <ProfileCard userId={session?.user.id} onAddNewPost={() => setIsPostModalOpen(true)} />
      </div>
      <div className="flex gap-6 flex-col px-2 self-start items-center w-full">
        <div className="xl:hidden w-full justify-center flex">
          <MobileProfileCard userId={session?.user.id} onAddNewPost={() => setIsPostModalOpen(true)} />
        </div>
        <RecentPosts />
        {isPostModalOpen && <CreatePostModal isOpen={isPostModalOpen} onClose={closeModal} />}
      </div>
      <SuggestedUsersCard />
    </div>
  );
}

function RecentPosts() {
  const posts = api.post.infiniteFeed.useInfiniteQuery({}, { getNextPageParam: (lastPage) => lastPage.nextCursor });

  return (
    <InfinitePostList
      posts={posts.data?.pages.flatMap((page) => page.posts)}
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
