import { GetServerSidePropsContext, GetStaticPropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CreatePostModal from '~/components/CreatePostModal';
import InfinitePostList from '~/components/InfinitePostList';
import { LoadingSpinner } from '~/components/LoadingSpinner';
import MobileProfileCard from '~/components/profiles/MobileProfileCard';
import ProfileCard from '~/components/profiles/ProfileCard';
import SuggestedUsersCard from '~/components/SuggestedUsersCard';
import { api } from '~/utils/api';

type ProfilePageProps = {
  id: string;
};

const ProfilePage: NextPage<ProfilePageProps> = ({ id }) => {
  const { data: session, status } = useSession();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const closeModal = () => {
    setIsPostModalOpen(false);
  };

  const posts = api.post.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  if (status === 'loading' || !session?.user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-2 place-items-center min-h-screen">
      <div className="hidden xl:contents">
        <ProfileCard userId={id} onAddNewPost={() => setIsPostModalOpen(true)} />
      </div>
      <div className="flex gap-6 flex-col px-2 self-start items-center w-full">
        <div className="xl:hidden w-full justify-center flex">
          <MobileProfileCard userId={id} onAddNewPost={() => setIsPostModalOpen(true)} />
        </div>
        <InfinitePostList
          posts={posts.data?.pages.flatMap((page) => page.posts)}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage}
          fetchNewPosts={posts.fetchNextPage}
        />
      </div>
      <SuggestedUsersCard />
      {isPostModalOpen && <CreatePostModal isOpen={isPostModalOpen} onClose={closeModal} />}
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  if (!id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { id },
  };
}

export default ProfilePage;
