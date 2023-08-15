import { GetServerSidePropsContext, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CreatePostModal from '~/components/CreatePostModal';
import InfinitePostList from '~/components/InfinitePostList';
import ProfileCard from '~/components/ProfileCard';
import SuggestedUsersCard from '~/components/SuggestedUsersCard';
import { api } from '~/utils/api';

type ProfilePageProps = {
  id: string;
};

const ProfilePage: NextPage<ProfilePageProps> = ({ id }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const closeModal = () => {
    setIsPostModalOpen(false);
  };

  const posts = api.post.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <div className="mt-5 grid-cols-1 grid xl:grid-cols-3 xl:place-items-center min-h-screen">
      <ProfileCard userId={id} onAddNewPost={() => setIsPostModalOpen(true)} />
      <div className="flex gap-2 flex-col px-2 self-start items-center w-full">
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
