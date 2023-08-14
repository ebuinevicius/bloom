import { getSession, useSession } from 'next-auth/react';
import { useState } from 'react';
import CreatePostModal from '~/components/CreatePostModal';
import ProfileCard from '~/components/ProfileCard';
import { api } from '~/utils/api';
import { LoadingSpinner } from '~/components/LoadingSpinner';
import InfinitePostList from '~/components/InfinitePostList';
import { GetServerSidePropsContext } from 'next';
import SuggestedUsersCard from '~/components/SuggestedUsersCard';

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
    <div className="mt-5 xl:grid xl:grid-cols-3 xl:place-items-center min-h-screen">
      <div className="hidden xl:block self-start w-fit h-fit">
        <ProfileCard userId={session?.user.id} onAddNewPost={() => setIsPostModalOpen(true)} />
      </div>
      <div className="grid-col-start-2 grid-col-end-3 flex gap-2 flex-col w-full px-2 self-start">
        <RecentPosts />
        {isPostModalOpen && <CreatePostModal isOpen={isPostModalOpen} onClose={closeModal} />}
      </div>
      <div className="hidden xl:contents self-start">
        <SuggestedUsersCard />
      </div>
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
