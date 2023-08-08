import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import CreatePostModal from '~/components/CreatePostModal';
import { PostCard } from '~/components/PostCard';
import ProfileCard from '~/components/ProfileCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { api } from '~/utils/api';
import { LoadingSpinner } from '~/components/LoadingSpinner';
import InfinitePostList from '~/components/InfinitePostList';

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: 'from tRPC' });
  const { data: session, status } = useSession();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const posts = api.post.infiniteFeed.useInfiniteQuery({}, { getNextPageParam: (lastPage) => lastPage.nextCursor });

  const closeModal = () => {
    setIsPostModalOpen(false);
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-5 grid grid-cols-3 place-items-center min-h-screen">
      <div className="self-start w-fit h-fit">
        <ProfileCard onAddNewPost={() => setIsPostModalOpen(true)} />
      </div>
      <div className="grid-col-start-2 grid-col-end-3 flex gap-2 flex-col w-full px-2 self-start">
        <InfinitePostList
          posts={posts.data?.pages.flatMap((page) => page.posts)}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage}
          fetchNewPosts={posts.fetchNextPage}
        />
        {isPostModalOpen && <CreatePostModal isOpen={isPostModalOpen} onClose={closeModal} />}
      </div>
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
